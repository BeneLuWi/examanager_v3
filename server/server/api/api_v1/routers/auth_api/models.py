from enum import Enum
from bson import ObjectId
from fastapi import HTTPException
from pydantic import BaseModel, Field


class Role(Enum):
    """
    This class defines the roles that exist in the application. This enum represents a hierarchical role system (higher
    roles get monotonically more rights. It is possible to add roles between existing roles.
    """

    USER = 1
    ADMIN = 3


class LoginRequest(BaseModel):
    username: str
    password: str

    class Config:
        schema_extra = {
            "example": {
                "username": "admin",
                "password": "password - not yet hashed",
            }
        }


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


class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str = Field(...)
    role: Role = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "id": "62ff8ec96bd2293b9061daae",
                "username": "admin",
                "role": Role.ADMIN,
            }
        }


class UserModel(User):
    password: bytes = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "id": "62ff8ec96bd2293b9061daae",
                "username": "username",
                "role": Role.USER,
                "password": "hashedpasswordvalue",
            }
        }


class CreateUserRequest(BaseModel):
    username: str = Field(...)
    password: str = Field(...)
    role: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "username": "user",
                "mail": "abauer@gmail.com",
                "password": "password - not yet hashed",
                "role": Role.USER,
            }
        }


class UpdatePasswordRequest(BaseModel):
    username: str
    password: str

    class Config:
        schema_extra = {
            "example": {
                "username": "abauer",
                "password": "new passwd not hashed yet",
            }
        }


class UpdateUserRequest(BaseModel):
    username: str | None = Field(...)
    password: str | None = Field(...)
    role: str | None = Field(...)

    class Config:
        schema_extra = {"example": {"username": "abauer", "password": "passwd not hashed yet", "role": "VISITOR"}}


class UpdateUserModel(UpdateUserRequest):
    role: Role | None = Field(...)
    password: bytes | None = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "firstname": "Adam",
                "lastname": "Bauer",
                "username": "abauer",
                "mail": "abauer@gmail.com",
                "disabled": "False",
                "password": "hashedpasswordvalue",
                "role": Role.USER,
            }
        }


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
