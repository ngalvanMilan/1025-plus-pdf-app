from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
import models, schemas
from config import Settings
import os
import shutil

def create_pdf(db: Session, pdf: schemas.PDFRequest):
    # If the file path doesn't start with 'uploads/', assume it's a relative path and add the prefix
    file_path = pdf.file
    if not file_path.startswith('uploads/'):
        file_path = f'uploads/{file_path}'
        
    db_pdf = models.PDF(name=pdf.name, selected=pdf.selected, file=file_path)
    db.add(db_pdf)
    db.commit()
    db.refresh(db_pdf)
    return db_pdf

def read_pdfs(db: Session, selected: bool = None):
    if selected is None:
        return db.query(models.PDF).all()
    else:
        return db.query(models.PDF).filter(models.PDF.selected == selected).all()

def read_pdf(db: Session, id: int):
    return db.query(models.PDF).filter(models.PDF.id == id).first()

def update_pdf(db: Session, id: int, pdf: schemas.PDFRequest):
    db_pdf = db.query(models.PDF).filter(models.PDF.id == id).first()
    if db_pdf is None:
        return None
    update_data = pdf.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_pdf, key, value)
    db.commit()
    db.refresh(db_pdf)
    return db_pdf

def delete_pdf(db: Session, id: int):
    db_pdf = db.query(models.PDF).filter(models.PDF.id == id).first()
    if db_pdf is None:
        return None
    
    # Delete the file from the filesystem if it exists
    try:
        file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), db_pdf.file)
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted file: {file_path}")
    except Exception as e:
        print(f"Error deleting file: {str(e)}")
    
    # Delete the database record
    db.delete(db_pdf)
    db.commit()
    return True

def upload_pdf(db: Session, file: UploadFile, file_name: str):
    # Create uploads directory if it doesn't exist
    upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    # Save file to uploads directory
    file_path = os.path.join(upload_dir, file_name)
    
    try:
        # Create a temporary file to store the uploaded content
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Reset file pointer for potential future use
        file.file.seek(0)
        
        # Store the relative path in the database
        file_url = f'uploads/{file_name}'
        
        db_pdf = models.PDF(name=file.filename, selected=False, file=file_url)
        db.add(db_pdf)
        db.commit()
        db.refresh(db_pdf)
        return db_pdf
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

# Comment out the old S3 implementation
# def upload_pdf(db: Session, file: UploadFile, file_name: str):
#     s3_client = Settings.get_s3_client()
#     BUCKET_NAME = Settings().AWS_S3_BUCKET
#     
#     try:
#         s3_client.upload_fileobj(
#             file.file,
#             BUCKET_NAME,
#             file_name
#         )
#         file_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}'
#         
#         db_pdf = models.PDF(name=file.filename, selected=False, file=file_url)
#         db.add(db_pdf)
#         db.commit()
#         db.refresh(db_pdf)
#         return db_pdf
#     except NoCredentialsError:
#         raise HTTPException(status_code=500, detail="Error in AWS credentials")