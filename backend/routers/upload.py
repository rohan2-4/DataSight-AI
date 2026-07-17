from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import os
import uuid
import shutil
from datetime import datetime

from database import get_db
from models.upload import Upload
from models.user import User
from schemas.upload import UploadUpdate
from security import get_current_user

router = APIRouter(prefix="/uploads", tags=["Uploads"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def format_size(bytes_size):
    if bytes_size < 1024:
        return f"{bytes_size} B"
    elif bytes_size < 1024 * 1024:
        return f"{(bytes_size / 1024):.2f} KB"
    else:
        return f"{(bytes_size / (1024 * 1024)):.2f} MB"

@router.post("")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".csv", ".xlsx", ".xls"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a CSV or Excel file."
        )

    # Generate safe unique filename
    unique_filename = f"{current_user.id}_{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # Save file to disk
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Get file size
        file_size = os.path.getsize(file_path)

        # Read into pandas to get row/column counts and check validity
        if ext in [".xlsx", ".xls"]:
            df = pd.read_excel(file_path)
        else:
            df = pd.read_csv(file_path)

        # Save metadata to database
        new_upload = Upload(
            filename=file.filename,
            filepath=file_path,
            size=format_size(file_size),
            rows=len(df),
            columns=len(df.columns),
            user_id=current_user.id
        )
        db.add(new_upload)
        db.commit()
        db.refresh(new_upload)

        return {
            "id": new_upload.id,
            "filename": new_upload.filename,
            "size": new_upload.size,
            "rows": new_upload.rows,
            "columns": new_upload.columns,
            "status": "Uploaded",
            "date": new_upload.upload_time.isoformat()
        }

    except Exception as e:
        # Cleanup file if saved
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=400,
            detail=f"Failed to parse and save dataset file: {str(e)}"
        )

@router.get("")
async def get_uploads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    uploads = db.query(Upload).filter(
        Upload.user_id == current_user.id
    ).order_by(Upload.upload_time.desc()).all()
    
    # Map to frontend expected keys (file, size, status, date)
    result = []
    for upload in uploads:
        result.append({
            "id": upload.id,
            "filename": upload.filename,
            "file": upload.filename,  # compatibility with old keys
            "size": upload.size,
            "rows": upload.rows,
            "columns": upload.columns,
            "status": "Uploaded",
            "date": upload.upload_time.isoformat()
        })
    return result

@router.get("/{upload_id}/data")
def get_upload_data(
    upload_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    upload = db.query(Upload).filter(
        Upload.id == upload_id,
        Upload.user_id == current_user.id
    ).first()

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    if not os.path.exists(upload.filepath):
        raise HTTPException(status_code=404, detail="Physical file not found on server")

    try:
        ext = os.path.splitext(upload.filepath)[1].lower()
        if ext in [".xlsx", ".xls"]:
            df = pd.read_excel(upload.filepath)
        else:
            df = pd.read_csv(upload.filepath)

        # Replace NaN/NaT/inf with None for JSON encoding
        df = df.replace({pd.NA: None})
        df = df.where(pd.notnull(df), None)

        preview_data = df.head(100).to_dict(orient="records")
        column_names = list(df.columns)

        return {
            "id": upload.id,
            "filename": upload.filename,
            "rows": len(df),
            "columns": len(column_names),
            "column_names": column_names,
            "data": preview_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading dataset file: {str(e)}"
        )

@router.delete("/{upload_id}")
def delete_upload(
    upload_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    upload = db.query(Upload).filter(
        Upload.id == upload_id,
        Upload.user_id == current_user.id
    ).first()

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    # Delete physical file from disk
    if os.path.exists(upload.filepath):
        try:
            os.remove(upload.filepath)
        except Exception as e:
            print(f"Error deleting file {upload.filepath}: {e}")

    db.delete(upload)
    db.commit()

    return {"message": "Upload deleted successfully"}

@router.put("/{upload_id}")
def update_upload(
    upload_id: int,
    updated_upload: UploadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    upload = db.query(Upload).filter(
        Upload.id == upload_id,
        Upload.user_id == current_user.id
    ).first()

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    upload.filename = updated_upload.filename
    db.commit()
    db.refresh(upload)

    return {
        "id": upload.id,
        "filename": upload.filename,
        "size": upload.size,
        "rows": upload.rows,
        "columns": upload.columns,
        "status": "Uploaded",
        "date": upload.upload_time.isoformat()
    }