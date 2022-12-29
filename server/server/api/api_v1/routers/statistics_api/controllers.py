from fastapi import APIRouter, Security

from server.api.api_v1.routers.auth_api.models import User, Role
from server.api.api_v1.routers.auth_api.utils import get_current_user_with_scope
from server.api.api_v1.routers.data_api.controllers.result_controller import get_exam_results_for_class
from server.api.api_v1.routers.data_api.models import ExamResultsResponse
from server.api.api_v1.routers.statistics_api.models import StatisticsResult
from server.api.api_v1.routers.statistics_api.utils import calculate_statistics_excel, calculate_statistics_object

router = APIRouter()


@router.get("/create_statistics_excel")
async def create_statistics_excel(
    exam_id: str = "63a18a09c3b9c4046a567311",
    school_class_id: str = "63a18a01c3b9c4046a567310",
    user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name]),
):
    exam_results_response: ExamResultsResponse = await get_exam_results_for_class(
        exam_id=exam_id, school_class_id=school_class_id, user=user
    )

    await calculate_statistics_excel(exam_results_response=exam_results_response)


@router.get("/calculate_statistics", response_model=StatisticsResult)
async def calculate_statistics(
    exam_id: str = "63a18a09c3b9c4046a567311",
    school_class_id: str = "63a18a01c3b9c4046a567310",
    user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name]),
) -> StatisticsResult:
    exam_results_response: ExamResultsResponse = await get_exam_results_for_class(
        exam_id=exam_id, school_class_id=school_class_id, user=user
    )
    statistics: StatisticsResult = await calculate_statistics_object(exam_results_response=exam_results_response)

    return statistics
