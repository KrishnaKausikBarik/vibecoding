# CalorieTracker Backend

This is a prototype FastAPI backend for the Calorie Tracker application.

## Setup Instructions

```bash
cd backend
python -m venv .venv
# Activate venv:
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API Documentation
Once running, visit `http://localhost:8000/docs` to see the Swagger UI.
