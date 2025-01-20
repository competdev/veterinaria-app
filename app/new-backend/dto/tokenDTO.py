from pydantic import BaseModel


class Token(BaseModel):
    authToken: str
    token_type: str

