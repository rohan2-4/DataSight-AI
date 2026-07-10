from fastapi import APIRouter, UploadFile, File ,Depends
from sqlalchemy.orm import Session

from database import get_db
from models.upload import Upload
import pandas as pd

router = APIRouter()


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