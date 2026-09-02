from sqlalchemy.orm import relationship
from sqlalchemy import BigInteger
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from pydantic import BaseModel, Field
from sqlalchemy import Column, String
from database import Base

class UserModel(Base):
    __tablename__ = "users"
    id =                Column(BigInteger,     primary_key=True)
    name =              Column(String,      nullable=False)
    email=              Column(String,      nullable=False)
    password_bash =     Column(String,      nullable=False)
    createdAt =         Column(DateTime(timezone=True), server_default= func.now(), nullable=False)

    trips =             relationship('TripModel', back_populates="user")
    conservations =     relationship('ConservationModel', back_populates="user")

class UserRequest(BaseModel):
    name: str
    email: str = Field(..., min_length=1)
    password: str

class LoginRequest(BaseModel):
    email: str = Field(..., min_length=1)
    password: str


 