from sqlalchemy import Column, BigInteger, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Trip(Base):
    __tablename__ = "trips"

    id                = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id           = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    destination       = Column(String(255), nullable=False)
    days              = Column(Integer, nullable=False)
    budget            = Column(Float, nullable=False)
    travel_style      = Column(String(100), nullable=False)
    category          = Column(String(100), nullable=False)
    daily_budget      = Column(Float, nullable=False)
    ai_recommendation = Column(String, nullable=True)
    created_at        = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="trips")
