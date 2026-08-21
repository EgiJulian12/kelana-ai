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
from services.bedrock_service import get_ai_recommendation


init_db()

app = FastAPI(title="KelanaAI API")


# Menggantikan fungsi input() dari console
class TripRequest(BaseModel):
    destinations: List[str]  # Menerima list destinasi
    days: int
    budget: float
    month: str
    travel_style: str = "cultural"  # default travel style

# Schema untuk update budget pada endpoint PUT
class TripUpdate(BaseModel):
    budget: float

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

    ai_recommendation = get_ai_recommendation(
        destination=", ".join(request.destinations),
        days=request.days,
        budget=request.budget,
        travel_style=request.travel_style,
    )

    # create a Trip ORM object
    trip = Trip(
        destination  = ", ".join(request.destinations),
        days         = request.days,
        budget       = request.budget,
        category     = category,
        daily_budget = daily_budget,
        ai_recommendation = ai_recommendation,
    )

    # save to PostgreSQL
    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)   # get the auto-generated id
    db.close()
    return trip

# 7. Endpoint PUT /api/v1/trips/{trip_id} - Update Budget
@app.put("/api/v1/trips/{trip_id}")
def update_trip_budget(trip_id: int, request: TripUpdate):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    # Periksa apakah trip ditemukan
    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    # Hitung ulang (recalculate) nilai category dan daily_budget
    new_daily_budget = calculate_daily_budget(request.budget, trip.days)
    new_category = get_trip_category(request.budget)


    # Update data pada object trip
    trip.budget = request.budget
    trip.daily_budget = new_daily_budget
    trip.category = new_category

    # Simpan perubahan ke database
    db.commit()
    db.refresh(trip)
    db.close()

    return trip


# 8. Endpoint DELETE /api/v1/trips/{trip_id} - Delete Trip
@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    # Periksa apakah trip ditemukan
    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    # Hapus dari database
    db.delete(trip)
    db.commit()
    db.close()

    return {"message": f"Trip with id {trip_id} successfully deleted"}





