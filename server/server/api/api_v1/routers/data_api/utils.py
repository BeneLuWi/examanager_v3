import logging
from typing import List, Dict

from fastapi import HTTPException

from server.api.api_v1.routers.data_api.models import (
    Rating,
    Task,
    Exam,
    StudentResult,
    ResultEntry,
)
from server.api.api_v1.routers.data_api.repository.exam_repository import update_exam_in_db
from server.api.api_v1.routers.data_api.repository.result_repository import (
    list_results_from_db_by_exam_id,
    update_result_in_db,
)
from server.config import ExamManagerSettings

settings = ExamManagerSettings()

logging.basicConfig(level=settings.LOGGING_LEVEL)
logger = logging.getLogger(settings.APP_NAME)


async def delete_task_and_results(exam: Exam, task_id: str):
    # 1. find the task
    task_to_delete: Task | None = None
    task: Task
    for task in exam.tasks:
        if str(task.id) == task_id:
            task_to_delete = task
            break

    if task_to_delete is None:
        logger.error(f"Task {task_id} not found")
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    # 2. delete all results for this task
    student_results: List[StudentResult] = await list_results_from_db_by_exam_id(exam_id=exam.id)  # exam_id: str

    student_result: StudentResult
    for student_result in student_results:
        # points_per_task: List[ResultEntry]
        result_entry: ResultEntry
        for result_entry in student_result.points_per_task:
            if result_entry.task_id == task_id:
                #  update student result with a list without the ones with the task id
                student_result.points_per_task.remove(result_entry)
                logger.info(f"Delete result of task {task_id} for student {student_result.student_id}")
                await update_result_in_db(result=student_result)  # result: StudentResult
                break

    # 3. delete the task itself
    logger.info(f"Remove task {task_id} from exam {exam.id}")
    exam.tasks.remove(task_to_delete)
    await update_exam_in_db(exam=exam)


class RatingsFactory:
    """
    Compare: https://de.wikipedia.org/wiki/Vorlage:Punktesystem_der_gymnasialen_Oberstufe
    and https://notenkurve.de/punkte-in-noten-rechner/ for decimal rating
    """

    mss_to_text_rating: Dict[int, str] = {
        0: "Ungenügend",
        1: "Mangelhaft",
        2: "Mangelhaft",
        3: "Mangelhaft",
        4: "Ausreichend",
        5: "Ausreichend",
        6: "Ausreichend",
        7: "Befriedigend",
        8: "Befriedigend",
        9: "Befriedigend",
        10: "Gut",
        11: "Gut",
        12: "Gut",
        13: "Sehr Gut",
        14: "Sehr Gut",
        15: "Sehr Gut",
    }

    mss_to_school_rating: Dict[int, str] = {
        0: "6",
        1: "5-",
        2: "5",
        3: "5+",
        4: "4-",
        5: "4",
        6: "4+",
        7: "3-",
        8: "3",
        9: "3+",
        10: "2-",
        11: "2",
        12: "2+",
        13: "1-",
        14: "1",
        15: "1+",
    }

    mss_to_decimal_rating: Dict[int, float] = {
        # This could either start at 6.0 and end with 1.0 or start at 6.7 and end with 0.7
        0: 6.0,
        1: 5.3,
        2: 5.0,
        3: 4.7,
        4: 4.3,
        5: 4.0,
        6: 3.7,
        7: 3.3,
        8: 3.0,
        9: 2.7,
        10: 2.3,
        11: 2.0,
        12: 1.7,
        13: 1.3,
        14: 1.0,
        15: 0.7,
    }

    default_mss_points_by_percentage: dict[int, float] = {
        0: 0,
        1: 0.20,
        2: 0.27,
        3: 0.33,
        4: 0.39,
        5: 0.455,
        6: 0.50,
        7: 0.55,
        8: 0.60,
        9: 0.65,
        10: 0.70,
        11: 0.75,
        12: 0.80,
        13: 0.85,
        14: 0.90,
        15: 0.95,
    }

    def create_ratings(self, mms_points_by_percentage: Dict[int, float]) -> List[Rating]:
        ratings: List[Rating] = [
            Rating(
                percentage=mms_points_by_percentage[mss],
                mss_points=mss,
                school_rating=self.mss_to_school_rating[mss],
                text_rating=self.mss_to_text_rating[mss],
                decimal_rating=self.mss_to_decimal_rating[mss],
            )
            for mss in range(16)
        ]

        return ratings

    def create_default_ratings(self) -> List[Rating]:
        return self.create_ratings(mms_points_by_percentage=self.default_mss_points_by_percentage)
