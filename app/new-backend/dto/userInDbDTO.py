from pydantic import User


class UserInDB(User):
    hashed_password: str