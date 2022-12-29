from typing import List, Set, Optional
import pandas as pd
import numpy as np
from pydantic import ValidationError

from server.api.api_v1.routers.statistics_api.models import StatisticsResult, TaskResult, StatisticsElement

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


def create_student_statistics_dataframe(exam_results_response: ExamResultsResponse, student_results_df: pd.DataFrame):
    # 0. Get list of tasks
    tasks: List[Task] = exam_results_response.exam.tasks
    task_names = [task.name for task in tasks]

    columns_to_summarize = task_names.copy()
    columns_to_summarize.extend(["Gesamtpunkte", "mss_points"])

    # 1 Mean
    mean_values_by_gender = student_results_df.groupby("Geschlecht")[columns_to_summarize].mean().reset_index()
    mean_values_by_gender["Statistik"] = "Mittelwert (Mean)"

    mean_values_absolute_series = student_results_df[columns_to_summarize].mean()
    # these next lines help to transform the series into the needed dataframe format which allows to concat then later
    mean_values_absolute = mean_values_absolute_series.to_frame().T
    mean_values_absolute["Statistik"] = "Mittelwert (Mean)"
    mean_values_absolute["Geschlecht"] = ""

    # 2. Median
    median_values_by_gender = student_results_df.groupby("Geschlecht")[columns_to_summarize].median().reset_index()
    median_values_by_gender["Statistik"] = "Mittelwert (Median)"

    median_values_absolute_series = student_results_df[columns_to_summarize].median()
    median_values_absolute = median_values_absolute_series.to_frame().T
    median_values_absolute["Statistik"] = "Mittelwert (Median)"
    median_values_absolute["Geschlecht"] = ""

    # 10. Schwierigkeit
    reachable_per_task = pd.DataFrame({task.name: task.max_points for task in tasks}, columns=task_names, index=[0])
    # reachable_per_task["Sorting"]="per_task"
    number_of_w = len(student_results_df[student_results_df["Geschlecht"] == "w"])
    number_of_d = len(student_results_df[student_results_df["Geschlecht"] == "d"])
    number_of_m = len(student_results_df[student_results_df["Geschlecht"] == "m"])
    number_total = len(student_results_df)
    if number_of_w + number_of_d + number_of_m != number_total:
        raise RuntimeError("BLUBB")

    reachable_total = reachable_per_task * number_total
    reachable_w = reachable_per_task * number_of_w
    reachable_m = reachable_per_task * number_of_m
    reachable_d = reachable_per_task * number_of_d

    # todo calculate sum reached (total and by gender -> groupby)

    # todo calculate difficulty = (total_reachable / sum_reached) * 100
    # todo calculate difficulty_w = (reachable_w / reached_w) * 100

    print("reachable_per_task")
    print(reachable_per_task)
    print("reachable_per_task")

    # todo this is blödsinn^^
    total_reached_per_task = student_results_df[columns_to_summarize].sum()  # todo
    difficulty = total_reached_per_task.to_frame().T

    difficulty["Statistik"] = "Schwierigkeit"
    difficulty["Geschlecht"] = ""

    # 11. Trennschärfe

    """
    part-whole Korrelation
    Trennschäfe der einzelnen Aufgaben
    Pearsons Correlation: https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.corr.html

    
    points_reached: double[] = (Erreichte Punkte in Aufgabe X pro Student)
    exam_points_reached: double[] = (Erreichte Punkte in Exam Y pro Student)

    # len(points_reached) == len(Students_with_results)
    # len(exam_points_reached) == len(Students_with_results)

    exam_points_reached -= points_reached

    if len(Students_with_results) < 2:
        return 0

    Corr(x, y)
    
    """

    selectivity_series = student_results_df[columns_to_summarize].count()  # todo
    selectivity = selectivity_series.to_frame().T

    selectivity["Statistik"] = "Trennschärfe"
    selectivity["Geschlecht"] = ""

    # 12. Standardabweichung
    standard_deviation_by_gender = student_results_df.groupby("Geschlecht")[columns_to_summarize].std().reset_index()
    standard_deviation_by_gender["Statistik"] = "Standardabweichung"

    standard_deviation_series = student_results_df[columns_to_summarize].std()
    standard_deviation_absolute = standard_deviation_series.to_frame().T
    standard_deviation_absolute["Statistik"] = "Standardabweichung"
    standard_deviation_absolute["Geschlecht"] = ""

    statistics = pd.concat(
        [
            mean_values_absolute,
            mean_values_by_gender,
            median_values_absolute,
            median_values_by_gender,
            standard_deviation_absolute,
            standard_deviation_by_gender,
            difficulty,
            selectivity,
        ]
    )

    return statistics


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


def create_statistics_element(student_statistics_df: pd.DataFrame, column_name, metric_name) -> StatisticsElement:
    # logger.info(f"Create statistics element for {column_name} and {metric_name}")
    metric_data = student_statistics_df[student_statistics_df["Statistik"] == metric_name]
    values_total = metric_data[metric_data["Geschlecht"] == ""]
    values_d = metric_data[metric_data["Geschlecht"] == "d"]
    values_m = metric_data[metric_data["Geschlecht"] == "m"]
    values_w = metric_data[metric_data["Geschlecht"] == "w"]

    value_total = values_total[column_name].squeeze()
    value_d = values_d[column_name].squeeze()
    value_m = values_m[column_name].squeeze()
    value_w = values_w[column_name].squeeze()

    if type(value_total) is pd.Series:
        value_total = 0

    if type(value_d) is pd.Series:
        value_d = None

    if type(value_m) is pd.Series:
        value_m = None

    if type(value_w) is pd.Series:
        value_w = None

    try:
        return StatisticsElement(
            name=column_name, value_total=value_total, value_d=value_d, value_w=value_w, value_m=value_m
        )
    except ValidationError as v_e:
        print(v_e)


def create_task_result_object(student_statistics_df: pd.DataFrame, columns_to_process, metric_name) -> TaskResult:
    statistics: List[StatisticsElement] = list()
    for column in columns_to_process:
        statistics.append(
            create_statistics_element(
                student_statistics_df=student_statistics_df, column_name=column, metric_name=metric_name
            )
        )
    return TaskResult(name=metric_name, statistics=statistics)


def create_statistics_result_object(student_statistics_df: pd.DataFrame, columns_to_process) -> StatisticsResult:
    # metric_names = ["Mittelwert (Mean)", "Mittelwert (Median)", "Schwierigkeit", "Trennschärfe"]
    # for metric in metric_names:
    #    create_task_result_object(student_statistics_df=student_statistics_df, columns_to_process=columns_to_process,
    #                              metric_name=metric)

    mean_result = create_task_result_object(
        student_statistics_df=student_statistics_df,
        columns_to_process=columns_to_process,
        metric_name="Mittelwert (Mean)",
    )

    median_result = create_task_result_object(
        student_statistics_df=student_statistics_df,
        columns_to_process=columns_to_process,
        metric_name="Mittelwert (Median)",
    )

    standard_deviation_result = create_task_result_object(
        student_statistics_df=student_statistics_df,
        columns_to_process=columns_to_process,
        metric_name="Standardabweichung",
    )

    difficulty_result = create_task_result_object(
        student_statistics_df=student_statistics_df, columns_to_process=columns_to_process, metric_name="Schwierigkeit"
    )

    correlation_result = create_task_result_object(
        student_statistics_df=student_statistics_df, columns_to_process=columns_to_process, metric_name="Trennschärfe"
    )

    self_assessment_result = create_task_result_object(
        student_statistics_df=student_statistics_df,
        columns_to_process=columns_to_process,
        metric_name="Selbsteinschätzung",
    )

    return StatisticsResult(
        mean=mean_result,
        median=median_result,
        standard_deviation=standard_deviation_result,
        difficulty=difficulty_result,
        correlation=correlation_result,
        self_assessment=self_assessment_result,
    )


async def calculate_statistics_object(exam_results_response: ExamResultsResponse):
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

    student_results_df = create_student_results_dataframe(exam_results_response=exam_results_response)
    student_statistics_df = create_student_statistics_dataframe(
        exam_results_response=exam_results_response, student_results_df=student_results_df
    )

    tasks: List[Task] = exam_results_response.exam.tasks
    task_names = [task.name for task in tasks]

    columns_to_summarize = task_names
    columns_to_summarize.extend(["Gesamtpunkte", "mss_points"])

    statistics: StatisticsResult = create_statistics_result_object(
        student_statistics_df=student_statistics_df, columns_to_process=columns_to_summarize
    )
    return statistics


async def calculate_statistics_excel(exam_results_response: ExamResultsResponse):
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
    student_results_df = create_student_results_dataframe(exam_results_response=exam_results_response)
    student_statistics_df = create_student_statistics_dataframe(
        exam_results_response=exam_results_response, student_results_df=student_results_df
    )
    print("student_statistics_df")
    print(student_statistics_df)

    # create an Excel writer object
    with pd.ExcelWriter("test.xlsx") as writer:
        # use to_excel function and specify the sheet_name and index
        # to store the dataframe in specified sheet
        student_results_df.to_excel(writer, sheet_name="Ergebnisse", index=False)
        student_statistics_df.to_excel(writer, sheet_name="Statistik", index=False)
