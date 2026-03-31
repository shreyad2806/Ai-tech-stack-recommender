import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, DateTime, JSON
from database import Base


# EXISTING USER MODEL (KEEP THIS)
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


# NEW STACK MODEL (ADD THIS)
class Stack(Base):
    __tablename__ = "stacks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    idea = Column(Text, nullable=False)

    architecture = Column(Text)
    core_technologies = Column(JSON)
    deployment = Column(Text)
    roadmap = Column(JSON)

    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Stack(id={self.id}, idea={self.idea[:20]})>"


# STACK SHARE MODEL (NEW - for public sharing)
class StackShare(Base):
    __tablename__ = "stack_shares"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    data = Column(JSON, nullable=False)  # Stores the entire stack result as JSON
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<StackShare(id={self.id})>"