import asyncio
import logging
import os

import uvicorn
from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from server.server.api.api_v1.routers.auth_api import init_admin_user
from server.server.api.router import api_router
from server.server.config import ExamManagerSettings

settings = ExamManagerSettings()
logging.basicConfig(level=settings.LOGGING_LEVEL)
logger = logging.getLogger(settings.APP_NAME)


def configure_static(fasts_api_app):
    static_path = "../frontend/web-app-boilerplate/build"
    if os.path.exists(static_path):
        logger.info("Mounted StaticFiles in FastApi app")
        fasts_api_app.mount("/", StaticFiles(directory=static_path, html=True), name="react static files")
    else:
        logger.info("Did not mount StaticFiles in FastApi app")


app = FastAPI()

app.include_router(api_router)
configure_static(app)

if settings.INIT_ADMIN_USER:
    asyncio.run(init_admin_user(password=settings.ADMIN_USER_PASSWORD))

if __name__ == "__main__":
    uvicorn.run(app, port=5200)
