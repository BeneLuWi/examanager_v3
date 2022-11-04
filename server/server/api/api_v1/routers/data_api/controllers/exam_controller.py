from typing import List

from bson import ObjectId
from fastapi import APIRouter, Security, HTTPException

from server.api.api_v1.routers.auth_api.models import User, Role
from server.api.api_v1.routers.auth_api.utils import (
    get_current_user_with_scope,
    validate_token_with_scope,
)
from server.api.api_v1.routers.data_api.models import CreateExamRequest, Exam
from server.api.api_v1.routers.data_api.repository.exam_repository import (
    insert_exam_in_db,
    list_exams_from_db,
    find_exam_by_id_in_db,
    update_exam_in_db,
    list_exams_from_db_by_owner_id,
    delete_exam_in_db,
)

exam_router = APIRouter()


@exam_router.post(
    "/exam",
    dependencies=[Security(validate_token_with_scope, scopes=[Role.USER.name])],
    response_model=CreateExamRequest,
)
async def create_exam(
    create_exam_request: CreateExamRequest,
    user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name]),
):
    if create_exam_request.owner_id is None:
        create_exam_request.owner_id = str(user.id)
    return await insert_exam_in_db(create_exam_request=create_exam_request)


@exam_router.get("/admin/exam", response_model=List[Exam])
async def get_all_exams(user: User = Security(get_current_user_with_scope, scopes=[Role.ADMIN.name])):
    return await list_exams_from_db()


@exam_router.get("/exam", response_model=List[Exam])
async def get_all_exams_for_user(user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    return await list_exams_from_db_by_owner_id(owner_id=str(user.id))


@exam_router.get("/exam/{exam_id}", response_model=Exam)
async def get_exam_by_id(exam_id, user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    #  only return if correct owner
    exam_in_db: Exam = await find_exam_by_id_in_db(exam_id=ObjectId(exam_id))
    if exam_in_db.owner_id == str(user.id):
        return exam_in_db
    raise HTTPException(status_code=401, detail="Permission denied!")


@exam_router.put("/exam", response_model=Exam)
async def update_exam(update_exam_request: Exam):
    return await update_exam_in_db(exam=update_exam_request)


@exam_router.delete("/exam")
async def update_exam(exam_id):
    return await delete_exam_in_db(exam_id=ObjectId(exam_id))
