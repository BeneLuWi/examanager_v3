import logging
from typing import List, Optional

from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from pymongo.results import InsertOneResult

from server.server.database import school_class_collection
from server.server.api.api_v1.routers.data_api.models import (
    SchoolClass,
    CreateSchoolClassModel,
)
from server.server.config import ExamManagerSettings

settings = ExamManagerSettings()

logging.basicConfig(level=settings.LOGGING_LEVEL)
logger = logging.getLogger(settings.APP_NAME)


###############################################################
#                         CRUD
###############################################################


##########################
#            SchoolClass
##########################

# Create
async def insert_school_class_in_db(create_school_class_model: CreateSchoolClassModel) -> SchoolClass:
    school_class = jsonable_encoder(create_school_class_model)
    inserted: InsertOneResult = await school_class_collection.insert_one(school_class)
    return await find_school_class_by_id_in_db(school_class_id=inserted.inserted_id)


# Read
async def list_school_classes_from_db() -> List[SchoolClass]:
    school_classes = await school_class_collection.find().to_list(1000)
    return list(map(lambda usr: SchoolClass.parse_obj(usr), school_classes))


async def list_school_classes_from_db_by_owner_id(owner_id: str) -> List[SchoolClass]:
    # todo does not return any results
    school_classes = await school_class_collection.find({"owner_id": owner_id}).to_list(1000)
    print("collected school_classes...")
    return list(map(lambda usr: SchoolClass.parse_obj(usr), school_classes))


async def find_school_class_by_id_in_db(school_class_id: ObjectId) -> Optional[SchoolClass]:
    if (school_class := await school_class_collection.find_one({"_id": school_class_id})) is not None:
        return SchoolClass.parse_obj(school_class)


# Update


async def update_school_class_in_db(school_class: SchoolClass) -> SchoolClass:
    # todo not working
    # user = {k: v for k, v in school_class.dict().items() if v is not None}
    # user = jsonable_encoder(user)

    update_result = await school_class_collection.update_one({"_id": school_class.id}, {"$set": school_class})

    if len(update_result) >= 1:

        if update_result.modified_count == 1:
            if (updated_user := await school_class_collection.find_one({"name": school_class.name})) is not None:
                return updated_user

    if (existing_user := await school_class_collection.find_one({"name": school_class.name})) is not None:
        return existing_user

    raise RuntimeError(f"school_class {school_class.name} not found")


# Delete
async def delete_school_class_in_db(school_class_id: str) -> bool:
    deleted_school_class = await school_class_collection.delete_one({"_id": school_class_id})
    return deleted_school_class.deleted_count == 1


##########################
#            Student
##########################


##########################
#            Task
##########################


##########################
#            Exam
##########################


##########################
#            Result
##########################
