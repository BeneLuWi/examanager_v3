import logging
from typing import List, Optional

from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from pymongo.results import InsertOneResult

from server.database import result_collection
from server.api.api_v1.routers.data_api.models import (
    Result,
    CreateResultRequest,
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
async def insert_result_in_db(create_result_request: CreateResultRequest) -> Result:
    result = jsonable_encoder(create_result_request)
    inserted: InsertOneResult = await result_collection.insert_one(result)
    return await find_result_by_id_in_db(result_id=inserted.inserted_id)


################
# Read
###############
async def list_results_from_db() -> List[Result]:
    results = await result_collection.find().to_list(1000)
    return list(map(lambda result: Result.parse_obj(result), results))


async def list_results_from_db_by_owner_id(owner_id: str) -> List[Result]:
    results = await result_collection.find({"owner_id": owner_id}).to_list(1000)
    return list(map(lambda result: Result.parse_obj(result), results))


async def find_result_by_id_in_db(result_id: ObjectId) -> Optional[Result]:
    if (result := await result_collection.find_one({"_id": result_id})) is not None:
        return Result.parse_obj(result)


################
# Update
###############
async def update_result_in_db(result: Result) -> Result:
    result_dict = {k: v for k, v in result.dict().items() if v is not None}
    result_dict = jsonable_encoder(result_dict)
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
async def delete_result_in_db(result_id: ObjectId) -> bool:
    deleted_result = await result_collection.delete_one({"_id": result_id})
    return deleted_result.deleted_count == 1
