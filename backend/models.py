import uuid
from sqlalchemy import Column, String
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
