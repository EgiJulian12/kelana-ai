from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from services.trip_services import (
    calculate_daily_budget,
    get_trip_category,
    get_recomendation_places,
    get_transportation_recomendation,
    get_travel_season,
)

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

# 3. Main Endpoint
@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    # Memanggil fungsi business logic yang sudah dibuat
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    transportation = get_transportation_recomendation(category)
    season = get_travel_season(request.month)
    
    # Mengumpulkan rekomendasi tempat untuk setiap destinasi
    recommendations = {}
    for dest in request.destinations:
        recommendations[dest] = get_recomendation_places(dest)

    # Mengembalikan JSON Response
    return {
        "destinations": request.destinations,
        "days": request.days,
        "budget": request.budget,
        "category": category,
        "daily_budget": round(daily_budget, 2),
        "travel_month": request.month,
        "season": season,
        "recommended_transportation": transportation,
        "recommended_places": recommendations
    }