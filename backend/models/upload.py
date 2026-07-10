from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from database import Base


class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    rows = Column(Integer)
    columns = Column(Integer)
    upload_time = Column(
        DateTime,
        default=datetime.utcnow
    )

