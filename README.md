# BGA Cartography

Initial implementation scaffold for a custom map website with a React + TypeScript frontend and a FastAPI backend.

## Current State

- `frontend/` contains a dark-mode-first shell with a left map list, top admin login affordance, OpenLayers map viewport, and bottom timeline.
- `backend/` contains a FastAPI API with public map endpoints, admin login, and protected write routes backed by in-memory seed data.
- `docker-compose.yml` provisions PostgreSQL and MinIO for the next persistence and storage steps.

## Frontend

```powershell
Set-Location frontend
npm install
npm run dev
```

## Backend

1. Create `backend/.env` from `backend/.env.example`.
   `CORS_ORIGINS` can be a single URL or a comma-separated list.
2. Create and activate a Python 3.11+ virtual environment, then install the backend package and its dependencies from `backend/pyproject.toml`:

```powershell
Set-Location backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e .
```

3. Run the development server:

```powershell
Set-Location backend
python -m uvicorn app.main:app --reload
```

## Infrastructure

```powershell
docker compose up -d postgres minio minio-init
```

The API is currently contract-first and memory-backed. The next implementation pass should replace the in-memory store with PostgreSQL persistence and wire uploaded assets into a real storage backend. Local development can keep using MinIO; the deployment blueprint targets Supabase Storage for production.

See `DEPLOYMENT.md` for the GitHub Pages + Cloud Run + Supabase deployment blueprint.
