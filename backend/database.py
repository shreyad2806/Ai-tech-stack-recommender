import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Database URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/aitech"
)

# ✅ Create engine
engine = create_engine(DATABASE_URL)

# ✅ Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ✅ Base class
Base = declarative_base()


# ✅ Dependency (used in FastAPI routes)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ IMPORTANT: CREATE TABLES
def init_db():
    from models import User, Stack, StackShare  # 👈 ensures models are registered
    Base.metadata.create_all(bind=engine)
    
