<<<<<<< HEAD
# E-commerce-platform
=======
# E-Commerce Backend API

This is the backend API for an e-commerce platform selling fans and air conditioners.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zuvees
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

3. Start the server:
```bash
node server.js
```

## API Endpoints

### Authentication

- `POST /api/auth/google`
  - Google OAuth login
  - Request body: `{ token: "google_id_token" }`

### Products

- `GET /api/products`
  - Get all products
- `GET /api/products/:id`
  - Get product by ID

### Orders

- `POST /api/orders`
  - Create new order (requires authentication)
  - Request body: `{ items: [{ product, color, size, quantity }], shippingAddress: {...} }`
- `GET /api/orders/my-orders`
  - Get user's orders (requires authentication)

### Admin Routes

- `GET /api/admin/orders`
  - Get all orders (requires admin authentication)
- `PATCH /api/admin/orders/:id/status`
  - Update order status (requires admin authentication)
  - Request body: `{ status: "shipped", riderId: "rider_id" }`
- `GET /api/admin/riders`
  - Get all riders (requires admin authentication)

### Rider Routes

- `GET /api/rider/orders`
  - Get rider's assigned orders (requires rider authentication)
- `PATCH /api/rider/orders/:id/status`
  - Update order status (requires rider authentication)
  - Request body: `{ status: "delivered" | "undelivered" }`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Models

### Product
- name
- description
- price
- category (fan/ac)
- variants (color, size, stock)
- images

### Order
- user
- items (product, color, size, quantity, price)
- totalAmount
- status (pending/paid/shipped/delivered/undelivered)
- shippingAddress
- rider
- createdAt
- updatedAt

### User
- googleId
- email
- name
- role (user/admin/rider)
- isApproved
- createdAt 
>>>>>>> 1225ead (Initial commit: Backend setup for e-commerce platform)
