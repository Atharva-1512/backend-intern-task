# Backend Intern Task API





Production-style REST API backend for managing users, projects, and daily progress reports in a construction or operations workflow. The service uses JWT authentication, role-based authorization, MySQL, and Sequelize in a clean MVC layout.

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT authentication
- bcryptjs password hashing
- dotenv
- cors

## Project Structure

```text
backend-intern-task/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── dprController.js
│   └── projectController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── roleMiddleware.js
├── models/
│   ├── dailyReport.js
│   ├── project.js
│   └── user.js
├── routes/
│   ├── authRoutes.js
│   ├── dprRoutes.js
│   └── projectRoutes.js
├── .env.example
├── package.json
├── README.md
├── schema.sql
└── server.js
```

## Features

- User registration and login with JWT
- Password hashing with bcryptjs
- Role-based access control for admin, manager, and worker
- CRUD operations for projects
- Daily progress report creation and listing per project
- Pagination and status filtering on project listing
- Centralized error handling
- Sequelize associations between users, projects, and reports

## Database Setup

1. Create the database and tables:

```sql
SOURCE schema.sql;
```

2. Or run the SQL statements manually in MySQL.

## Environment Variables

Create a `.env` file based on `.env.example`.

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=backend_intern_task
JWT_SECRET=your_super_secret_jwt_key
```

## Installation

```bash
npm install
```

## Running the Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Health check:

```http
GET /health
```

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Projects

- `POST /projects`
- `GET /projects`
- `GET /projects/:id`
- `PUT /projects/:id`
- `DELETE /projects/:id`

### Daily Progress Reports

- `POST /projects/:id/dpr`
- `GET /projects/:id/dpr`

## Example Requests

Register:

```bash
curl --request POST http://localhost:5000/auth/register \
  --header "Content-Type: application/json" \
  --data "{\"name\":\"Admin User\",\"email\":\"admin@example.com\",\"password\":\"password123\",\"role\":\"admin\"}"
```

Login:

```bash
curl --request POST http://localhost:5000/auth/login \
  --header "Content-Type: application/json" \
  --data "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"
```

Create project:

```bash
curl --request POST http://localhost:5000/projects \
  --header "Authorization: Bearer YOUR_JWT_TOKEN" \
  --header "Content-Type: application/json" \
  --data "{\"name\":\"Metro Line Phase 1\",\"description\":\"Underground utility and track work.\",\"startDate\":\"2026-03-01\",\"endDate\":\"2026-09-30\",\"status\":\"active\"}"
```

List projects with pagination:

```bash
curl --request GET "http://localhost:5000/projects?status=active&limit=5&offset=0" \
  --header "Authorization: Bearer YOUR_JWT_TOKEN"
```

Create daily progress report:

```bash
curl --request POST http://localhost:5000/projects/1/dpr \
  --header "Authorization: Bearer YOUR_JWT_TOKEN" \
  --header "Content-Type: application/json" \
  --data "{\"date\":\"2026-03-12\",\"work_description\":\"Completed foundation excavation and debris removal.\",\"weather\":\"Sunny\",\"worker_count\":18}"
```

Get project DPRs for a specific date:

```bash
curl --request GET "http://localhost:5000/projects/1/dpr?date=2026-03-12" \
  --header "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Notes

- `POST /projects` and `PUT /projects/:id` are restricted to `admin` and `manager`.
- `DELETE /projects/:id` is restricted to `admin`.
- Passwords are never stored directly; only `password_hash` is persisted.
- `sequelize.sync()` is enabled in `server.js` for convenience, but `schema.sql` should remain the source of truth for controlled deployments.

## MVC Explanation

- `config/` contains database initialization.
- `models/` define Sequelize entities and schema mapping.
- `controllers/` contain request handling and business logic.
- `routes/` declare endpoint wiring.
- `middleware/` centralizes authentication, authorization, and error handling.
