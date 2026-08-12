

def show_destiation(destination_list):
    destination_summary = ''
    no = 1
    for destination in destination_list :
        destination_summary += f"{no}.{destination} "
        no += 1
    return destination_summary

def season_forecast(month):
    if month == 'Desember':
        season = 'Peak season'
    elif month == 'June':
        season = 'Holiday season'
    else:
        season = 'Regular season'

    return season

def transportation_recommendation(category):
    if category == 'Standard':
        transportation = "Train"
    elif category == 'Luxury':
        transportation = "Flight"    
    else:
        transportation = 'Bus'

    return transportation

def get_trip_category(budget):
    if budget < 1000 :
        category = "Backpacker"
    elif budget <= 3000 :
        category = "Standard"
    else :
        category = "Luxury"
    return category

def calculate_daily_budget(budget, days):
    return budget / days

def get_recommended_place(country):
    recomended_places = {
        'Japan': [
            "Tokyo",
            "Shibuya",
            "Kabukicho",
            "Asakusa",
            "Ueno",
            "Akihabara"
        ],
        'Korea': [
            "Seoul",
        ],
        'Indonesia': [
            'Bali',
            'Bandung',
            'puncak'
        ]
    }
    print(f"=== {country} Recommended Places ===")
    recomended_place = recomended_places.get(country,[])
    if len(recomended_place) > 0:
        for place in recomended_place:
            print(f"- {place}")
    else :
        print('- Recommendation Empty -')   

def print_trip_summary(destination_list, country, days, budget, travel_month ):
    category = get_trip_category(budget)
    daily_budget = calculate_daily_budget(budget, days)
    transportation = transportation_recommendation(category)
    destination_summary = show_destiation(destination_list)
    season = season_forecast(travel_month)
    
    print("============================")
    print('Kelana Ai')
    print("============================")
    print(f"Country                     : {country}")    
    print(f"Destination                 : {destination_summary}")    
    print(f"Days                        : {days}")
    print(f'Category                    : {category}')
    print(f"Daily Budget                : {daily_budget} USD/day")
    print(f"Travel Month                : {travel_month}")
    print(f"Season                      : {season}")
    print(f"Recommendation Transport    : {transportation}")

    get_recommended_place(country)
    
