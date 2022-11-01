import logging
from datetime import timedelta, datetime
from typing import Optional, List

from fastapi import HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.security import SecurityScopes, OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import ValidationError
import motor.motor_asyncio
from starlette import status
from starlette.responses import JSONResponse
from jose import jwt

from server.server.api.api_v1.routers.auth_api.models import (
    Role,
    JwTokenData,
    MyCredentialException,
    User,
    UpdateUserRequest,
    CreateUserRequest,
    UserModel,
    UpdateUserModel,
    UpdatePasswordRequest,
)
from server.server.config import ExamManagerSettings

settings = ExamManagerSettings()

logging.basicConfig(level=settings.LOGGING_LEVEL)
logger = logging.getLogger(settings.APP_NAME)

mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_HOST)
mongo_db = mongo_client.boilerplate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="api/token",
    scopes={
        Role.ADMIN.name: "Admin User Description",
        Role.USER.name: "User User Description",
    },
)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def authenticate_user(username: str, password: str):
    user: UserModel = await find_user_by_username(username=username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(user_id: str, username: str, role: str, expires_delta: timedelta | None = None):
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_TOKEN_TIMEOUT_IN_MINUTES)

    info = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "exp": expire,
    }
    encoded_jwt = jwt.encode(info, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def create_access_token_for_user(user: User, expires_delta: timedelta | None = None):
    return create_access_token(
        user_id=str(user.id), username=user.username, role=user.role.name, expires_delta=expires_delta
    )


def decode_token(token: str) -> JwTokenData:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        logging.info(f"payload={payload}")
        username: str = payload.get("username")
        if username is None:
            logging.info("username is none")
            raise MyCredentialException
        token_data = JwTokenData(**payload)
        return token_data

    except (jwt.JWTError, ValidationError):
        logger.error("Error Decoding Token", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )


async def get_token_from_header(token: str = Depends(oauth2_scheme)) -> JwTokenData:
    return decode_token(token)


async def get_current_user_by_token(token_data: JwTokenData = Depends(get_token_from_header)):
    user = await find_user_by_username(username=token_data.username)
    if user is None:
        raise MyCredentialException
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user_by_token)):
    return current_user


def validate_scope(security_scopes: SecurityScopes, user_role: str):
    for scope in security_scopes.scopes:
        logger.info(f"found scope {scope} - token has {user_role}")

        if Role[scope].value > Role[user_role].value:
            return False
    return True


async def validate_token_with_scope(
    security_scopes: SecurityScopes,
    token: str = Depends(oauth2_scheme),
):
    logging.info("validate_token_with_scope")
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"

    token_data = decode_token(token=token)

    if security_scopes.scopes and not token_data.role:
        raise HTTPException(
            status_code=401,
            detail="Not enough permissions",
            headers={"WWW-Authenticate": authenticate_value},
        )
    if not validate_scope(security_scopes, token_data.role):
        raise HTTPException(
            status_code=401,
            detail="Not enough permissions",
            headers={"WWW-Authenticate": authenticate_value},
        )


async def get_current_user_with_scope(
    security_scopes: SecurityScopes,
    token: str = Depends(oauth2_scheme),
) -> User:
    logging.info("get_current_user_with_scope")
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"

    token_data = decode_token(token=token)

    user: User = await find_user_by_username(username=token_data.username)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": authenticate_value},
        )

    await validate_token_with_scope(security_scopes=security_scopes, token=token)

    return user


### CRUD ######


def parse_create_user_request_to_user_schema(create_user_request: CreateUserRequest) -> UserModel:
    return UserModel(
        username=create_user_request.username,
        password=get_password_hash(create_user_request.password),
        role=Role[create_user_request.role],
    )


def parse_update_user_request_to_user_model(update_user_request: UpdateUserRequest) -> UpdateUserModel:
    password = None
    if update_user_request.password:
        password = get_password_hash(update_user_request.password)
    return UpdateUserModel(
        username=update_user_request.username,
        password=password,
        role=Role[update_user_request.role],
    )


def parse_update_password_request_to_user_model(update_password_request: UpdatePasswordRequest) -> UpdateUserModel:
    return UpdateUserModel(
        username=update_password_request.username,
        password=get_password_hash(update_password_request.password),
        role=None,
    )


async def add_user(create_user_request: CreateUserRequest) -> JSONResponse:
    new_user: UserModel = parse_create_user_request_to_user_schema(create_user_request=create_user_request)
    return await insert_new_user(user=new_user)


async def insert_new_user(user: UserModel):
    if not await find_user_by_username(username=user.username):
        user = jsonable_encoder(user)
        new_user = await mongo_db["users"].insert_one(user)
        created_user = await mongo_db["users"].find_one({"_id": new_user.inserted_id})
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_user)

    raise HTTPException(status_code=400, detail=f"User {user.username} already exists")


async def list_users() -> List[UserModel]:
    users = await mongo_db["users"].find().to_list(1000)
    return list(map(lambda usr: UserModel.parse_obj(usr), users))


async def find_user_by_id(user_id: str) -> UserModel:
    if (user := await mongo_db["users"].find_one({"_id": user_id})) is not None:
        return UserModel.parse_obj(user)


async def find_user_by_username(username: str) -> Optional[UserModel]:
    if (user := await mongo_db["users"].find_one({"username": username})) is not None:
        return UserModel.parse_obj(user)


async def update_user_by_request(username: str, update_user_request: UpdateUserRequest):
    return await update_user_in_db(
        username=username, user_model=parse_update_user_request_to_user_model(update_user_request)
    )


async def update_user_password_by_request(username: str, update_password_request: UpdatePasswordRequest) -> User:
    return await update_user_in_db(
        username=username, user_model=parse_update_password_request_to_user_model(update_password_request)
    )


async def update_user_in_db(username: str, user_model: UpdateUserModel) -> User:
    if not username == user_model.username:
        raise HTTPException(status_code=400, detail=f"Invalid request")

    user = {k: v for k, v in user_model.dict().items() if v is not None}
    user = jsonable_encoder(user)

    if len(user) >= 1:
        update_result = await mongo_db["users"].update_one({"username": username}, {"$set": user})

        if update_result.modified_count == 1:
            if (updated_user := await mongo_db["users"].find_one({"username": username})) is not None:
                return updated_user

    if (existing_user := await mongo_db["users"].find_one({"username": username})) is not None:
        return existing_user

    raise HTTPException(status_code=404, detail=f"User{username} not found")


async def delete_user_in_db(user_id: str) -> bool:
    delete_result = await mongo_db["users"].delete_one({"_id": user_id})
    return delete_result.deleted_count == 1


async def delete_user_in_db_by_username(username: str) -> bool:
    delete_result = await mongo_db["users"].delete_one({"username": username})
    return delete_result.deleted_count == 1


async def init_admin_user(password: str):
    admin_user: UserModel = UserModel(
        username="admin",
        role=Role.ADMIN,
        password=get_password_hash(password),
    )

    if not await find_user_by_username(username=admin_user.username):
        logger.info("Create new admin default user")
        await insert_new_user(user=admin_user)
    else:
        logger.info("Trying to init admin default user - user already exists")
