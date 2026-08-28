import bcrypt
from sqlalchemy.orm import Session
from models.user import UserModel, UserRequest, LoginRequest
from jose import jwt, JWTError

def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using bcrypt.
    
    Args:
        password (str): The plain-text password to hash.
        
    Returns:
        str: The hashed password decoded to a UTF-8 string.
    """
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against a hashed password.
    
    Args:
        plain_password (str): The plain-text password to verify.
        hashed_password (str): The bcrypt hashed password to check against.
        
    Returns:
        bool: True if the password matches, False otherwise.
    """
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def register_new_user(db: Session, request: UserRequest) -> UserModel | None:
    """
    Registers a new user by checking if the email already exists,
    hashing the password, and saving the user details to the database.
    """
    existing_user = db.query(UserModel).filter(UserModel.email == request.email).first()
    if existing_user:
        return None

    hashed_pw = hash_password(request.password)
    new_user = UserModel(
        name=request.name,
        email=request.email,
        password_bash=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, request: LoginRequest) -> tuple[str, UserModel] | None:
    """
    Authenticates a user by email and password, generating a JWT token if successful.
    """
    user = db.query(UserModel).filter(UserModel.email == request.email).first()
    if not user:
        return None

    if not verify_password(request.password, user.password_bash):
        return None

    import datetime
    import os

    jwt_secret = os.getenv("JWT_SECRET", 'Pass4JWT_SECRET_DEV')
    expiredTime = os.getenv("EXPIRED_TOKEN_TIME", '60') 
    payload = {
        "sub": str(user.id),
        "name": user.name,
        "email": user.email,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=int(expiredTime))
    }
    token = jwt.encode(payload, jwt_secret, algorithm="HS256")
    return token, user

def verify_token(token: str) -> dict | None:
    """
    Decodes and validates a JWT token. Returns the payload if valid, otherwise None.
    """
    import os
    jwt_secret = os.getenv("JWT_SECRET")
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=["HS256"])
        return payload
    except JWTError:
        return None



