import motor.motor_asyncio

from server.server.config import ExamManagerSettings

settings = ExamManagerSettings()


mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_HOST)
examanager_db = mongo_client.examanager

student_collection = examanager_db.get_collection("students")
school_class_collection = examanager_db.get_collection("school_classes")
user_collection = examanager_db.get_collection("users")
exam_collection = examanager_db.get_collection("exams")
result_collection = examanager_db.get_collection("results")
