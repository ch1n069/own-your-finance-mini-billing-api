# OYF Mini Billing API

A comprehensive RESTful API for managing bills with JWT authentication, built for the OYF technical assessment.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication with 15-minute expiry
- **Bills CRUD Operations** - Create, Read, Update, Delete bills with validation
- **Email Notifications** - HTML email notifications using Nodemailer and Handlebars templates
- **Filtering & Pagination** - Query bills by category, status, due date with pagination support
- **Docker Support** - Fully containerized with Docker and Docker Compose
- **Input Validation** - Request validation using fastest-validator
- **MySQL Database** - Sequelize ORM with MySQL 8.0
- **Error Handling** - Centralized error handling with proper HTTP status codes

## 📋 Tech Stack

- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Database:** MySQL 8.0
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** fastest-validator
- **Email:** Nodemailer with Handlebars templates
- **Containerization:** Docker & Docker Compose

## 🛠️ Prerequisites

- Node.js 18+ and npm
- MySQL 8.0
- Docker and Docker Compose (for containerized deployment)
- Gmail account with App Password (for email notifications)

## ⚙️ Installation & Setup

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

## 🐳 Docker Deployment

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

## 📚 API Documentation

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

## 🧪 Testing the API

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

## 📧 Email Notifications

The API sends beautiful HTML email notifications when bills are created. The email includes:

- Bill name, amount, due date, category, and status
- Styled with colors and badges
- Responsive design
- Plain text fallback

To enable email notifications:

1. Set `MOCK_EMAIL=false` in `.env`
2. Configure your Gmail credentials with an App Password
3. Update `NODE_MAILER_EMAIL` and `NODE_MAILER_EMAIL_PASSWORD`

## 🔐 Security Features

- JWT authentication with configurable expiration
- Password hashing with bcrypt (salt rounds: 10)
- Account lockout after 5 failed login attempts (15 minutes)
- Input validation on all endpoints
- SQL injection protection via Sequelize ORM
- CORS enabled for cross-origin requests

## 📁 Project Structure

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

## 🚀 Deployment to Render

### Prerequisites

- GitHub repository
- Render account

### Steps

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Create MySQL Database on Render**

- Go to Render Dashboard
- Click "New +" → "PostgreSQL" or use external MySQL service
- Note the connection details

3. **Create Web Service on Render**

- Click "New +" → "Web Service"
- Connect your GitHub repository
- Configure:
  - **Name:** oyf-billing-api
  - **Environment:** Docker
  - **Region:** Choose nearest
  - **Branch:** main
  - **Build Command:** (leave empty for Docker)
  - **Start Command:** (leave empty for Docker)

4. **Add Environment Variables**
   Add these in Render's Environment section:

```
NODE_ENV=production
PORT=3000
DB_HOST=<your-mysql-host>
DB_PORT=3306
DB_NAME=oyf_billing
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
JWT_SECRET=<generate-secure-secret>
JWT_EXPIRES_IN=15m
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-app-password>
NODE_MAILER_EMAIL=<your-email>
NODE_MAILER_EMAIL_PASSWORD=<your-app-password>
NODE_MAILER_PORT=587
EMAIL_FROM=noreply@oyfbilling.com
MOCK_EMAIL=false
```

5. **Deploy**

- Click "Create Web Service"
- Wait for deployment to complete
- Run migrations via Render Shell or initial deployment script

## 📝 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run db:migrate # Run database migrations
npm run db:seed    # Seed database with demo data
```

## 🤝 Assessment Completion Checklist

- [x] Part A: Core API Features

  - [x] POST /auth/login - JWT authentication
  - [x] POST /bills - Create bill with validation
  - [x] GET /bills - List bills with filtering & pagination
  - [x] PATCH /bills/:id - Update bill
  - [x] DELETE /bills/:id - Delete bill
  - [x] Request validation
  - [x] Error handling

- [x] Part B: DevOps

  - [x] Dockerfile
  - [x] docker-compose.yml
  - [x] Public deployment ready

- [x] Part C: Third-Party Integration
  - [x] Email notification service (Nodemailer)
  - [x] HTML email templates (Handlebars)
  - [x] Automatic notifications on bill creation

## 📄 License

This project is created for the OYF technical assessment.

## 👨‍💻 Author

Bruno - OYF mini billingxs
