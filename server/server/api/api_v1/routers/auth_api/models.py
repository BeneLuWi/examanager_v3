from enum import Enum

from bson import ObjectId
from fastapi import HTTPException
from pydantic import BaseModel, Field

from server.config import PyObjectId


class Role(Enum):
    """
    This class defines the roles that exist in the application. This enum represents a hierarchical role system (higher
    roles get monotonically more rights. It is possible to add roles between existing roles.
    """

    USER = 0
    ADMIN = 1


class LoginRequest(BaseModel):
    username: str
    password: str


class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str = Field(...)
    role: Role = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserModel(User):
    password: bytes = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class CreateUserRequest(BaseModel):
    username: str = Field(...)
    password: str = Field(...)
    role: str = Field(...)


class UpdatePasswordRequest(BaseModel):
    _id: str
    password: str

    @property
    def id(self):
        return self._id

    class Config:
        schema_extra = {"example": {"_id": "user_id_string", "password": "new_plain_password"}}


class UpdateUserRequest(BaseModel):
    _id: str
    username: str | None = Field(...)
    password: str | None = Field(...)
    role: str | None = Field(...)

    @property
    def id(self):
        return self._id

    class Config:
        schema_extra = {
            "example": {
                "_id": "user_id_string",
                "username": "Bauer",
                "password": "new_plain_password",
                "role": "ADMIN",
            }
        }


class UpdateUserModel(UpdateUserRequest):
    role: Role | None = Field(...)
    password: bytes | None = Field(...)


class JwToken(BaseModel):
    access_token: str
    token_type: str


class JwTokenData(BaseModel):
    user_id = str
    username: str
    role: str
    exp: str

    class Config:
        schema_extra = {
            "example": {
                "user_id": "62ff8ec96bd2293b9061daae",
                "username": "admin",
                "role": "ADMIN",
                "exp": "1661237989",
            }
        }


class MyCredentialException(HTTPException):
    def __int__(self, authenticate_value: str = "Bearer"):
        status_code = 401
        detail = "Could not validate credentials"
        headers = {"WWW-Authenticate": authenticate_value}
        super().__init__(status_code=status_code, detail=detail, headers=headers)


class MyPermissionException(HTTPException):
    def __int__(self, authenticate_value: str = "Bearer"):
        status_code = 401
        detail = "Not enough permissions"
        headers = {"WWW-Authenticate": authenticate_value}
        super().__init__(status_code=status_code, detail=detail, headers=headers)
