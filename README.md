# Service Booking Platform API (`booking_apis`)

This is the backend service for the Service Booking Platform, built with Node.js, Express, and MySQL. It follows a **Modular Monolith** pattern using **Clean Layered Architecture** to ensure maintainability and scalability.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL (v9.3+)

### Setup
1. Clone the repository and navigate to `booking_apis`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your MySQL credentials and JWT secrets.
5. Run the database setup script located at the project root:
   ```bash
   mysql -u root -p < ../setup_database.sql
   ```

### Running the Server
- **Development**: `npm run dev` (starts the server at http://localhost:5000 with nodemon)
- **Production**: `npm start`

### 📚 API Documentation (Interactive)
- **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## 🏗️ Architecture: Clean Modular Monolith
We use a layered approach to separate core business logic from external frameworks:
- `src/entities`: Core data structures and domain models.
- `src/use-cases`: Pure business logic (the "what" the system does).
- `src/data-access`: Database persistence layer (MySQL repositories).
- `src/controllers`: Request parsing and response formatting.
- `src/routes`: Express endpoint definitions.
- `src/middlewares`: Security (JWT/RBAC), Validation (Joi), and Global Error Handling.

## 🛡️ Security & Performance
- **Secure Auth**: Short-lived Access Tokens and long-lived Refresh Tokens.
- **Encrypted Storage**: Bcrypt (rounds: 12) for password hashing. **Important**: Hashes are automatically stripped from all API responses to prevent leakage.
- **RBAC**: Middleware to restrict routes based on entity roles (Admin, Staff, User).
- **Validation**: Strict schema validation on all POST/PUT requests.
- **Performance**: Pagination implemented on high-volume endpoints like `GET /services`.

## 📚 API Endpoints Summary (v1)

### Auth (`/api/v1/auth`)
- `POST /register`: Customer registration.
- `POST /login`: Unified login for all roles.
- `POST /refresh`: Renew access tokens.
- `GET /me`: Authenticated profile details.
- `PATCH /me`: Update personal profile (User/Staff/Admin).

### Services (`/api/v1/services`)
- `GET /categories`: List all service categories.
- `GET /`: List services (Supports filtering by category/price and pagination).
- `POST /`: Create service (Restricted to Admin/Staff).
- `PUT /:id`: Update service (Restricted to Admin/Staff).
- `DELETE /:id`: Delete service (Admin only).

### Time Slots (`/api/v1/timeslots`)
- `GET /?service_id=X`: Browse available time slots (public). Filter by service_id to see slots for a specific service.
- `POST /`: Create a new time slot for a service (Admin/Staff only).
- `PATCH /:id`: Toggle slot availability — available/unavailable (Admin/Staff only).
- `DELETE /:id`: Delete a time slot (Admin only — blocked if there is an active booking).

### Bookings (`/api/v1/bookings`)
- `POST /`: Book a service (User only).
- `GET /my`: View user's personal bookings.
- `GET /`: View all bookings (Admin/Staff only).
- `PATCH /:id/status`: Update booking workflow state.
- `PATCH /:id/reschedule`: Change booking time (User only).
- `POST /:id/assign`: Assign staff to a booking (Admin only).

### Staff (`/api/v1/staff`)
- `GET /`: List all staff members (Admin/Staff only).
- `POST /`: Create new staff member (Admin only).
- `DELETE /:id`: Remove staff member (Admin only).

### Reviews (`/api/v1/reviews`)
- `POST /service`: Customer feedback.
- `POST /user`: Staff member feedback on a client interaction.

## 📄 License
ISC