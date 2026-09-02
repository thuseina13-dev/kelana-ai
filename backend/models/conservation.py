from typing import Optional
from pydantic import BaseModel
from sqlalchemy import Column, ForeignKey, DateTime, BigInteger, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class ConservationModel(Base):
    __tablename__ = "conservations"
    id          =   Column(BigInteger,     primary_key=True)
    user_id     =   Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    createdAt   =   Column(DateTime(timezone=True), server_default= func.now(), nullable=False)
    title       =   Column(String,      nullable=True)
    messages    =   relationship('MessageModel', back_populates="conservation")
    user        =   relationship("UserModel", back_populates="conservations")

class ConservationRequest(BaseModel):
    title: Optional[str] = None
