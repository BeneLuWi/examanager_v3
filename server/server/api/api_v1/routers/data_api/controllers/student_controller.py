from typing import List

from bson import ObjectId
from fastapi import APIRouter, Security, HTTPException

from server.api.api_v1.routers.auth_api.models import User, Role
from server.api.api_v1.routers.auth_api.utils import (
    get_current_user_with_scope,
    validate_token_with_scope,
)
from server.api.api_v1.routers.data_api.models import CreateStudentRequest, Student
from server.api.api_v1.routers.data_api.repository.student_repository import (
    insert_student_in_db,
    list_students_from_db,
    find_student_by_id_in_db,
    update_student_in_db,
    list_students_from_db_by_owner_id,
    list_students_from_db_by_school_class_id,
    delete_student_in_db,
)

student_router = APIRouter()


@student_router.post(
    "/student",
    dependencies=[Security(validate_token_with_scope, scopes=[Role.USER.name])],
    response_model=CreateStudentRequest,
)
async def create_student(
    create_student_request: CreateStudentRequest,
    user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name]),
):
    if create_student_request.owner_id is None:
        create_student_request.owner_id = str(user.id)
    return await insert_student_in_db(create_student_request=create_student_request)


@student_router.get("/admin/student", response_model=List[Student])
async def get_all_students(user: User = Security(get_current_user_with_scope, scopes=[Role.ADMIN.name])):
    return await list_students_from_db()


@student_router.get("/student", response_model=List[Student])
async def get_all_students_for_user(user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    return await list_students_from_db_by_owner_id(owner_id=str(user.id))


@student_router.get("/student/{school_class_id}", response_model=List[Student])
async def get_all_students_for_school_class(
    school_class_id: str, user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])
):
    return await list_students_from_db_by_school_class_id(school_class_id=school_class_id, owner_id=str(user.id))


@student_router.get("/student/{student_id}", response_model=Student)
async def get_student_by_id(student_id, user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    #  only return if correct owner
    student_in_db: Student = await find_student_by_id_in_db(student_id=ObjectId(student_id))
    if student_in_db.owner_id == str(user.id):
        return student_in_db
    raise HTTPException(status_code=401, detail="Permission denied!")


@student_router.put("/student", response_model=Student)
async def update_student(update_student_request: Student):
    return await update_student_in_db(student=update_student_request)


@student_router.delete("/student")
async def update_student(student_id):
    success = await delete_student_in_db(student_id=ObjectId(student_id))
    if not success:
        raise HTTPException(status_code=500, detail="Failure while deleting Student")
