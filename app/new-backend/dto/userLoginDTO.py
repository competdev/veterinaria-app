from pydantic import BaseModel


class UserLoginDTO(BaseModel):
    email: str
    password: str