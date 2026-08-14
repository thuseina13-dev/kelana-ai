
from services.trip_service import (
    transportation_recommendation,
    calculate_daily_budget,
    get_trip_category
)
from pydantic import BaseModel
from fastapi import FastAPI

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str

app = FastAPI()

@app.get('/')
def home():
    return {"message": "Welcome to Kelana AI"}

@app.get('/api/v1/trip-categories')
def get_trip_categories(): 
    return [
        'Backpacker',
        'Standard',
        'Luxury',
    ]

@app.get('/api/v1/recommendations')
def get_recommendations(): 
    return [
        'Tokyo Tower',
        'Mount Fuji',
        'Shibuya',
    ]

@app.get('/api/v1/transportations')
def get_transportations(): 
    return [
        'Bus',
        'Train',
        'Flight',
    ]

@app.get('/health')
def get_health():
    return {
        'status': 'OK'
    }



@app.post('/api/v1/trips')
def get_trips(request: TripRequest):
    budget = request.budget
    days = request.days
    travel_style = request.travel_style
    category = get_trip_category(budget)
    daily_budget = calculate_daily_budget(budget, days)
    recommendation_transport = transportation_recommendation(category)

    return {
        'Destination': request.destination,
        'Days': request.days,
        'Budget': request.budget,
        'Daily Budget': daily_budget,
        'Category': category,
        'Travel Style': travel_style,
        'Recommendation Transport': recommendation_transport
    }
