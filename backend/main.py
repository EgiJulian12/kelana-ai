from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from services.trip_services import (
    calculate_daily_budget,
    get_trip_category,
    get_recomendation_places,
    get_transportation_recomendation,
    get_travel_season,
)
from models.trip import Trip
from database import SessionLocal, init_db

init_db()

app = FastAPI(title="KelanaAI API")


# Menggantikan fungsi input() dari console
class TripRequest(BaseModel):
    destinations: List[str]  # Menerima list destinasi
    days: int
    budget: float
    month: str

# 1. Root / Welcome Endpoint
@app.get("/")
def home():
    return {"message": "Welcome to KelanaAI"}

# 2. Health Check Endpoint
@app.get("/health")
def health_check():
    return {"status": "OK"}

# 3. HOMEWORK / ENDPOINTS 
@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]

@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]

# 4. Trips Endpoints
@app.get("/api/v1/trips")
def list_trips():
    db = SessionLocal()
    trips = db.query(Trip).all()
    db.close()
    return trips

# 5. Trip_id Endpoints
@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()
    # handling not found
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    return trip


# 6. Main Endpoint
@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    # reuse Session 2 business logic
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category     = get_trip_category(request.budget)

    # create a Trip ORM object
    trip = Trip(
        destination  = ", ".join(request.destinations),
        days         = request.days,
        budget       = request.budget,
        category     = category,
        daily_budget = daily_budget,
    )

    # save to PostgreSQL
    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)   # get the auto-generated id
    db.close()
    return trip





