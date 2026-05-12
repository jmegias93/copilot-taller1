import os

import jwt
from fastapi.testclient import TestClient

os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-with-at-least-32-characters")

from backend.main import JWT_ALGORITHM, JWT_SECRET_KEY, TOKEN_EXPIRATION_SECONDS, app

client = TestClient(app)


def test_create_token_with_valid_credentials() -> None:
    response = client.post("/token", json={"username": "admin", "password": "admin123"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert payload["expires_in"] == TOKEN_EXPIRATION_SECONDS

    decoded = jwt.decode(payload["access_token"], JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    assert decoded["sub"] == "admin"


def test_create_token_with_invalid_credentials() -> None:
    response = client.post("/token", json={"username": "admin", "password": "invalid"})

    assert response.status_code == 401


def test_refresh_token() -> None:
    token = client.post("/token", json={"username": "admin", "password": "admin123"}).json()["access_token"]

    response = client.post("/token/refresh", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["access_token"]
    assert payload["expires_in"] == TOKEN_EXPIRATION_SECONDS
