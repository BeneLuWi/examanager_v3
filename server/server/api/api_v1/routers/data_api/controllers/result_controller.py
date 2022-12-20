from typing import List

from fastapi import APIRouter, Security, HTTPException

from server.api.api_v1.routers.auth_api.models import User, Role
from server.api.api_v1.routers.auth_api.utils import (
    get_current_user_with_scope,
    validate_token_with_scope,
)
from server.api.api_v1.routers.data_api.controllers.school_class_controller import get_school_class_by_id
from server.api.api_v1.routers.data_api.models import (
    CreateResultRequest,
    StudentResult,
    Student,
    ExamResultsWrapper,
    StudentResultsWrapper,
    ExamResultsResponse,
)
from server.api.api_v1.routers.data_api.repository.exam_repository import find_exam_by_id_in_db
from server.api.api_v1.routers.data_api.repository.result_repository import (
    insert_result_in_db,
    list_results_from_db,
    find_result_by_id_in_db,
    update_result_in_db,
    list_results_from_db_by_owner_id,
    delete_result_in_db,
    list_results_from_db_by_exam_id_and_school_class_id,
    list_student_result_responses,
    find_result_by_ids,
)
from server.api.api_v1.routers.data_api.repository.student_repository import (
    find_student_by_id_in_db,
)

result_router = APIRouter()


# CRUD - Create
@result_router.post(
    "/result", dependencies=[Security(validate_token_with_scope, scopes=[Role.USER.name])], response_model=StudentResult
)
async def create_result(
    create_result_request: CreateResultRequest,
    user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name]),
):
    if create_result_request.owner_id is None:
        create_result_request.owner_id = str(user.id)

    result = await find_result_by_ids(create_result_request)

    if result is not None:
        return await update_result_in_db(
            StudentResult(
                id=result.id,
                exam_id=create_result_request.exam_id,
                student_id=create_result_request.student_id,
                points_per_task=create_result_request.points_per_task,
                owner_id=result.owner_id,
            )
        )
    else:
        return await insert_result_in_db(create_result_request=create_result_request)


# CRUD - READ
@result_router.get("/admin/result", response_model=List[StudentResult])
async def get_all_results(user: User = Security(get_current_user_with_scope, scopes=[Role.ADMIN.name])):
    return await list_results_from_db()


@result_router.get("/result", response_model=List[StudentResult])
async def get_all_results_for_user(user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    return await list_results_from_db_by_owner_id(owner_id=str(user.id))


@result_router.get("/result/{result_id}", response_model=StudentResult)
async def get_result_by_id(result_id, user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    #  only return if correct owner
    result_in_db: StudentResult = await find_result_by_id_in_db(result_id=result_id)
    if result_in_db.owner_id == str(user.id):
        return result_in_db
    raise HTTPException(status_code=401, detail="Permission denied!")


@result_router.get("/result/{student_id}", response_model=StudentResult)
async def get_exam_results_for_student(student_id: str):
    # todo
    raise NotImplementedError


@result_router.get("/result/{exam_id}", response_model=StudentResult)
async def get_results_for_exam(exam_id: str):
    # todo
    raise NotImplementedError


@result_router.get("/result/{school_class_id}", response_model=StudentResult)
async def get_results_for_school_class(school_class_id: str):
    # todo
    raise NotImplementedError


@result_router.get("/result/{exam_id}/{school_class_id}", response_model=ExamResultsResponse)
async def get_exam_results_for_class(
    school_class_id: str, exam_id: str, user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])
) -> ExamResultsResponse:
    # get_school_class_by_id call ensures that the user making this request is allowed to access the class
    # (and its data) since an Exception is raised otherwise
    await get_school_class_by_id(school_class_id=school_class_id, user=user)

    exam = await find_exam_by_id_in_db(exam_id)
    if not exam:
        raise ValueError("No such exam")

    results = await list_student_result_responses(exam, school_class_id)

    return ExamResultsResponse(school_class_id=school_class_id, exam=exam, studentResults=results)


@result_router.get("/result_old/{exam_id}/{class_id}")
async def get_exam_results_for_class_old(school_class_id: str, exam_id: str) -> ExamResultsWrapper:
    # get_school_class_by_id call ensures that the user making this request is allowed to access the class
    # (and its data) since an Exception is raised otherwise
    await get_school_class_by_id(school_class_id=school_class_id)

    results_for_exam_and_school_class: List[StudentResult] = await list_results_from_db_by_exam_id_and_school_class_id(
        exam_id=exam_id, school_class_id=school_class_id
    )

    async def create_student_results_wrapper(student_result: StudentResult) -> StudentResultsWrapper:
        student_id = student_result.student_id
        student_in_db: Student = await find_student_by_id_in_db(student_id=student_id)
        return StudentResultsWrapper(student=student_in_db, student_result=student_result)

    results: List[StudentResultsWrapper] = [
        await create_student_results_wrapper(student_result) for student_result in results_for_exam_and_school_class
    ]

    return ExamResultsWrapper(
        school_class_id=school_class_id, exam=await find_exam_by_id_in_db(exam_id=exam_id), results=results
    )


# CRUD - Update


@result_router.put("/result", response_model=StudentResult)
async def update_result(update_result_request: StudentResult):
    return await update_result_in_db(result=update_result_request)


# CRUD - Delete


@result_router.delete("/result")
async def delete_result(result_id):
    return await delete_result_in_db(result_id=result_id)
