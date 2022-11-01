import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordRequestForm
from starlette import status

from server.server.api.api_v1.routers.auth_api.models import (
    JwToken,
    User,
    CreateUserRequest,
    Role,
    JwTokenData,
    UpdateUserRequest,
    UpdatePasswordRequest,
)
from server.server.api.api_v1.routers.auth_api.utils import (
    authenticate_user,
    create_access_token_for_user,
    validate_token_with_scope,
    get_token_from_header,
    delete_user_in_db_by_username,
    list_users,
    find_user_by_username,
    update_user_by_request,
    get_current_user_with_scope,
    update_user_password_by_request,
    add_user,
    delete_user_in_db,
    find_user_by_id,
)
from server.server.config import ExamManagerSettings

router = APIRouter()
settings = ExamManagerSettings()

logging.basicConfig(level=settings.LOGGING_LEVEL)
logger = logging.getLogger(settings.APP_NAME)


@router.post("/token", response_model=JwToken)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    The token method is used to verify a login attempt. The posted data gets checked with the mongodb instance. If the
    login credentials are correct a token is created. Gets data from login form and checks with db entries
    :return: JWT if succesful, else failure message
    """
    user: User = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post(
    "/register", dependencies=[Security(validate_token_with_scope, scopes=[Role.ADMIN.name])], response_model=User
)
async def register(create_user_request: CreateUserRequest):
    """
    The register method is used to register a new user. Only users with the admin role can call this function.
    :return: 200 if the registration was successful, 500 if unsuccessful
    """
    """
    The register method is used to register a new user. Only users with the admin role can call this function.
    :param create_user_request:
    :return: User
    """
    return await add_user(create_user_request=create_user_request)


@router.get("/current_user", response_model=JwTokenData)
async def get_current_user(current_user: JwTokenData = Depends(get_token_from_header)):
    """
    The current_user method reads the current user from the token.
    :return: 200 and a json message which contains the current user
    """
    return current_user


@router.delete("/delete_user", dependencies=[Security(validate_token_with_scope, scopes=[Role.ADMIN.name])])
async def delete(user_id: str):
    """
    The delete method deletes a user from the mongodb instance. Only users with the admin role can call this function.
    :param user_id: id of the user which should be deleted
    :return: 200 with success message if successful, else 500 and error message
    """
    return await delete_user_in_db(user_id=user_id)


@router.get(
    "/all_users",
    dependencies=[Security(validate_token_with_scope, scopes=[Role.ADMIN.name])],
    response_model=List[User],
)
async def all_users():
    """
    The all_users method reads all users from the mongodb instance and adds them to a dictionary. Only users with the
    admin role can call this function.
    :return: dictionary with all users from the mongodb instance
    """
    return await list_users()


@router.get("/get_user/{username}")
async def get_user(username, user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name])):
    """
    The get_user method reads the data from a single user from the mongodb instance and adds them to a dictionary.
    :return: dictionary with all user information from the specified username from the mongodb instance
    """
    if not username == user.username:
        raise HTTPException(
            status_code=401,
            detail="Can not access user data from other users",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


@router.get(
    "/admin/get_user", dependencies=[Security(validate_token_with_scope, scopes=[Role.ADMIN.name])], response_model=User
)
async def get_user(username):
    """
    The get_user method reads the data from a single user from the mongodb instance and adds them to a dictionary.
    :return: dictionary with all user information from the specified username from the mongodb instance
    """
    return await find_user_by_username(username=username)


@router.put("/update_user", dependencies=[Security(validate_token_with_scope, scopes=[Role.ADMIN.name])])
async def update_user(update_user_request: UpdateUserRequest):
    """
    The update_user method updates a database entry of a user. Only users with the admin role can call this function.
    The method also checks if the username is already taken.
    :return: the raw db response from mongodb if successful, else 500 and an error message (e.g. if username already
    taken)
    """
    user_in_db: User = await find_user_by_id(user_id=update_user_request.id)
    # if we want to change a username to an already taken username
    if update_user_request.username and update_user_request.username != user_in_db.username:
        if await find_user_by_username(update_user_request.username):
            raise HTTPException(500, detail="Username already taken")
            # jsonify(msg="username already taken"), 500

    return await update_user_by_request(update_user_request=update_user_request)


@router.put("/update_password", response_model=User)
async def update_password(
    update_password_request: UpdatePasswordRequest,
    user: User = Security(get_current_user_with_scope, scopes=[Role.USER.name]),
):
    """
    This method lets the current user change his password. The user can only change his own password. To access this
    method a JWT is required but with no role requirements.
    :return: database response if successful, else error message and 500
    """
    if not update_password_request.id == user.id:
        raise HTTPException(
            status_code=401,
            detail="Can not access user data from other users",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return await update_user_password_by_request(update_password_request=update_password_request)
