# OYF Mini Billing API

A comprehensive RESTful API for managing bills with JWT authentication, built for the OYF technical assessment.

## Features

- **JWT Authentication** - Secure token-based authentication with 15-minute expiry
- **Bills CRUD Operations** - Create, Read, Update, Delete bills with validation
- **Email Notifications** - HTML email notifications using Nodemailer and Handlebars templates
- **Filtering & Pagination** - Query bills by category, status, due date with pagination support
- **Docker Support** - Fully containerized with Docker and Docker Compose
- **Input Validation** - Request validation using fastest-validator
- **MySQL Database** - Sequelize ORM with MySQL 8.0
- **Error Handling** - Centralized error handling with proper HTTP status codes

## Tech Stack

- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Database:** MySQL 8.0
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** fastest-validator
- **Email:** Nodemailer with Handlebars templates
- **Containerization:** Docker & Docker Compose

## Prerequisites

- Node.js 18+ and npm
- MySQL 8.0
- Docker and Docker Compose (for containerized deployment)
- Gmail account with App Password (for email notifications)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd oyf-mini-billing-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=oyf_billing
DB_USER=root
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=15m

# Email Configuration (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=noreply@oyfbilling.com

# Additional Email Config
NODE_MAILER_EMAIL=your_email@gmail.com
NODE_MAILER_EMAIL_PASSWORD=your_gmail_app_password
NODE_MAILER_PORT=587

# Mock Email (set to false to send real emails)
MOCK_EMAIL=true
```

### 4. Database Setup

Create the MySQL database:

```bash
mysql -u root -p
CREATE DATABASE oyf_billing;
exit;
```

Run migrations:

```bash
npm run db:migrate
```

Seed demo users:

```bash
npm run db:seed
```

**Demo Users:**

- Email: `demo@example.com` | Password: `password123`
- Email: `admin@oyfbilling.com` | Password: `password123`

### 5. Start the Server

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The API will be available at `http://localhost:3000`

## Docker Deployment

### Using Docker Compose

```bash
# Build and start containers
docker-compose up --build -d

# View logs
docker-compose logs -f api

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

The API will be available at `http://localhost:3000`
MySQL will be available at `localhost:3307`

### Run Migrations in Docker

```bash
docker exec oyf_billing_api npx sequelize-cli db:migrate
docker exec oyf_billing_api npx sequelize-cli db:seed:all
```

## Database backup & Disaster recovery

### Backup strategy

- Primary AWS RDS
- AWS provides enterprise grade automated backups.

### How it will works

- Amazon RDS automatically takes snapshots of the entire database by default at specific retention period, this will give us the ability to perform a point in time recovery.
- The automated backups will be stored in an amazon S3 bucket with retention period of about 1 to 30 days.
- Enabling the multiple - AZ option, we will ensure that we have a replica that will always be on standby.
- Data will synchronously be replicated to the standby replica, keeping it upto date with the primary database. In case of any failure, RDS will automatically redirect our database traffic to the standby instance, minimizing downtown time to just a few minutes

## API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

All bill endpoints require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Health Check

**GET** `/health`

Response:

```json
{
  "success": true,
  "message": "Server is running",
  "uptime": 123.45,
  "timestamp": "2026-01-02T00:00:00.000Z"
}
```

#### Database Health Check

**GET** `/health/test-db`

Response:

```json
{
  "success": true,
  "message": "Database connection successful"
}
```

#### Login

**POST** `/api/v1/auth/login`

Request:

```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "demo@example.com",
      "name": "Demo User"
    }
  }
}
```

#### Create Bill

**POST** `/api/v1/bills`

Request:

```json
{
  "name": "Electric Bill",
  "amount": 150.5,
  "due_date": "2026-01-15",
  "category": "Utilities",
  "status": "pending"
}
```

Response:

```json
{
  "success": true,
  "message": "Bill created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "Electric Bill",
    "amount": 150.5,
    "due_date": "2026-01-15",
    "category": "Utilities",
    "status": "pending",
    "createdAt": "2026-01-02T00:00:00.000Z",
    "updatedAt": "2026-01-02T00:00:00.000Z"
  }
}
```

**Note:** An email notification will be sent automatically when a bill is created.

#### Get Bills (with filtering)

**GET** `/api/v1/bills?category=Utilities&status=pending&dueBefore=2026-02-01&page=1&limit=10`

Query Parameters:

- `category` (optional): Filter by category
- `status` (optional): Filter by status (pending, paid, overdue, cancelled)
- `dueBefore` (optional): Filter bills due before this date (YYYY-MM-DD)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

Response:

```json
{
  "success": true,
  "message": "Bills retrieved successfully",
  "data": {
    "bills": [
      {
        "id": 1,
        "user_id": 1,
        "name": "Electric Bill",
        "amount": "150.50000",
        "due_date": "2026-01-15",
        "category": "Utilities",
        "status": "pending",
        "createdAt": "2026-01-02T00:00:00.000Z",
        "updatedAt": "2026-01-02T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

#### Update Bill

**PATCH** `/api/v1/bills/:id`

Request:

```json
{
  "name": "Updated Electric Bill",
  "amount": 175.0,
  "status": "paid"
}
```

Response:

```json
{
  "success": true,
  "message": "Bill updated successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "Updated Electric Bill",
    "amount": "175.00000",
    "due_date": "2026-01-15",
    "category": "Utilities",
    "status": "paid",
    "createdAt": "2026-01-02T00:00:00.000Z",
    "updatedAt": "2026-01-02T05:00:00.000Z"
  }
}
```

#### Delete Bill

**DELETE** `/api/v1/bills/:id`

Response:

```json
{
  "success": true,
  "message": "Bill deleted successfully"
}
```

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'

# Create Bill (replace <TOKEN> with actual token)
curl -X POST http://localhost:3000/api/v1/bills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name":"Internet Bill",
    "amount":89.99,
    "due_date":"2026-01-20",
    "category":"Utilities",
    "status":"pending"
  }'

# Get Bills
curl -X GET "http://localhost:3000/api/v1/bills?category=Utilities" \
  -H "Authorization: Bearer <TOKEN>"

# Update Bill
curl -X PATCH http://localhost:3000/api/v1/bills/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"status":"paid"}'

# Delete Bill
curl -X DELETE http://localhost:3000/api/v1/bills/1 \
  -H "Authorization: Bearer <TOKEN>"
```

**Postman documentation:** - [Postman - collection](https://www.postman.com/martian-satellite-689890/oyf-mini-billing-api)

## Email Notifications

The API sends beautiful HTML email notifications when bills are created. The email includes:

- Bill name, amount, due date, category, and status
- Styled with colors and badges
- Responsive design
- Plain text fallback

3. Update `NODE_MAILER_EMAIL` and `NODE_MAILER_EMAIL_PASSWORD`

## Security Features

- JWT authentication with configurable expiration
- Password hashing with bcrypt (salt rounds: 10)
- Account lockout after 5 failed login attempts (15 minutes)
- Input validation on all endpoints
- SQL injection protection via Sequelize ORM
- CORS enabled for cross-origin requests

## Project Structure

```
oyf-mini-billing-api/
├── src/
│   ├── config/
│   │   ├── config.js              # Sequelize config
│   │   └── database.js            # Database connection
│   ├── controllers/
│   │   ├── auth.controller.js     # Authentication logic
│   │   ├── bill.controller.js     # Bills CRUD logic
│   │   └── health.controller.js   # Health check logic
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   ├── errorHandler.js        # Error handling
│   │   └── validation.js          # Request validation
│   ├── migrations/                # Database migrations
│   ├── models/
│   │   ├── index.js               # Models loader
│   │   ├── user.js                # User model
│   │   ├── bill.js                # Bill model
│   │   └── refreshtoken.js        # RefreshToken model
│   ├── routes/
│   │   ├── auth.js                # Auth routes
│   │   ├── bills.js               # Bills routes
│   │   └── health.js              # Health routes
│   ├── seeders/                   # Database seeders
│   ├── services/
│   │   └── email.service.js       # Email service
│   ├── templates/
│   │   └── emails/
│   │       └── bill-created.hbs   # Email template
│   └── validators/
│       └── bill.validator.js      # Bill validation schemas
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── .sequelizerc
├── docker-compose.yml
├── Dockerfile
├── index.js                       # Application entry point
├── package.json
└── README.md
```

## Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run db:migrate # Run database migrations
npm run db:seed    # Seed database with demo data
```

## License

This project is created for the OYF.

## Author

Bruno - OYF mini billings
