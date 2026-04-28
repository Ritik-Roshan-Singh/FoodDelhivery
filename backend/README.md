# Backend (Express + MongoDB)

This folder contains the API server for FoodDelhivery. It uses Express, Mongoose (MongoDB), and Stripe for payment processing. The API exposes endpoints for food management, user auth, cart actions and orders.

## Requirements

- Node.js (recommended LTS)
- npm or yarn
- MongoDB (Atlas or local)
- Stripe account for payments (optional for local testing)

## Install

```bash
cd backend
npm install
```

## Run (development)

Create a `.env` file in `backend/` with the following variables:

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
```

Start the server:

```bash
npm run server
```

By default the server listens on port 4000 and serves a health route at `/`.

## Project structure (important files)

- `server.js` — app bootstrap and route mounting
- `config/db.js` — MongoDB connection helper (reads `MONGO_URI`)
- `routes/` — route definitions mounted under `/api`
  - `/api/food` — food routes
  - `/api/user` — user auth routes
  - `/api/cart` — cart routes (require auth)
  - `/api/order` — order routes
- `controllers/` — request handlers
- `models/` — Mongoose models
- `middleware/auth.js` — auth middleware that expects `token` header

## API Endpoints

Base URL: `http://localhost:4000`

Food
- POST `/api/food/add` — multipart/form-data with field `image` and body fields `name`, `description`, `price`, `category`. (Admin)
- GET `/api/food/list` — list all food items
- POST `/api/food/remove` — remove food (body: `{ id }`)

User
- POST `/api/user/register` — register (body: `{ name, email, password }`) — returns JWT on success
- POST `/api/user/login` — login (body: `{ email, password }`) — returns JWT on success

Cart (protected — requires `token` header)
- POST `/api/cart/add` — add to cart (body: `{ userId, itemId }`) — increments quantity
- POST `/api/cart/remove` — remove/decrement item (body: `{ userId, itemId }`)
- POST `/api/cart/get` — get cart (body: `{ userId }`)

Orders
- POST `/api/order/place` — place an order (protected). Body: `{ userId, items: [...], amount, address }`. Creates a Stripe Checkout session and returns `session_url` to redirect the user to for payment.
- POST `/api/order/verify` — verify order after checkout (body: `{ orderId, success }`) — updates order payment flag
- POST `/api/order/userorders` — get orders for a user (protected) — body: `{ userId }`
- GET `/api/order/list` — list all orders (admin)
- POST `/api/order/status` — update order status (body: `{ orderId, status }`) (admin)

## Authentication

- The backend uses JWT. After login/register the server returns a `token`. Protected routes expect the token to be sent in the `token` header. The `auth` middleware decodes the token and sets `req.body.userId`.

## File uploads

- Images for food items are stored in the `uploads/` folder and served statically at `/images` (so an image saved as `uploads/123.png` is accessible at `/images/123.png`).

## Notes & recommendations

- For production, set `PORT` via env (server currently uses a hard-coded 4000). Consider reading it from env.
- Add rate limiting, more robust validation (e.g. celebrate/Joi), and centralized error handling.
- Do not commit `.env` or secrets to git.
