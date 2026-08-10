destination = input("Destination: ")
country = input("Country: ")
days = int(input("Days: "))
currency = input("Currency: ")
budget = float(input("Budget: "))
travenl_month = input("Travel Month: ")

def print_trip_summary(destination, country, days, budget, currency, travenl_month ):
    
    print("============================")
    print('Kelana Ai')
    print("============================")
    print(f"Destination     : {destination}")    
    print(f"Country         : {country}")    
    print(f"Days            : {days}")
    print(f"Budget          : {budget} {currency}")
    print(f"Currency        : {currency}")
    print(f"Travel Month    : {travenl_month}")


print_trip_summary(destination, country, days, budget, currency, travenl_month)