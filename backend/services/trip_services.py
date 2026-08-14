def calculate_daily_budget(budget, days):
 return budget/days

def get_trip_category(budget):
 if budget < 1000:
   return "Backpacker"
 elif budget <= 3000:
   return "Standard"
 else:
   return "Luxury"

def get_transportation_recomendation(category):
    if category == "Backpacker":
        return "Bus"
    elif category == "Standard":
        return "Train"
    else:
        return "Flight"

def get_travel_season(month):
    if month == "December":
        return " Peak Season"
    elif month == "June":
        return "Holiday Season"
    else:
        return "Regular Season"

def get_recomendation_places(destination):
    recomendations = {
        "Japan" : ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "Bali" : ["Ubud", "Kuta Beach", "Tanah Lot"],
        "Singapore": ["Marina Bay Sand", "Garden by the bay", "Sentosa"]
    }

    return recomendations.get(destination, ["City Center", "Local Market", "Popular Landmark"])