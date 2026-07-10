from fastapi import APIRouter, UploadFile, File ,Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.upload import Upload
from schemas.upload import UploadUpdate
import pandas as pd
from models.user import User
from schemas.user import UserCreate
from security import hash_password
router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }
@router.post("/upload")
async def upload_csv(file: UploadFile = File(...),
                      db: Session = Depends(get_db)):

    df = pd.read_csv(file.file)
    new_upload = Upload(
    filename=file.filename,
    rows=len(df),
    columns=len(df.columns)
    )

    db.add(new_upload)
    db.commit()
    db.refresh(new_upload)

    return {
        "filename": file.filename,
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "status": "Success"
    }
@router.get("/uploads")
async def get_uploads(
    db: Session = Depends(get_db)
):
    uploads = db.query(Upload).all()

    return uploads
@router.delete("/uploads/{upload_id}")
def delete_upload(upload_id: int, db: Session = Depends(get_db)):

    upload = db.query(Upload).filter(Upload.id == upload_id).first()

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    db.delete(upload)
    db.commit()

    return {"message": "Upload deleted successfully"}
@router.put("/uploads/{upload_id}")
def update_upload(
    upload_id: int,
    updated_upload: UploadUpdate,
    db: Session = Depends(get_db)
):
    upload = db.query(Upload).filter(
        Upload.id == upload_id
    ).first()

    if not upload:
        raise HTTPException(
            status_code=404,
            detail="Upload not found"
        )

    upload.filename = updated_upload.filename

    db.commit()
    db.refresh(upload)

    return upload