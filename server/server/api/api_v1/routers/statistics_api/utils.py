from typing import List
import pandas as pd

from server.api.api_v1.routers.data_api.models import ExamResultsResponse, Rating, Exam, Task


def create_student_results_dataframe(exam_results_response: ExamResultsResponse):
    """
    für jeden schüler:
    vor und nachname, geschlecht, note (text), note dezimal, mss, punkte, aufgabe 1-n
    :return:
    """
    # 0. Get list of tasks
    tasks: List[Task] = exam_results_response.exam.tasks

    # 1. Create empty dataframe
    student_results_df = pd.DataFrame(columns=["Nachname", "Vorname", "Geschlecht", "Note", "MSS", "Gesamtpunkte"])

    # 2.
    pass


def calc_max_points_for_exam(exam: Exam):
    reachable: float = sum(task.max_points if task.max_points else 0 for task in exam.tasks)
    return reachable


def calculate_reached_percentage(sum_of_points: float, max_points: float):
    return sum_of_points / max_points


def calc_grade(exam: Exam, sum_of_points: float, reached_percentage: float) -> Rating:
    if sum_of_points == 0:
        return exam.ratings[0]

    for rating in exam.ratings:
        if rating.percentage >= reached_percentage:
            return rating

    return exam.ratings[len(exam.ratings) - 1]


async def calculate_statistics(exam_results_response: ExamResultsResponse):
    """
    1. Get ratings for result
    2. Calculate max points for tasks: List[Task] in exam
    3. for each in studentResults: List[StudentResultResponse]
        a) for each in  ResultEntryResponse(ResultEntry, Task):
        calculate number of points i.e. calculate points for each submitted task
        b) For the sum of points over all tasks for each Student calculate the grading (calc_grade)
    :param exam_results_response:
    :return:
    """
    ratings: List[Rating] = exam_results_response.exam.ratings
    max_points_for_task = calc_max_points_for_exam(exam=exam_results_response.exam)
    create_student_results_dataframe(exam_results_response=exam_results_response)
    print(exam_results_response)
