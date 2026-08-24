def calculate_daily_budget(budget: float, days: int) -> float:
    if days <= 0:
        raise ValueError("days must be greater than 0")
    return budget / days


def get_trip_category(budget: float) -> str:
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"


def get_transportation_recomendation(category: str) -> str:
    if category == "Backpacker":
        return "Bus"
    elif category == "Standard":
        return "Train"
    else:
        return "Flight"


def get_travel_season(month: str) -> str:
    if month == "December":
        return "Peak Season"      # fixed: removed leading space
    elif month == "June":
        return "Holiday Season"
    else:
        return "Regular Season"


def get_recomendation_places(destination: str) -> list:
    recommendations = {
        "Japan":     ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "Bali":      ["Ubud", "Kuta Beach", "Tanah Lot"],
        "Singapore": ["Marina Bay Sands", "Gardens by the Bay", "Sentosa"],
    }
    return recommendations.get(destination, ["City Center", "Local Market", "Popular Landmark"])
