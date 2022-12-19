import logging
from typing import List, Optional

from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from pymongo.results import InsertOneResult

from server.database import result_collection, student_collection
from server.api.api_v1.routers.data_api.models import (
    StudentResult,
    CreateResultRequest,
    StudentResultResponse,
    Exam,
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


async def list_results_from_db_by_exam_id(exam_id: str) -> List[StudentResult]:
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

    # Now merge the Tasks and ResultEntries and erase all the irrelevant info from the StudentResultResponse
    for student in students_with_student_result:
        if "result" in student:
            student["result"] = [
                result_entry | tasks[result_entry["task_id"]].dict()
                for result_entry in student["result"]["points_per_task"]
            ]

    return list(map(lambda result: StudentResultResponse.parse_obj(result), students_with_student_result))


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
