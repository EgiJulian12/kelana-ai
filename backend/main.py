from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from services.trip_services import calculate_daily_budget, get_trip_category
from models.trip import Trip
from database import SessionLocal, init_db
from services.bedrock_service import get_ai_recommendation
from dotenv import load_dotenv

import os

init_db()

app = FastAPI(title="KelanaAI API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TripRequest(BaseModel):
    destinations: List[str]
    days: int
    budget: float
    month: str
    travel_style: str = "cultural"


class TripUpdate(BaseModel):
    budget: float


# 1. Root
@app.get("/")
def home():
    return {"message": "Welcome to KelanaAI"}


# 2. Health Check
@app.get("/health")
def health_check():
    return {"status": "OK"}


# 3. Static recommendation endpoints
@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]


# 4. List all trips
@app.get("/api/v1/trips")
def list_trips():
    db = SessionLocal()
    try:
        trips = db.query(Trip).all()
        return trips
    finally:
        db.close()


# 5. Get trip by ID
@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):
    db = SessionLocal()
    try:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if trip is None:
            raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
        return trip
    finally:
        db.close()


# 6. Create trip with AI recommendation
@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category     = get_trip_category(request.budget)

    ai_recommendation = get_ai_recommendation(
        destination=", ".join(request.destinations),
        days=request.days,
        budget=request.budget,
        travel_style=request.travel_style,
    )

    db = SessionLocal()
    try:
        trip = Trip(
            destination       = ", ".join(request.destinations),
            days              = request.days,
            budget            = request.budget,
            category          = category,
            daily_budget      = daily_budget,
            ai_recommendation = ai_recommendation,
        )
        db.add(trip)
        db.commit()
        db.refresh(trip)
        return trip
    finally:
        db.close()


# 7. Generate / regenerate AI recommendation for existing trip
@app.post("/api/v1/trips/{trip_id}/generate")
def generate_trip_recommendation(trip_id: int):
    db = SessionLocal()
    try:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if trip is None:
            raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

        ai_recommendation = get_ai_recommendation(
            destination=trip.destination,
            days=trip.days,
            budget=trip.budget,
            travel_style="cultural",
        )

        trip.ai_recommendation = ai_recommendation
        db.commit()
        db.refresh(trip)
        return trip
    finally:
        db.close()


# 8. Update trip budget
@app.put("/api/v1/trips/{trip_id}")
def update_trip_budget(trip_id: int, request: TripUpdate):
    db = SessionLocal()
    try:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if trip is None:
            raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

        trip.budget       = request.budget
        trip.daily_budget = calculate_daily_budget(request.budget, trip.days)
        trip.category     = get_trip_category(request.budget)

        db.commit()
        db.refresh(trip)
        return trip
    finally:
        db.close()


# 9. Delete trip
@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int):
    db = SessionLocal()
    try:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if trip is None:
            raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

        db.delete(trip)
        db.commit()
        return {"message": f"Trip with id {trip_id} successfully deleted"}
    finally:
        db.close()
