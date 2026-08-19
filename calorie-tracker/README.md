# Calorie Tracker

A full-stack calorie tracking prototype with a React + Vite frontend and a FastAPI backend.

## Project Structure

- `frontend/` contains the Vite app, React components, styles, assets, and API client.
- `backend/` contains the FastAPI app, routes, services, in-memory state, and nutrition data.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs`.
