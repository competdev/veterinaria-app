from datetime import timedelta

from typing import Union
from fastapi import FastAPI, HTTPException, status
from dto.userLoginDTO import UserLoginDTO
from dto.tokenDTO import Token
from misc.jwtFunctions import authenticate_user, create_access_token, fake_users_db, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


# @app.post("/auth/login")
# def login(userLoginDTO: UserLoginDTO):
#     return {"Hello": "World"}


@app.post("/hemogram-exam")
def login(userLoginDTO: UserLoginDTO):
    return {"Hello": "World"}

# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

# @app.post("/token")
# async def login_for_access_token(
#     form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
# ) -> Token:
#     user = authenticate_user(fake_users_db, form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": user.username}, expires_delta=access_token_expires
#     )
#     return Token(access_token=access_token, token_type="bearer")


@app.post("/auth/login")
def login(userLoginDTO: UserLoginDTO):
    user = authenticate_user(fake_users_db, userLoginDTO.email, userLoginDTO.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(authToken=access_token, token_type="bearer")


@app.get("/auth/hash")
def get_hash(userLoginDTO: UserLoginDTO):
    userLoginDTO.password = get_password_hash(userLoginDTO.password)
    return userLoginDTO
