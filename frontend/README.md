# Frontend - Login JWT

Aplicación web en React que consume la API FastAPI del proyecto para autenticación.

## Funcionalidad

- Página de **login** (`/`) que llama a `POST /token`.
- Al autenticarse, guarda el `access_token` en **sessionStorage**.
- Página de **bienvenida** (`/welcome`) protegida.
- Si no hay sesión iniciada, no permite entrar a `/welcome` y redirige al login.
- Botón de cierre de sesión que elimina el token de la sesión.

## Requisitos

- Node.js 20+
- Backend ejecutándose en `http://localhost:8000`

## Ejecución

Desde la raíz del repositorio:

```bash
cd backend
~/.local/bin/poetry install
JWT_SECRET_KEY="una-clave-segura-de-32-caracteres-minimo" ~/.local/bin/poetry run uvicorn backend.main:app --reload
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`.

## Credenciales por defecto (backend)

- Usuario: `admin`
- Contraseña: `admin123`

## Build

```bash
cd frontend
npm run build
```
