from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///nutrisim.db"  # simple SQLite for now

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)