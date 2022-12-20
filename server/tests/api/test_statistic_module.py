from server.api.api_v1.routers.statistics_api.controllers import get_sample_result_response


class TestClassStatisticModuleTests:
    exam_id = "63a18a09c3b9c4046a567311"
    school_class_id = "63a18a01c3b9c4046a567310"

    async def test_get_exam_result_response(self):
        """
        The issue with these tests is that all the routes need auth. Without any auth token this will not work...
        :return:
        """
        print(await get_sample_result_response(school_class_id=self.school_class_id, exam_id=self.exam_id))
