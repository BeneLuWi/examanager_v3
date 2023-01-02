from typing import Optional, List, Dict, Literal

from bson import ObjectId
from pydantic import BaseModel, Field

from server.config import PyObjectId


class MongoModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class CreateSchoolClassRequest(BaseModel):
    name: str
    description: str | None
    owner_id: str | None


class SchoolClass(MongoModel):
    name: str
    description: str | None
    owner_id: str

    class Config:
        schema_extra = {
            "example": {
                "_id": "randomObjectId",
                "name": "admin",
                "description": "Optional description of the class",
                "owner_id": "id of the owner of the school class",
            }
        }


class CreateStudentRequest(BaseModel):
    lastname: str
    firstname: str
    school_class_id: str
    owner_id: str | None
    gender: Literal["m", "w", "d"]


class Student(MongoModel):
    lastname: str
    firstname: str
    school_class_id: str
    owner_id: str
    gender: Literal["m", "w", "d"]


class CreateTaskRequest(BaseModel):
    name: str
    max_points: float


class Task(MongoModel):
    name: str
    max_points: float
    deactivated_for: Optional[List[str]]  # list of ids of school classes


class Rating(BaseModel):
    percentage: float
    mss_points: int
    decimal_rating: float
    school_rating: str
    text_rating: str


class CreateExamRequest(BaseModel):
    name: str
    description: Optional[str]
    tasks: List[Task]
    ratings: Optional[List[Rating]]
    owner_id: str | None


class Exam(MongoModel):
    name: str
    description: Optional[str]
    tasks: List[Task]
    ratings: List[Rating]
    owner_id: str


class ResultEntry(BaseModel):
    task_id: str
    points: float


class StudentResult(MongoModel):
    owner_id: str
    exam_id: str
    student_id: str
    points_per_task: List[ResultEntry]
    self_assessment: Optional[int] = Field(description="Self Assessment of Exam Result in MSS Points", ge=0, le=15)


class CreateResultRequest(BaseModel):
    exam_id: str
    student_id: str
    points_per_task: List[ResultEntry]
    self_assessment: Optional[int] = Field(description="Self Assessment of Exam Result in MSS Points", ge=0, le=15)
    owner_id: str | None


class ResultEntryResponse(ResultEntry, Task):
    """
    Extends the Result entry by Information about the Task
    """


class StudentResultResponse(Student):
    result: Optional[List[ResultEntryResponse]]
    self_assessment: Optional[int] = Field(description="Self Assessment of Exam Result in MSS Points", ge=0, le=15)


class ExamResultsResponse(MongoModel):
    school_class_id: str
    exam: Exam
    studentResults: List[StudentResultResponse]
