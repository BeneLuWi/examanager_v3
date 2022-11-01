from typing import Optional, List, Dict

from bson import ObjectId
from pydantic import BaseModel, Field

from server.server.config import PyObjectId


class MongoModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class CreateSchoolClassRequest(BaseModel):
    name: str
    description: str | None
    owner_id: str


class SchoolClass(MongoModel, CreateSchoolClassRequest):
    class Config:
        schema_extra = {
            "example": {
                "name": "admin",
                "description": "Optional description of the class",
                "owner_id": "id of the owner of the school class",
            }
        }


class Student(MongoModel):
    lastname: str
    firstname: str
    owner_id: str
    school_class_id: str


class Task(MongoModel):
    name: str
    max_points: float


class Exam(MongoModel):
    name: str
    description: Optional[str]
    tasks: List[Task]


class Result(MongoModel):
    owner_id: str
    exam_id: str
    points_per_task: Dict[str, float]
