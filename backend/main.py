from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, upload, analysis
import os

# Create local directories on startup
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datasets")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="DataSight AI Backend")

# Initialize database schemas
Base.metadata.create_all(bind=engine)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(analysis.router)

@app.get("/")
def home():
    return {
        "message": "Welcome to DataSight AI Backend 🚀",
        "status": "Online"
    }