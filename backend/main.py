destination = input("Destination: ")
days = int(input("Days: "))
budget = float(input("Budget: "))
travel_style = input("Travel Style: "  )
hotel_cost = float(input('Hotel Cost: '))
transportation_cost = float(input('Transportation Cost: '))
food_cost = float(input('Food Cost: '))
miscellaneous_cost = float(input('Miscellaneous Cost: '))
total_cost = hotel_cost + transportation_cost + food_cost + miscellaneous_cost

def print_trip_summary(
        destination,
        days, 
        budget,
        travel_style,
        total_cost, 
        hotel_cost,
        food_cost,
        transportation_cost,
        miscellaneous_cost):
    
    print("============================")
    print('Kelana Ai')
    print("============================")
    print(f"Destination     : {destination}")    
    print(f"Days            : {days}")
    print(f"Travel Style    : {travel_style}")
    print(f"Budget          : {budget}")
    print(f"Hotel Cost      : {hotel_cost}")
    print(f"Food Cost       : {food_cost}")
    print(f"Transportation Cost : {transportation_cost}")
    print(f"Miscellaneous Cost : {miscellaneous_cost}")
    print(f"Total Cost      : {total_cost}")

    if(total_cost > budget):
        print("⚠ Budget exceeded.")
        


print_trip_summary(destination, days, budget, travel_style, total_cost, hotel_cost, food_cost, transportation_cost, miscellaneous_cost)