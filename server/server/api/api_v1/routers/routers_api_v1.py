from fastapi import APIRouter

from server.server.api.api_v1.routers.auth_api import router as auth_router

from server.server.api.api_v1.routers.statistics_api import router as statistics_router

api_router = APIRouter()

# Includes the auth_api without applied security dependencies, since security is handled depending on route
api_router.include_router(auth_router, prefix="", tags=["auth_api"])
api_router.include_router(statistics_router, prefix="", tags=["statistics_router"])
