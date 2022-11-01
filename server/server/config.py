import logging

from pydantic import BaseSettings
from dotenv import load_dotenv

load_dotenv()


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
