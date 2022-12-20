from typing import List, Set
import pandas as pd

from server.api.api_v1.routers.data_api.models import (
    ExamResultsResponse,
    Rating,
    Exam,
    Task,
    StudentResultResponse,
    ResultEntryResponse,
)


def create_student_results_dataframe(exam_results_response: ExamResultsResponse):
    """
    für jeden schüler:
    vor und nachname, geschlecht, note (text), note dezimal, mss, punkte, aufgabe 1-n
    :return:
    """
    # 0. Get list of tasks
    tasks: List[Task] = exam_results_response.exam.tasks
    task_names = [task.name for task in tasks]
    max_points_for_exam: float = calc_max_points_for_exam(exam_results_response.exam)

    # 1. Create empty dataframe
    # student_results_df = pd.DataFrame(columns=["Nachname", "Vorname", "Geschlecht", "Note", "MSS", "Gesamtpunkte"])
    student_results_df = pd.DataFrame()

    # 2. Add people and results
    student_result_response: StudentResultResponse
    index = 0
    for student_result_response in exam_results_response.studentResults:
        student_dict = {
            "Nachname": student_result_response.lastname,
            "Vorname": student_result_response.firstname,
            "Geschlecht": student_result_response.gender,
        }
        result_entry: ResultEntryResponse
        for result_entry in student_result_response.result:
            student_dict[result_entry.name] = result_entry.points
        student_results_df = pd.concat([student_results_df, pd.DataFrame(student_dict, index=[index])], axis=0)
        index = index + 1

    student_results_df["Gesamtpunkte"] = student_results_df[task_names].sum(axis=1)
    student_results_df["Erreichte Punkte relativ"] = student_results_df["Gesamtpunkte"] / max_points_for_exam

    # student_results_df = pd.concat([student_results_df, student_results_df.
    #                               apply(lambda row: pd.Series(get_exam_rating_for_reached_percentage(
    #    exam=exam_results_response.exam,
    #    reached_percentage=row["Erreichte Punkte relativ"]).dict()), axis=1)], axis=0)

    rating_results = [
        get_exam_rating_for_reached_percentage(
            exam=exam_results_response.exam, reached_percentage=reached_percentage
        ).dict()
        for reached_percentage in student_results_df["Erreichte Punkte relativ"]
    ]

    ratings_dataframe = pd.DataFrame(rating_results)

    student_results_df = pd.concat([student_results_df, ratings_dataframe], axis=1)

    # todo

    # 6. a) Durchschnittliche Punkte nach Aufgabe bzw. Gesamtpunkte
    # 6. b) Durchschnittliche MSS - Punkte nach Aufgabe bzw. Gesamtpunkte

    # 7. a) Durchschnittliche Punkte nach Aufgabe bzw. Gesamtpunkte D(ivers)
    # 7. b) Durchschnittliche MSS - Punkte nach Aufgabe bzw. Gesamtpunkte D(ivers)

    # 8. a) Durchschnittliche Punkte nach Aufgabe bzw. Gesamtpunkte W(omen)
    # 8. b) Durchschnittliche MSS - Punkte nach Aufgabe bzw. Gesamtpunkte W(omen)

    # 9. a) Durchschnittliche Punkte nach Aufgabe bzw. Gesamtpunkte M(en)
    # 9. b) Durchschnittliche MSS - Punkte nach Aufgabe bzw. Gesamtpunkte M(en)

    # 10. Schwierigkeit
    # 11. Trennschärfe
    # 12. Standardabweichung

    print(student_results_df.to_string())
    return student_results_df


def calc_max_points_for_exam(exam: Exam):
    reachable: float = sum(task.max_points if task.max_points else 0 for task in exam.tasks)
    return reachable


def calculate_reached_percentage(sum_of_points: float, max_points: float):
    return sum_of_points / max_points


def get_exam_rating_for_reached_percentage(exam: Exam, reached_percentage: float) -> Rating:
    def get_mss_points(a_rating: Rating):
        return a_rating.mss_points

    # optionally sort to be extra sure they are sorted

    sorted_ratings: List[Rating] = exam.ratings.copy()
    sorted_ratings.sort(key=get_mss_points, reverse=False)

    previous_rating = sorted_ratings[0]
    for rating in sorted_ratings:
        if rating.percentage > reached_percentage:
            return previous_rating
        previous_rating = rating

    # if the reached percentage is bigger then the highest needed return the last entry containing the highest grading
    return sorted_ratings[len(sorted_ratings) - 1]


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
