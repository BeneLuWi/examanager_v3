import logging
from typing import List, Optional

from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from pymongo.results import InsertOneResult

from server.database import exam_collection
from server.api.api_v1.routers.data_api.models import Exam, CreateExamRequest
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
async def insert_exam_in_db(create_exam_request: CreateExamRequest) -> Exam:
    exam = jsonable_encoder(create_exam_request)
    inserted: InsertOneResult = await exam_collection.insert_one(exam)
    return await find_exam_by_id_in_db(exam_id=inserted.inserted_id)


################
# Read
###############
async def list_exams_from_db() -> List[Exam]:
    exams = await exam_collection.find().to_list(1000)
    return list(map(lambda exam: Exam.parse_obj(exam), exams))


async def list_exams_from_db_by_owner_id(owner_id: str) -> List[Exam]:
    exams = await exam_collection.find({"owner_id": owner_id}).to_list(1000)
    return list(map(lambda exam: Exam.parse_obj(exam), exams))


async def find_exam_by_id_in_db(exam_id: ObjectId) -> Optional[Exam]:
    if (exam := await exam_collection.find_one({"_id": exam_id})) is not None:
        return Exam.parse_obj(exam)


################
# Update
###############
async def update_exam_in_db(exam: Exam) -> Exam:
    exam_dict = jsonable_encoder(exam)
    del exam_dict["_id"]

    if len(exam_dict) >= 1:
        update_result = await exam_collection.update_one({"_id": exam.id}, {"$set": exam_dict})
        if update_result.modified_count == 1:
            if (updated_user := await exam_collection.find_one({"_id": exam.id})) is not None:
                return updated_user

    if (existing_user := await exam_collection.find_one({"_id": exam.id})) is not None:
        return existing_user

    raise RuntimeError(f"exam {exam.name} not found")


################
# Delete
###############
async def delete_exam_in_db(exam_id: ObjectId) -> bool:
    deleted_exam = await exam_collection.delete_one({"_id": exam_id})
    return deleted_exam.deleted_count == 1
