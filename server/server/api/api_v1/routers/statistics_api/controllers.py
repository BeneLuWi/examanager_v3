from fastapi import APIRouter, Security

from server.api.api_v1.routers.auth_api.models import User, Role
from server.api.api_v1.routers.auth_api.utils import get_current_user_with_scope
from server.api.api_v1.routers.data_api.controllers.result_controller import get_exam_results_for_class
from server.api.api_v1.routers.data_api.models import ExamResultsResponse
from server.api.api_v1.routers.statistics_api.utils import calculate_statistics

router = APIRouter()


@router.get("/calculate_statistics")
async def get_sample_result_response(
    exam_id: str, school_class_id: str, user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])
):
    exam_results_response: ExamResultsResponse = await get_exam_results_for_class(
        exam_id=exam_id, school_class_id=school_class_id, user=user
    )

    await calculate_statistics(exam_results_response=exam_results_response)
