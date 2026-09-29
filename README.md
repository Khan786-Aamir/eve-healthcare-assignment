# EVE Healthcare Diagnostic Booking System

An enterprise-grade Node.js backend service for diagnostic test bookings and simulated payments, built as part of the EVE Healthcare SDE Intern Assignment.

## Features & Architecture

This project is built using a clean, scalable, **Service-Oriented Architecture** with separated concerns:
- **Controllers** act strictly as request/response orchestrators.
- **Services** house all complex business logic, validations, and database interactions.
- **Centralized Error Handling** using a custom `ApiError` utility and `catchAsync` wrapper.
- **API Versioning** (`/api/v1/`).
- **ES Modules** syntax for modern Node.js development.
- **Idempotent Webhooks** using MongoDB Sessions/Transactions to prevent duplicate payment processings.

---

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally or MongoDB Atlas)

---

## How to Run Locally

1. **Clone the repository and install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables:**
   A `.env.example` is provided. The `.env` file should look like this:
   \`\`\`env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/eve_healthcare
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=7d
   \`\`\`

3. **Start the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The server will run at `http://localhost:5000` (and `GET /api/v1/health` will return a success message).

---

## API Endpoints & Example Requests

### 1. Authentication (`/api/v1/auth`)

**POST `/signup`**
\`\`\`json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
\`\`\`

**POST `/login`**
\`\`\`json
// Request
{
  "email": "john@example.com",
  "password": "securepassword123"
}
// Returns an accessToken in JSON and via HttpOnly cookie.
\`\`\`

### 2. Diagnostic Centres & Tests (`/api/v1/centres`, `/api/v1/tests`)

**POST `/centres`** (Create Centre)
\`\`\`json
{
  "name": "EVE Main Lab",
  "location": "New York"
}
\`\`\`

**POST `/tests`** (Create Test)
\`\`\`json
{
  "name": "Complete Blood Count",
  "price": 150.00,
  "centreId": "<CENTRE_OBJECT_ID>"
}
\`\`\`

**GET `/centres`** (Get Centres with populated tests)

### 3. Bookings (`/api/v1/bookings`) - *Requires Auth Token*

**POST `/bookings`** (Create Booking)
\`\`\`json
{
  "testId": "<TEST_OBJECT_ID>",
  "centreId": "<CENTRE_OBJECT_ID>",
  "appointmentDate": "2026-10-01T10:00:00.000Z"
}
// The amount is automatically calculated by the service layer.
\`\`\`

**GET `/bookings`** (View My Bookings)

### 4. Payments (`/api/v1/payments`)

**POST `/payments`** (Simulate Payment)
\`\`\`json
{
  "bookingId": "<BOOKING_OBJECT_ID>"
}
// Automatically returns randomly either SUCCESS or FAILED.
\`\`\`

**POST `/payments/webhook`** (Process Payment Status - Idempotent)
\`\`\`json
{
  "eventId": "evt_987654321",
  "bookingId": "<BOOKING_OBJECT_ID>",
  "status": "SUCCESS"
}
// Updates booking state. Prevents duplicate eventIds.
\`\`\`

---

## Database / Schema Design

- **User**: Stores patient details and hashed passwords.
- **Centre**: Diagnostic centre locations.
- **Test**: Specific diagnostic tests, holding a reference to the `Centre`.
- **Booking**: Holds references to `User`, `Test`, and `Centre`. Tracks appointment dates, computed `amount`, and `status` (PENDING, CONFIRMED, FAILED, CANCELLED).
- **Payment**: Tracks simulated transaction ID, status, and related `Booking`.
- **WebhookEvent**: Stores unique `eventId` from payment webhooks to enforce idempotency.

---

## Important Assumptions Made

1. **Test-Centre Relationship**: A diagnostic test belongs to a specific centre (One-to-Many). Prices can vary per centre.
2. **Payment Simulation**: The `/payments` endpoint simulates a transaction using `Math.random()` and returns immediately. In a real system, the client would use a payment SDK, and this backend would merely listen to the `/webhook`.
3. **Webhook Idempotency**: Handled using a dedicated `WebhookEvent` collection and MongoDB transactions to guarantee that race conditions do not process the same webhook event twice.
4. **Amount Calculation**: Users do not send the `amount` in the booking request to prevent price tampering. The service layer computes it dynamically based on the selected `Test`.

---

## What I Would Improve With More Time

1. **Pagination & Filtering**: Implement pagination (e.g., `?page=1&limit=10`) and location-based filtering for Centres and Tests APIs.
2. **Automated Testing**: Add unit and integration tests using Jest and Supertest.
3. **Dockerization**: Create a `Dockerfile` and `docker-compose.yml` to spin up the Node server and MongoDB simultaneously.
4. **Caching**: Integrate Redis to cache frequently accessed data, like the list of diagnostic centres.
5. **Swagger Documentation**: Provide a fully interactive OpenAPI/Swagger UI at `/api/docs`.
