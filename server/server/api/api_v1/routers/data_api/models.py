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


class CreateExamRequest(BaseModel):
    name: str
    description: Optional[str]
    tasks: List[Task]
    owner_id: str | None


class Exam(MongoModel):
    name: str
    description: Optional[str]
    tasks: List[Task]
    owner_id: str


class CreateResultRequest(BaseModel):
    exam_id: str
    student_id: str
    points_per_task: Dict[str, float]
    owner_id: str | None


class Result(MongoModel):
    owner_id: str
    exam_id: str
    student_id: str
    points_per_task: Dict[str, float]
