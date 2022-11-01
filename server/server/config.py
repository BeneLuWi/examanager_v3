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
