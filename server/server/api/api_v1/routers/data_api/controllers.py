from typing import List

from bson import ObjectId
from fastapi import APIRouter, Security

from server.server.api.api_v1.routers.auth_api.models import JwTokenData, User, Role
from server.server.api.api_v1.routers.auth_api.utils import (
    get_current_user_with_scope,
    validate_token_with_scope,
)
from server.server.api.api_v1.routers.data_api.models import (
    CreateSchoolClassRequest,
    SchoolClass,
    CreateSchoolClassModel,
)
from server.server.api.api_v1.routers.data_api.utils import (
    insert_school_class_in_db,
    list_school_classes_from_db,
    find_school_class_by_id_in_db,
    update_school_class_in_db,
    list_school_classes_from_db_by_owner_id,
)

router = APIRouter()


@router.post(
    "/school_class",
    dependencies=[Security(validate_token_with_scope, scopes=[Role.USER.name])],
    response_model=CreateSchoolClassRequest,
)
async def create_school_class(
    create_school_class_request: CreateSchoolClassRequest,
    user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name]),
):
    """
    TODO docs
    """
    create_school_class_model: CreateSchoolClassModel = CreateSchoolClassModel(
        name=create_school_class_request.name,
        description=create_school_class_request.description,
        owner_id=str(user.id),
    )
    return await insert_school_class_in_db(create_school_class_model=create_school_class_model)


@router.get("/admin/school_class", response_model=List[SchoolClass])
async def get_all_school_classes(user: User = Security(get_current_user_with_scope, scopes=[Role.ADMIN.name])):
    """
    Todo docs
    """
    return await list_school_classes_from_db()


@router.get("/school_class", response_model=List[SchoolClass])
async def get_all_school_classes_for_user(user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    """
    Todo docs
    """
    return await list_school_classes_from_db_by_owner_id(owner_id=str(user.id))


@router.get("/school_class/{school_class_id}", response_model=SchoolClass)
async def get_school_class_by_id(school_class_id):
    """
    Todo docs
    """

    # todo only return if correct owner

    return await find_school_class_by_id_in_db(school_class_id=ObjectId(school_class_id))


@router.put("/school_class", response_model=SchoolClass)
async def update_school_class(update_school_class_request: SchoolClass):
    """
    Todo docs
    """
    return await update_school_class_in_db(school_class=update_school_class_request)
