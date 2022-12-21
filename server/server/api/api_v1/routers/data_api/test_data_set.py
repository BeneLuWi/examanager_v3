import json
from random import randint

import httpx

from server.api.api_v1.routers.auth_api.models import User
from server.api.api_v1.routers.data_api.controllers.exam_controller import create_exam, update_exam
from server.api.api_v1.routers.data_api.models import (
    CreateSchoolClassRequest,
    CreateStudentRequest,
    CreateExamRequest,
    Task,
    ResultEntry,
    CreateResultRequest,
    Exam,
)
from server.api.api_v1.routers.data_api.repository.result_repository import insert_result_in_db
from server.api.api_v1.routers.data_api.repository.school_class_repository import insert_school_class_in_db
from server.api.api_v1.routers.data_api.repository.student_repository import (
    insert_student_in_db,
    list_students_from_db_by_school_class_id,
)


async def create_test_dataset(user: User, school_class_name: str):
    owner_id = str(user.id)
    school_class = await insert_school_class_in_db(
        CreateSchoolClassRequest(name=school_class_name, description="Leistungskurs in MSS Stufe 12", owner_id=owner_id)
    )

    school_class_id = str(school_class.id)

    param_sets = [
        {"count": 10, "type": "male", "with_surname": "true", "frequency": "common", "gender": "m"},
        {"count": 10, "type": "female", "with_surname": "true", "frequency": "common", "gender": "w"},
        {"count": 5, "type": "male", "with_surname": "true", "frequency": "common", "gender": "d"},
        {"count": 5, "type": "female", "with_surname": "true", "frequency": "common", "gender": "d"},
    ]

    for params in param_sets:
        response = httpx.get(
            "https://namey.muffinlabs.com/name.json",
            params=params,
        )
        if response.status_code != 200:
            raise ValueError("Could not Load Names")

        name_list = json.loads(response.content)
        for name in name_list:
            [firstname, lastname] = name.split()
            await insert_student_in_db(
                CreateStudentRequest(
                    firstname=firstname,
                    lastname=lastname,
                    owner_id=owner_id,
                    school_class_id=school_class_id,
                    gender=params["gender"],
                )
            )

    students = await list_students_from_db_by_school_class_id(school_class_id=school_class_id, owner_id=owner_id)

    tasks_mathe = [
        {"name": "Aufgabe 1", "max_points": 20},
        {"name": "Aufgabe 2", "max_points": 10},
        {"name": "Aufgabe 3", "max_points": 20},
        {"name": "Aufgabe 4", "max_points": 10},
        {"name": "Aufgabe 5", "max_points": 40},
    ]

    exam_mathe = await create_exam(
        CreateExamRequest(name="Mathematik", description="Klausur für Leistungskurs", owner_id=owner_id, tasks=[]),
        user,
    )
    exam_mathe.tasks = tasks_mathe
    exam_mathe: Exam = await update_exam(exam_mathe)

    tasks_eng = [
        {"name": "Aufgabe 1", "max_points": 10},
        {"name": "Aufgabe 2", "max_points": 10},
        {"name": "Aufgabe 3", "max_points": 10},
        {"name": "Aufgabe 4", "max_points": 10},
        {"name": "Aufgabe 5", "max_points": 10},
    ]

    exam_eng = await create_exam(
        CreateExamRequest(name="Englisch", description="Klausur für Grundkurs", owner_id=owner_id, tasks=[]),
        user,
    )
    exam_eng.tasks = tasks_eng
    exam_eng: Exam = await update_exam(exam_eng)

    def random_points(task: Task) -> ResultEntry:
        return ResultEntry(task_id=str(task.id), points=randint(0, task.max_points))

    for student in students:
        await insert_result_in_db(
            CreateResultRequest(
                exam_id=str(exam_eng.id),
                student_id=str(student.id),
                owner_id=owner_id,
                points_per_task=[random_points(task) for task in exam_eng.tasks],
            )
        )

    for student in students:
        await insert_result_in_db(
            CreateResultRequest(
                exam_id=str(exam_mathe.id),
                student_id=str(student.id),
                owner_id=owner_id,
                points_per_task=[random_points(task) for task in exam_mathe.tasks],
            )
        )
