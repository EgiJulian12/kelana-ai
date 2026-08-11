def print_trip_summary(destination, country, days, budget, currency, travel_month):
    
    print("========================")
    print("KelanaAI")
    print("========================")
    print(f"Destination : {destination}")
    print(f"Country     : {country}")
    print(f"Days        : {int(days)}")
    print(f"Budget      : {float(budget)} {currency}")
    print(f"Currency    : {currency}")
    print(f"Travel Month    : {travel_month}")
   

# Call it with any trip
print_trip_summary("Japan", "Japan", 5, 1500, "USD", "December")


