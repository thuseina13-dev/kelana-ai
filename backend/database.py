from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base 
import os

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()

def init_db() -> None:
    """Create All SQLAlchemy tables for the configured databases."""
    import models.user  # noqa: F401
    import models.trip  # noqa: F401
    import models.conservation  # noqa: F401
    import models.messages  # noqa: F401

    Base.metadata.create_all(bind=engine)

