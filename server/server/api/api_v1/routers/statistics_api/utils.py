from typing import List, Set
import pandas as pd
import numpy as np

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

    return student_results_df


def create_student_results_dataframe_with_statistics(exam_results_response: ExamResultsResponse):
    student_results_df = create_student_results_dataframe(exam_results_response)
    # todo create different sheet for statistics
    # todo use german labels only

    # 0. Get list of tasks
    tasks: List[Task] = exam_results_response.exam.tasks
    task_names = [task.name for task in tasks]

    columns_to_summarize = task_names
    columns_to_summarize.extend(["Gesamtpunkte", "mss_points"])

    mean_values_by_gender = student_results_df.groupby("Geschlecht")[columns_to_summarize].mean().reset_index()
    mean_values_by_gender["Nachname"] = "Mittelwert"
    mean_values_by_gender["Vorname"] = "(Mean)"

    median_values_by_gender = student_results_df.groupby("Geschlecht")[columns_to_summarize].median().reset_index()
    median_values_by_gender["Nachname"] = "Mittelwert"
    median_values_by_gender["Vorname"] = "(Median)"

    mean_values_absolute_series = student_results_df[columns_to_summarize].mean()
    mean_values_absolute = mean_values_absolute_series.to_frame().T

    mean_values_absolute["Nachname"] = "Mittelwert"
    mean_values_absolute["Vorname"] = "(Mean)"
    mean_values_absolute["Geschlecht"] = " "

    median_values_absolute_series = student_results_df[columns_to_summarize].median()
    median_values_absolute = median_values_absolute_series.to_frame().T

    median_values_absolute["Nachname"] = "Mittelwert"
    median_values_absolute["Vorname"] = "(Median)"
    median_values_absolute["Geschlecht"] = " "

    # 10. Schwierigkeit
    difficulty_series = student_results_df[columns_to_summarize].count()  # todo
    difficulty = difficulty_series.to_frame().T

    difficulty["Nachname"] = "Schwierigkeit"
    difficulty["Vorname"] = "Difficulty"
    difficulty["Geschlecht"] = " "

    # 11. Trennschärfe
    selectivity_series = student_results_df[columns_to_summarize].count()  # todo
    selectivity = selectivity_series.to_frame().T

    selectivity["Nachname"] = "Trennschärfe"
    selectivity["Vorname"] = "Selectivity"
    selectivity["Geschlecht"] = " "

    # 12. Standardabweichung
    standard_deviation_series = student_results_df[columns_to_summarize].std()
    standard_deviation = standard_deviation_series.to_frame().T

    standard_deviation["Nachname"] = "Standardabweichung"
    standard_deviation["Vorname"] = "Standard deviation"
    standard_deviation["Geschlecht"] = " "

    statistics = pd.concat(
        [
            mean_values_by_gender,
            median_values_by_gender,
            mean_values_absolute,
            median_values_absolute,
            difficulty,
            selectivity,
            standard_deviation,
        ]
    )

    combined_dataframe = pd.concat([student_results_df, statistics])
    print(combined_dataframe.to_string())
    return combined_dataframe


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
    student_results_df = create_student_results_dataframe_with_statistics(exam_results_response=exam_results_response)
    student_results_df.to_excel("test.xlsx")
