from server.api.api_v1.routers.data_api.models import ExamResultsResponse


async def calculate_statistics(exam_results_response: ExamResultsResponse):
    print(exam_results_response)
