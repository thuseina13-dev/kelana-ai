
from database import init_db
from fastapi import HTTPException
from database import SessionLocal
from models.trip import TripRequest, TripModel
from services.trip_service import (
    calculate_daily_budget,
    get_trip_category
)
from fastapi import FastAPI

init_db()

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
def post_trips(request: TripRequest):
    budget = request.budget
    days = request.days
    category = get_trip_category(budget)
    daily_budget = calculate_daily_budget(budget, days)

    trip = TripModel(
        destination = request.destination,
        days = request.days,
        budget = request.budget,
        category = category,
        daily_budget = daily_budget
    )
    
    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()

    return trip

@app.get('/api/v1/trips')
def get_trip():
    db = SessionLocal()
    trip = db.query(TripModel).all()
    db.close()
    return trip

@app.get('/api/v1/trips/{trip_id}')
def get_trip_by_id(trip_id: int):
    db = SessionLocal()
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()
    db.close()
    if (trip is None):
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    return trip


@app.delete('/api/v1/trips/{trip_id}')
def delete_trip_by_id(trip_id: int):
    db = SessionLocal()
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()
    if (trip is None):
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    
    db.delete(trip)
    db.commit()
    db.close()
    return trip

@app.put('/api/v1/trips/{trip_id}')
def update_trip_by_id(trip_id : int, request : TripRequest):
    budget = request.budget
    days = request.days
    category = get_trip_category(budget)
    daily_budget = calculate_daily_budget(budget, days)
    
    db = SessionLocal()
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()
    if (trip is None):
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    trip.destination = request.destination
    trip.days = request.days
    trip.budget = request.budget
    trip.category = category
    trip.daily_budget = daily_budget
    
    db.commit()
    db.refresh(trip)
    db.close()

    return trip
