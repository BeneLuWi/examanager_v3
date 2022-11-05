import logging
from typing import List, Optional

from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from pymongo.results import InsertOneResult

from server.database import student_collection
from server.api.api_v1.routers.data_api.models import Student, CreateStudentRequest
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
async def insert_student_in_db(create_student_request: CreateStudentRequest) -> Student:
    student = jsonable_encoder(create_student_request)
    inserted: InsertOneResult = await student_collection.insert_one(student)
    return await find_student_by_id_in_db(student_id=inserted.inserted_id)


################
# Read
###############
async def list_students_from_db() -> List[Student]:
    students = await student_collection.find().to_list(1000)
    return list(map(lambda student: Student.parse_obj(student), students))


async def list_students_from_db_by_owner_id(owner_id: str) -> List[Student]:
    students = await student_collection.find({"owner_id": owner_id}).to_list(1000)
    return list(map(lambda student: Student.parse_obj(student), students))


async def list_students_from_db_by_school_class_id(school_class_id: str, owner_id: str) -> List[Student]:
    students = await student_collection.find(
        {"$and": [{"owner_id": owner_id}, {"school_class_id": school_class_id}]}
    ).to_list(1000)
    return list(map(lambda student: Student.parse_obj(student), students))


async def find_student_by_id_in_db(student_id: ObjectId | str) -> Optional[Student]:
    if type(student_id) is str:
        student_id = ObjectId(student_id)

    if (student := await student_collection.find_one({"_id": student_id})) is not None:
        return Student.parse_obj(student)


################
# Update
###############
async def update_student_in_db(student: Student) -> Student:
    student_dict = jsonable_encoder(student)
    del student_dict["_id"]

    if len(student_dict) >= 1:
        update_result = await student_collection.update_one({"_id": student.id}, {"$set": student_dict})
        if update_result.modified_count == 1:
            if (updated_user := await student_collection.find_one({"_id": student.id})) is not None:
                return updated_user

    if (existing_user := await student_collection.find_one({"_id": student.id})) is not None:
        return existing_user

    raise RuntimeError(f"student {student.firstname} - {student.lastname} ({student.id}) not found")


################
# Delete
###############
async def delete_student_in_db(student_id: ObjectId | str) -> bool:
    if type(student_id) is str:
        student_id = ObjectId(student_id)

    deleted_student = await student_collection.delete_one({"_id": student_id})
    return deleted_student.deleted_count == 1
