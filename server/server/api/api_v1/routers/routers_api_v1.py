from fastapi import APIRouter, Security

from server.api.api_v1.routers.auth_api.controllers import router as auth_router, validate_token_with_scope, Role

from server.api.api_v1.routers.statistics_api import router as statistics_router
from server.api.api_v1.routers.data_api.controller import data_api_router

api_router = APIRouter()

# Includes the auth_api without applied security dependencies, since security is handled depending on route
api_router.include_router(auth_router, tags=["auth_api"])
# api_router.include_router(auth_router, prefix="", tags=["asd"])

api_router.include_router(
    statistics_router,
    prefix="",
    tags=["statistics_router"],
    dependencies=[Security(validate_token_with_scope, scopes=[Role.USER.name])],
)
api_router.include_router(
    data_api_router,
    prefix="",
    tags=["data_router"],
    dependencies=[Security(validate_token_with_scope, scopes=[Role.USER.name])],
)
