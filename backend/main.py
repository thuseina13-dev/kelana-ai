from services.bedrock_services import get_bedrock_recommendation
from database import init_db
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import SessionLocal
from models.trip import TripRequest, TripModel
from models.user import UserModel, UserRequest, LoginRequest
from services.trip_service import calculate_daily_budget
from services.auth_services import register_new_user, authenticate_user, verify_token
from fastapi.middleware.cors import CORSMiddleware
import os

init_db()

app = FastAPI()

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token or expired token")
    return payload


app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv('FRONTEND_URL')],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def home():
    return {"message": "Welcome to Kelana AI"}

@app.get('/api/v1/trip-categories')
def get_trip_categories(current_user: dict = Depends(get_current_user)): 
    return [
        'Backpacker',
        'Standard',
        'Luxury',
    ]

@app.get('/api/v1/recommendations')
def get_recommendations(current_user: dict = Depends(get_current_user)): 
    return [
        'Tokyo Tower',
        'Mount Fuji',
        'Shibuya',
    ]

@app.get('/api/v1/transportations')
def get_transportations(current_user: dict = Depends(get_current_user)): 
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
def post_trips(request: TripRequest, current_user: dict = Depends(get_current_user)):
    budget = request.budget
    days = request.days
    daily_budget = calculate_daily_budget(budget, days)
    user_id = int(current_user["sub"])

    trip = TripModel(
        destination = request.destination,
        days = request.days,
        budget = request.budget,
        category = request.travel_style,
        daily_budget = daily_budget,
        user_id = user_id
    )

    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()

    return trip


@app.post('/api/v1/trips/{trip_id}/generate')
def regenerate_ai_recommendation(trip_id: int, current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()
    if (trip is None):
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    user_id = int(current_user["sub"])
    if trip.user_id != user_id:
        db.close()
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's trip")

    ai_recommendation_result = get_bedrock_recommendation(trip.days, trip.destination, trip.budget, trip.category)

    trip.ai_recommendation = ai_recommendation_result

    db.commit()
    db.refresh(trip)
    db.close()

    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "recommendation": trip.ai_recommendation
    }

@app.get('/api/v1/trips')
def get_trip(current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    user_id = int(current_user["sub"])
    trip = db.query(TripModel).filter(TripModel.user_id == user_id).all()
    db.close()
    return trip

@app.get('/api/v1/trips/{trip_id}')
def get_trip_by_id(trip_id: int, current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()
    db.close()
    if (trip is None):
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    user_id = int(current_user["sub"])
    if trip.user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot view another user's trip")

    return trip


@app.delete('/api/v1/trips/{trip_id}')
def delete_trip_by_id(trip_id: int, current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()
    if (trip is None):
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    
    user_id = int(current_user["sub"])
    if trip.user_id != user_id:
        db.close()
        raise HTTPException(status_code=403, detail="Forbidden: You cannot delete another user's trip")

    db.delete(trip)
    db.commit()
    db.close()
    return trip

@app.put('/api/v1/trips/{trip_id}')
def update_trip_by_id(trip_id: int, request: TripRequest, current_user: dict = Depends(get_current_user)):
    budget = request.budget
    days = request.days
    daily_budget = calculate_daily_budget(budget, days)
    
    db = SessionLocal()
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()
    if (trip is None):
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    user_id = int(current_user["sub"])
    if trip.user_id != user_id:
        db.close()
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's trip")

    trip.destination = request.destination
    trip.days = request.days
    trip.budget = request.budget
    trip.category = request.travel_style
    trip.daily_budget = daily_budget
    trip.user_id = user_id
    
    db.commit()
    db.refresh(trip)
    db.close()

    return trip


@app.post('/api/v1/auth/register')
def register_user(request: UserRequest):
    db = SessionLocal()
    new_user = register_new_user(db, request)
    db.close()
    
    if new_user is None:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return {
        "name": new_user.name,
        "email": new_user.email,
        "createdAt": new_user.createdAt
    }


@app.post('/api/v1/auth/login')
def login_user(request: LoginRequest):
    db = SessionLocal()
    result = authenticate_user(db, request)
    db.close()
    
    if result is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    token, user = result
    return {
        "access_token": token,
        "token_type": "bearer",
    }


@app.get('/api/v1/auth/me')
def get_me(current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    user_id = int(current_user["sub"])
    
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    total_trips = db.query(TripModel).filter(TripModel.user_id == user_id).count()
    db.close()
    
    return {
        "name": user.name,
        "email": user.email,
        "total_trip_generated": total_trips
    }





