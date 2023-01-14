import logging
from typing import List, Optional

from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from pymongo.results import InsertOneResult

from server.database import result_collection, student_collection, school_class_collection
from server.api.api_v1.routers.data_api.models import (
    StudentResult,
    CreateResultRequest,
    StudentResultResponse,
    Exam,
    SchoolClass,
    Student,
    Task,
)
from server.config import ExamManagerSettings

settings = ExamManagerSettings()

logging.basicConfig(level=settings.LOGGING_LEVEL)
logger = logging.getLogger(settings.APP_NAME)


###############################################################
#                         CRUD
###############################################################


################
# Create
###############
async def insert_result_in_db(create_result_request: CreateResultRequest) -> StudentResult:
    result = jsonable_encoder(create_result_request)
    inserted: InsertOneResult = await result_collection.insert_one(result)
    return await find_result_by_id_in_db(result_id=inserted.inserted_id)


################
# Read
###############
async def list_results_from_db() -> List[StudentResult]:
    results = await result_collection.find().to_list(1000)
    return list(map(lambda result: StudentResult.parse_obj(result), results))


async def list_results_from_db_by_owner_id(owner_id: str) -> List[StudentResult]:
    results = await result_collection.find({"owner_id": owner_id}).to_list(1000)
    return list(map(lambda result: StudentResult.parse_obj(result), results))


async def list_results_from_db_by_student_id(student_id: str) -> List[StudentResult]:
    results = await result_collection.find({"student_id": student_id}).to_list(1000)
    return list(map(lambda result: StudentResult.parse_obj(result), results))


async def list_results_from_db_by_exam_id(exam_id: ObjectId | str) -> List[StudentResult]:
    exam_id = str(exam_id)
    results = await result_collection.find({"exam_id": exam_id}).to_list(1000)
    return list(map(lambda result: StudentResult.parse_obj(result), results))


async def list_results_from_db_by_school_class_id(school_class_id: str) -> List[StudentResult]:
    results = await result_collection.find({"school_class_id": school_class_id}).to_list(1000)
    return list(map(lambda result: StudentResult.parse_obj(result), results))


async def find_result_by_ids(request: CreateResultRequest) -> Optional[StudentResult]:
    if (
        result := await result_collection.find_one(
            {"$and": [{"exam_id": request.exam_id}, {"student_id": request.student_id}]}
        )
    ) is not None:
        return StudentResult.parse_obj(result)


async def list_results_from_db_by_exam_id_and_school_class_id(
    exam_id: str, school_class_id: str
) -> List[StudentResult]:
    results = await result_collection.find(
        {"$and": [{"exam_id": exam_id}, {"school_class_id": school_class_id}]}
    ).to_list(1000)
    return list(map(lambda result: StudentResult.parse_obj(result), results))


async def list_student_result_responses(exam: Exam, school_class_id: str) -> List[StudentResultResponse]:
    pipeline = [
        {"$match": {"school_class_id": school_class_id}},
        {"$addFields": {"own_id": {"$toString": "$_id"}}},
        {
            "$lookup": {
                "from": "results",
                "localField": "own_id",
                "foreignField": "student_id",
                "as": "result",
                "pipeline": [
                    {
                        "$match": {"$expr": {"$eq": [str(exam.id), "$exam_id"]}},
                    },
                ],
            }
        },
        {"$addFields": {"result": {"$first": "$result"}}},
    ]

    tasks = {str(task.id): task for task in exam.tasks}

    # Student with StudentResult
    students_with_student_result = await student_collection.aggregate(pipeline).to_list(1000)

    def is_deactivated(task: Task) -> bool:
        if task.deactivated_for is not None and school_class_id in task.deactivated_for:
            return True
        else:
            return False

    # Now merge the Tasks and ResultEntries and erase all the irrelevant info from the StudentResultResponse
    for student in students_with_student_result:
        # Skip students without Result
        if "result" not in student:
            continue
        # Extract Optional Self Assessment
        if "self_assessment" in student["result"]:
            student["self_assessment"] = student["result"]["self_assessment"]

        student["result"] = [
            result_entry
            | tasks[result_entry["task_id"]].dict()
            | {"deactivated": is_deactivated(tasks[result_entry["task_id"]])}
            for result_entry in student["result"]["points_per_task"]
        ]
        if "self_assessment" in student["result"]:
            student["self_assessment"] = student["result"]["self_assessment"]

    return list(map(lambda result: StudentResultResponse.parse_obj(result), students_with_student_result))


async def find_school_classes_with_result(exam_id: ObjectId | str) -> List[SchoolClass]:
    """
    Get School Classes with Exam Results
    :param exam_id: Exam to find Results for
    :return: List of School Classes
    """
    exam_id = str(exam_id)
    # Get all Students with Results
    pipeline = [
        {"$match": {"exam_id": exam_id}},
        {"$addFields": {"student_obj_id": {"$toObjectId": "$student_id"}}},
        {"$lookup": {"from": "students", "localField": "student_obj_id", "foreignField": "_id", "as": "student"}},
        {"$addFields": {"student": {"$first": "$student"}}},
    ]

    results_with_students = await result_collection.aggregate(pipeline).to_list(1000)

    # Find School Classes for Students
    school_class_set: set[ObjectId] = set()

    # Get List of unique School Class IDs
    for r_w_s in results_with_students:
        school_class_id = r_w_s["student"]["school_class_id"]
        school_class_set.add(ObjectId(school_class_id))

    school_class_list = list(school_class_set)

    # Fetch the School Class Objects
    school_classes = await school_class_collection.find({"_id": {"$in": school_class_list}}).to_list(1000)

    return list(map(lambda sc: SchoolClass.parse_obj(sc), school_classes))


async def find_result(exam_id: ObjectId | str, student_id: ObjectId | str) -> Optional[StudentResult]:
    exam_id = str(exam_id)
    student_id = str(student_id)

    if (
        student_result := await result_collection.find_one({"$and": [{"student_id": student_id}, {"exam_id": exam_id}]})
    ) is not None:
        return StudentResult.parse_obj(student_result)


async def find_result_by_id_in_db(result_id: ObjectId | str) -> Optional[StudentResult]:
    if type(result_id) is str:
        result_id = ObjectId(result_id)

    if (result := await result_collection.find_one({"_id": result_id})) is not None:
        return StudentResult.parse_obj(result)


################
# Update
###############
async def update_result_in_db(result: StudentResult) -> StudentResult:
    result_dict = jsonable_encoder(result)
    del result_dict["_id"]

    if len(result_dict) >= 1:
        update_result = await result_collection.update_one({"_id": result.id}, {"$set": result_dict})
        if update_result.modified_count == 1:
            if (updated_user := await result_collection.find_one({"_id": result.id})) is not None:
                return updated_user

    if (existing_user := await result_collection.find_one({"_id": result.id})) is not None:
        return existing_user

    raise RuntimeError(f"result {result.name} not found")


################
# Delete
###############
async def delete_result_in_db(result_id: ObjectId | str) -> bool:
    if type(result_id) is str:
        result_id = ObjectId(result_id)

    deleted_result = await result_collection.delete_one({"_id": result_id})
    return deleted_result.deleted_count == 1


async def delete_results_by_school_class_id(school_class_id: ObjectId | str) -> bool:
    # Get all Students of a School Class
    school_class_id = str(school_class_id)
    students_raw = await student_collection.find({"school_class_id": school_class_id}).to_list(1000)
    students = list(map(lambda sc: Student.parse_obj(sc), students_raw))
    # Get the IDs
    student_ids = list(map(lambda student: str(student.id), students))
    # Now delete the results for any Student
    deleted = await result_collection.delete_many({"student_id": {"$in": student_ids}})
    return deleted.deleted_count > 0
