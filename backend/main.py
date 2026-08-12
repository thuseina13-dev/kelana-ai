from services.trip_service import print_trip_summary

destination_list = []
country = input("Country: ")
print('===============================')
print('Input Destination')

while True:
    print('If done type char "n"')
    dest_input = input("Destination: ")
    if dest_input != 'n' and dest_input != '':
        destination_list.append(dest_input)
    else:
        break   

days = int(input("Days: "))
budget = float(input("Budget: "))
travel_month = input("Travel Month: ")

print_trip_summary(destination_list, country, days, budget, travel_month)
