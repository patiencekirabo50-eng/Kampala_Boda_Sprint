# FlyFerry — Flight & Ferry Booking App

## Overview
Mobile-first booking app for flights and ferries across East Africa. React + Vite frontend, Express backend with in-memory seed data.

## Architecture
- **Frontend** (`client/`): React 18 + Vite 6 + Tailwind CSS + React Router. Dev server on port 5173, proxied to host port 3000.
- **Backend** (`server/`): Express with in-memory data (no database). Dev server on port 8000. Uses `node --watch` for live reload.
- **API proxy**: Vite dev server proxies `/api` requests to the backend container (`http://backend:8000`).

## Running
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/health

## Key Details
- No external credentials required — all data is seeded in-memory on the backend.
- Card payment is **simulated** (Luhn validation only). To enable real payments, integrate Stripe (available in the user's region).
- Bookings persist in memory and reset when the backend container restarts.
- The frontend is mobile-first, centered with `max-w-md` on larger screens.
