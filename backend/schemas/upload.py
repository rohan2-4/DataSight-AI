from pydantic import BaseModel


class UploadUpdate(BaseModel):
    filename: str