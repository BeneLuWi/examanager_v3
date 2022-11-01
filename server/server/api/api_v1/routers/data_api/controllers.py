from typing import List

from fastapi import APIRouter

from server.server.api.api_v1.routers.data_api.models import CreateSchoolClassRequest, SchoolClass
from server.server.api.api_v1.routers.data_api.utils import (
    insert_school_class_in_db,
    list_school_classes_from_db,
    find_school_class_by_id_in_db,
    update_school_class_in_db,
)

router = APIRouter()


@router.post("/school_class", response_model=CreateSchoolClassRequest)
async def create_school_class(create_school_class_request: CreateSchoolClassRequest):
    """
    TODO docs
    """
    return await insert_school_class_in_db(create_school_class_request=create_school_class_request)


@router.get("/school_class", response_model=List[SchoolClass])
async def get_all_school_classes():
    """
    Todo docs
    """
    return await list_school_classes_from_db()


@router.get("/school_class/{school_class_id}", response_model=SchoolClass)
async def get_school_class_by_id(school_class_id):
    """
    Todo docs
    """
    return await find_school_class_by_id_in_db(school_class_id=school_class_id)


@router.put("/school_class", response_model=SchoolClass)
async def update_school_class(update_school_class_request: SchoolClass):
    """
    Todo docs
    """
    return await update_school_class_in_db(school_class=update_school_class_request)
