from datetime import datetime, timedelta, timezone
import os
import secrets

import jwt
from fastapi import Depends, FastAPI, Header, HTTPException, status
from pydantic import BaseModel

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY environment variable must be set")
JWT_ALGORITHM = "HS256"
TOKEN_EXPIRATION_SECONDS = 300
VALID_USERNAME = os.getenv("JWT_ADMIN_USERNAME", "admin")
VALID_PASSWORD = os.getenv("JWT_ADMIN_PASSWORD", "admin123")

app = FastAPI(title="JWT Demo API")


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = TOKEN_EXPIRATION_SECONDS


def _create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(seconds=TOKEN_EXPIRATION_SECONDS)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def _get_bearer_token(authorization: str = Header(...)) -> str:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
        )
    return token


@app.post("/token", response_model=TokenResponse)
def create_token(credentials: LoginRequest) -> TokenResponse:
    username_ok = secrets.compare_digest(credentials.username, VALID_USERNAME)
    password_ok = secrets.compare_digest(credentials.password, VALID_PASSWORD)
    if not username_ok or not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    return TokenResponse(access_token=_create_access_token(credentials.username))


@app.post("/token/refresh", response_model=TokenResponse)
def refresh_token(token: str = Depends(_get_bearer_token)) -> TokenResponse:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        subject = payload.get("sub")
        if not subject:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )
    except (jwt.exceptions.ExpiredSignatureError, jwt.exceptions.InvalidTokenError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc

    return TokenResponse(access_token=_create_access_token(subject))
