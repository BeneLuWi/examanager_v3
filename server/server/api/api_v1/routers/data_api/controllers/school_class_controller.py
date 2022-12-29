from typing import List

from bson import ObjectId
from fastapi import APIRouter, Security, HTTPException

from server.api.api_v1.routers.auth_api.models import User, Role
from server.api.api_v1.routers.auth_api.utils import (
    get_current_user_with_scope,
    validate_token_with_scope,
)
from server.api.api_v1.routers.data_api.models import CreateSchoolClassRequest, SchoolClass
from server.api.api_v1.routers.data_api.repository.school_class_repository import (
    insert_school_class_in_db,
    list_school_classes_from_db,
    find_school_class_by_id_in_db,
    update_school_class_in_db,
    list_school_classes_from_db_by_owner_id,
    delete_school_class_in_db,
)
from server.api.api_v1.routers.data_api.test_data_set import create_test_dataset

school_class_router = APIRouter()


@school_class_router.post(
    "/school_class",
    dependencies=[Security(validate_token_with_scope, scopes=[Role.USER.name])],
    response_model=CreateSchoolClassRequest,
)
async def create_school_class(
    create_school_class_request: CreateSchoolClassRequest,
    user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name]),
):
    if create_school_class_request.owner_id is None:
        create_school_class_request.owner_id = str(user.id)
    return await insert_school_class_in_db(create_school_class_request=create_school_class_request)


@school_class_router.get("/admin/school_class", response_model=List[SchoolClass])
async def get_all_school_classes(user: User = Security(get_current_user_with_scope, scopes=[Role.ADMIN.name])):
    return await list_school_classes_from_db()


@school_class_router.post("/admin/sample_data")
async def create_sample_data(
    school_class_name: str, user: User = Security(get_current_user_with_scope, scopes=[Role.ADMIN.name])
):
    return await create_test_dataset(user, school_class_name)


@school_class_router.get("/school_class", response_model=List[SchoolClass])
async def get_all_school_classes_for_user(user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    return await list_school_classes_from_db_by_owner_id(owner_id=str(user.id))


@school_class_router.get("/school_class/{school_class_id}", response_model=SchoolClass)
async def get_school_class_by_id(
    school_class_id, user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])
):
    #  only return if correct owner
    school_class_in_db: SchoolClass = await find_school_class_by_id_in_db(school_class_id=school_class_id)
    if school_class_in_db.owner_id == str(user.id):
        return school_class_in_db
    raise HTTPException(status_code=401, detail="Permission denied!")


@school_class_router.put("/school_class", response_model=SchoolClass)
async def update_school_class(update_school_class_request: SchoolClass):
    return await update_school_class_in_db(school_class=update_school_class_request)


@school_class_router.delete("/school_class")
async def delete_school_class(school_class_id):
    return await delete_school_class_in_db(school_class_id=school_class_id)
