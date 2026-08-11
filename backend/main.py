#Now Use Them
def print_trip_summary(destination, days, budget, travel_style, hotel_cost, food_cost, transportation_cost, miscellaneous_cost, country, currency, month_of_travel):

    total_estimated_cost = (hotel_cost + food_cost + transportation_cost + miscellaneous_cost)

    print("========================")
    print("KelanaAI")
    print("========================")
    print(f"Destination : {destination}")
    print(f"Country     : {country}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget} {currency}")
    print(f"Currency    : {currency}")
    print(f"Travel Month: {month_of_travel}")
    print(f"Style       : {travel_style}")
    print(f"Hotel Cost  : {hotel_cost} {currency}")
    print(f"Food Cost   : {food_cost} {currency}")
    print(f"Transport   : {transportation_cost} {currency}")
    print(f"Misc Cost   : {miscellaneous_cost} {currency}")
    print(f"Total Cost  : {total_estimated_cost} {currency}")

    if total_estimated_cost > budget:
        print("⚠ Budget Exceeded." )   

    print()


destination = input("Destination : ")
country = input("Country : ")
days = int(input("Days : "))
budget = float(input("Budget : "))
travel_style = input("Style : ")
hotel_cost = float(input("Hotel Cost : "))
food_cost = float(input("Food Cost : "))
transportation_cost = float(input("Transportation Cost : "))
miscellaneous_cost = float(input("Miscellaneous Cost : "))
currency = input("Currency : ")
month_of_travel = input("Month of Travel : ")

# Call it with any trip
print_trip_summary(destination, days, budget, travel_style, hotel_cost, food_cost, transportation_cost, miscellaneous_cost, country, currency, month_of_travel)

