from fastapi import APIRouter
from server.api.api_v1.routers.data_api.controllers.student_controller import student_router
from server.api.api_v1.routers.data_api.controllers.result_controller import result_router
from server.api.api_v1.routers.data_api.controllers.exam_controller import exam_router
from server.api.api_v1.routers.data_api.controllers.school_class_controller import school_class_router

data_api_router = APIRouter()
data_api_router.include_router(student_router, tags=["student"])
data_api_router.include_router(result_router, tags=["result"])
data_api_router.include_router(exam_router, tags=["exam"])
data_api_router.include_router(school_class_router, tags=["school_class"])
