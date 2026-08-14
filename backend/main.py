#Now Use Them
from services.trip_services import (calculate_daily_budget, get_trip_category, get_recomendation_places, get_transportation_recomendation, get_travel_season)

def print_destinations(destinations):
    print("Your Destination")

    index = 0 
    while index < len (destinations):
        print(f"{index+1}. {destinations[index]}")
        index += 1

def print_recomendation_places(destinations):
    print("Recommended Places")
    print()

    for destination in destinations:
        print(destination)

        for place in get_recomendation_places(destination):
            print(f"- {place}")

        print()

def print_trip_summary(destination, days, budget, month):
    daily_budget = calculate_daily_budget(budget, days)
    category = get_trip_category(budget)
    transportation = get_transportation_recomendation(category)
    months = get_travel_season(month)

    print("========================")
    print("KelanaAI")
    print("========================")
    print()
    print_destinations(destination)
    print()
    print(f"Days        : {days}")
    print(f"Budget      : {budget} USD")
    print(f"Category    : {category}")
    print(f"Daily Budget: {daily_budget:.0f} USD/day")
    print(f"Travel Month: {month}")
    print(f"Season      : {months}")
    print(f"Recommended Transportation : {transportation}")
    print()
    print_recomendation_places(destination)

# Call it with any trip
print_trip_summary(["Bali", "Singapore"], 5 , 1000, "June")