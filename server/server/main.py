import asyncio
import logging
import os
from asyncio import events

import uvicorn
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from starlette.responses import RedirectResponse
from starlette.staticfiles import StaticFiles

from server.api.api_v1.routers.auth_api.utils import init_admin_user
from server.api.router import api_router
from server.config import ExamManagerSettings

settings = ExamManagerSettings()
logging.basicConfig(level=settings.LOGGING_LEVEL)
logger = logging.getLogger(settings.APP_NAME)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Examanager",
        version=settings.VERSION,
        description=settings.api_description,
        routes=app.routes,
        terms_of_service=settings.terms_of_service,
        license_info=settings.license_info,
        contact=settings.contact,
        tags=settings.tags_metadata,
    )
    openapi_schema["info"]["x-logo"] = {
        # todo not working with local file and currently only with redoc not with openapi. Open api shema js and css
        #  could be overridden to achieve this
        "url": "https://www.dfki.de/fileadmin/user_upload/DFKI/Medien/Logos/Logos_DFKI/DFKI_Logo.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


def configure_static(fasts_api_app):
    static_path = "../app/build"
    if os.path.exists(static_path):
        logger.info("Mounted StaticFiles in FastApi app")
        fasts_api_app.mount("/", StaticFiles(directory=static_path, html=True), name="react static files")
    else:
        logger.info("Did not mount StaticFiles in FastApi app")


app = FastAPI()

app.include_router(api_router)


@app.exception_handler(404)
async def custom_404_handler(_, __):
    """
    This redirects any routes, the server does not define to the frontend, where the routing takes place
    """
    return RedirectResponse("/")


configure_static(app)

if settings.INIT_ADMIN_USER:
    try:
        """
        In case the app is started via the main method below there is no event loop and asyncio.create_task would
        cause an exception. The init_admin_user process is therefore handled independently for the terminal / docker run
        and the call via the __main__ method
        """
        event_loop = events.get_running_loop()
        if event_loop is not None:
            asyncio.create_task(init_admin_user(password=settings.ADMIN_USER_PASSWORD))
    except RuntimeError as err:
        logger.warning(f"RuntimeError: {err} - this is expected if the application was started via the __main__ method")


if __name__ == "__main__":
    if settings.INIT_ADMIN_USER:
        asyncio.run(init_admin_user(password=settings.ADMIN_USER_PASSWORD))
    uvicorn.run(app, port=5200)
