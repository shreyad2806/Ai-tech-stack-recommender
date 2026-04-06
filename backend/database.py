import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Setup logging
log = logging.getLogger("database")

DATABASE_URL = os.getenv("DATABASE_URL")

# Production-safe: Don't crash if DATABASE_URL is missing
if not DATABASE_URL:
    log.warning("⚠️ DATABASE_URL not set - database features will be disabled")
    engine = None
    SessionLocal = None
    Base = None
else:
    # Fix Render postgres URL
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # Mask URL for logging (show only first/last few chars)
    masked_url = DATABASE_URL[:20] + "..." + DATABASE_URL[-15:] if len(DATABASE_URL) > 35 else "***"
    log.info(f"🔌 Connecting to database: {masked_url}")
    
    # Create engine with pool_pre_ping for production stability
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    
    # Session factory
    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )
    
    # Base class
    Base = declarative_base()
    log.info("✅ Database engine created successfully")


# Dependency (used in FastAPI routes) - returns None if DB not configured
def get_db():
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# IMPORTANT: CREATE TABLES - safe to call even if DB not configured
def init_db():
    if engine is None:
        log.warning("⚠️ Cannot init DB - DATABASE_URL not configured")
        return False
    
    try:
        from models import User, Stack, StackShare  # ensures models are registered
        Base.metadata.create_all(bind=engine)
        log.info("✅ Database tables created successfully")
        return True
    except Exception as e:
        log.error(f"❌ Failed to create database tables: {e}")
        raise  # Re-raise so caller can handle