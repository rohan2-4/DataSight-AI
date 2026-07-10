from fastapi import FastAPI
from routers import upload
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from models.upload import Upload

app = FastAPI()
Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(upload.router)


@app.get("/")
def home():
    return {
        "message": "Welcome to DataSight AI Backend 🚀"
    }