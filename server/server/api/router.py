from fastapi import APIRouter

from server.api.api_v1.routers.routers_api_v1 import api_router as api_v1

api_router = APIRouter()
# api_router.include_router(api_v1, prefix="/api_v1", tags=["api_v1"])
api_router.include_router(api_v1, prefix="/api")
