import logging
from enum import Enum, auto

from bson import ObjectId
from pydantic import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class DatabaseNames(Enum):
    school_classes = auto()
    students = auto()
    tasks = auto()
    exams = auto()
    results = auto()


class ExamManagerSettings(BaseSettings):
    LOGGING_LEVEL = logging.INFO
    APP_NAME: str = "ExamManger"
    MONGO_HOST: str = "localhost"
    MONGO_PORT: int = 27017
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    JWT_TOKEN_TIMEOUT_IN_MINUTES: int
    VERSION: str = "demo"
    INIT_ADMIN_USER: bool = False
    ADMIN_USER_PASSWORD: str = "ChangeMe"

    tags_metadata = [
        {
            "name": "auth_api",
            "description": "Operations with users. The **login** logic is also here.",
        },
        {
            "name": "statistics_api",
            "description": "Routes for data analysis and data CRUD operations",
        },
    ]

    terms_of_service = "https://beluwi.de/"
    contact = {
        "name": "Benedikt Lücken-Winkels",
        "url": "https://beluwi.de/",
        "email": "b.lueken.winkels@gmail.com",
    }
    license_info = {
        "name": "TODO Add licence information",
        "url": "https://de.wikipedia.org/wiki/Freie_Software#Lizenzen",
    }

    api_description = """
Exammanger helps you do awesome stuff. 🚀

## Purpose

You can **read items**.

## Usage
Bla 

"""


class PyObjectId(ObjectId):
    """Used to translate between mongo db's specific ObjectId and python string id (used in the serialized json)"""

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")
