# JWT Demo API (FastAPI)

API construida con FastAPI y Poetry que implementa autenticación JWT.

## Endpoints

- `POST /token`
  - Body JSON:
    ```json
    {
      "username": "admin",
      "password": "admin123"
    }
    ```
  - Devuelve un `access_token` JWT con expiración de `300` segundos.

- `POST /token/refresh`
  - Header requerido:
    `Authorization: Bearer <token>`
  - Devuelve un nuevo `access_token` con expiración de `300` segundos.

## Ejecutar localmente

```bash
poetry install
poetry run uvicorn backend.main:app --reload
```

## Ejecutar con Docker Compose

Desde la raíz del proyecto:

```bash
export JWT_SECRET_KEY="una-clave-segura-de-32-caracteres-minimo"
docker compose up --build
```

La API quedará disponible en `http://localhost:8000`.
