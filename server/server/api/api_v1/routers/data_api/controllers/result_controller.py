from typing import List

from bson import ObjectId
from fastapi import APIRouter, Security, HTTPException

from server.api.api_v1.routers.auth_api.models import User, Role
from server.api.api_v1.routers.auth_api.utils import (
    get_current_user_with_scope,
    validate_token_with_scope,
)
from server.api.api_v1.routers.data_api.models import CreateResultRequest, Result
from server.api.api_v1.routers.data_api.repository.result_repository import (
    insert_result_in_db,
    list_results_from_db,
    find_result_by_id_in_db,
    update_result_in_db,
    list_results_from_db_by_owner_id,
    delete_result_in_db,
)

result_router = APIRouter()


@result_router.post(
    "/result",
    dependencies=[Security(validate_token_with_scope, scopes=[Role.USER.name])],
    response_model=CreateResultRequest,
)
async def create_result(
    create_result_request: CreateResultRequest,
    user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name]),
):
    if create_result_request.owner_id is None:
        create_result_request.owner_id = str(user.id)
    return await insert_result_in_db(create_result_request=create_result_request)


@result_router.get("/admin/result", response_model=List[Result])
async def get_all_results(user: User = Security(get_current_user_with_scope, scopes=[Role.ADMIN.name])):
    return await list_results_from_db()


@result_router.get("/result", response_model=List[Result])
async def get_all_results_for_user(user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    return await list_results_from_db_by_owner_id(owner_id=str(user.id))


@result_router.get("/result/{result_id}", response_model=Result)
async def get_result_by_id(result_id, user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    #  only return if correct owner
    result_in_db: Result = await find_result_by_id_in_db(result_id=ObjectId(result_id))
    if result_in_db.owner_id == str(user.id):
        return result_in_db
    raise HTTPException(status_code=401, detail="Permission denied!")


@result_router.put("/result", response_model=Result)
async def update_result(update_result_request: Result):
    return await update_result_in_db(result=update_result_request)


@result_router.delete("/result")
async def update_result(result_id):
    return await delete_result_in_db(result_id=result_id)
