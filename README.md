# FoodDelhivery

A simple food ordering system with three main parts:
- backend — Express + MongoDB API (Stripe integration for payments)
- frontend — Customer-facing React app (Vite)
- admin — Admin dashboard React app (Vite)

This repository contains a full-stack demo app for listing food items, user auth, cart management, placing orders (Stripe Checkout), and an admin panel to manage food items and orders.

## Repository layout

 - `backend/` — Node/Express API, MongoDB models, Stripe integration, file uploads
 - `frontend/` — Customer React app (Vite)
 - `admin/` — Admin React app (Vite)

## Quick start

Prerequisites: Node (latest LTS recommended), npm or yarn, and a running MongoDB instance (Atlas or local).

1. Backend

  ```bash
  cd backend
  npm install
  # create a .env (see backend/README.md)
  npm run server
  ```

2. Frontend (customer)

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

3. Admin

  ```bash
  cd admin
  npm install
  npm run dev
  ```

## Files added / edited

- `README.md` — this file (project overview + quick start)
- `backend/README.md` — backend install, .env template, API endpoints
- `frontend/README.md` — frontend run notes
- `admin/README.md` — admin run notes

## Next steps / suggestions

- Add a Postman collection or OpenAPI spec for easier API exploration.
- Add tests for backend controllers (Jest / Supertest) and CI workflow.
- Add more robust error handling and input validation for public APIs.

If you'd like, I can generate a Postman collection or add automated tests next.
