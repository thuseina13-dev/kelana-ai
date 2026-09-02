from sqlalchemy import Column, ForeignKey, String, Text, DateTime, BigInteger
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from database import Base

class MessageModel(Base):
    __tablename__ = "messages"
    id                  =   Column(BigInteger,     primary_key=True)
    conservation_id     =   Column(BigInteger, ForeignKey("conservations.id", ondelete="SET NULL"), nullable=True, index=True)
    role                =   Column(String,      nullable=False)
    content             =   Column(Text,      nullable=False)
    createdAt           =   Column(DateTime(timezone=True), server_default= func.now(), nullable=False)
    conservation        =   relationship('ConservationModel', back_populates="messages")

class MessageRequest(BaseModel):
    role: str
    content: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequestBody(BaseModel):
    messages: list[ChatMessage] = []
    quetions: str = ""
