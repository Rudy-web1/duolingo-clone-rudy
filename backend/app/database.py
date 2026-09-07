"""
Database connection setup.

Uses SQLite for simplicity (per assignment spec). SQLAlchemy ORM.
The DB file is created at backend/duolingo.db on first run.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'duolingo.db')}"

# check_same_thread=False needed because FastAPI can use different threads
# per request while SQLite connections are thread-bound by default.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
