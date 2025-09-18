# Task Management Backend API

A robust Node.js REST API for task management with user authentication, CRUD operations, and file import/export capabilities.

## Features

- **User Authentication**: JWT-based registration and login
- **Task CRUD Operations**: Create, read, update, and delete tasks
- **Excel Export**: Export user tasks to Excel format
- **Bulk Import**: Upload tasks via CSV/Excel files
- **Data Validation**: Comprehensive input validation
- **MySQL Integration**: Persistent data storage

## Tech Stack

- **Node.js** & **Express.js**
- **MySQL** database with **mysql2** driver
- **JWT** for authentication
- **bcryptjs** for password hashing
- **ExcelJS** for Excel file operations
- **Multer** for file uploads
- **express-validator** for input validation

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   └── tasks.js             # Task management routes
├── uploads/                 # Temporary file uploads
├── .env                     # Environment variables
├── package.json
├── server.js                # Main server file
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE task_management;
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
NODE_ENV=development
```

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000` and automatically create necessary database tables.

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Tasks

- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/export/excel` - Export tasks to Excel
- `POST /api/tasks/bulk-upload` - Bulk upload tasks from CSV/Excel

### Health Check

- `GET /api/health` - API health status

## API Usage Examples

### User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### Create Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete Project",
    "description": "Finish the task management application",
    "effort_days": 5,
    "due_date": "2024-12-31"
  }'
```

### Export Tasks to Excel

```bash
curl -X GET http://localhost:5000/api/tasks/export/excel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output tasks.xlsx
```

### Bulk Upload Tasks

```bash
curl -X POST http://localhost:5000/api/tasks/bulk-upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@tasks.csv"
```

## File Upload Formats

### CSV Format
```csv
title,description,effort_days,due_date
"Complete Project","Finish the task management application",5,"2024-12-31"
"Review Code","Review pull requests",2,"2024-12-25"
"Write Tests","Write unit tests for API",3,"2024-12-28"
```

### Excel Format
Excel files should have the following columns in the first row:
- **Title** (required)
- **Description** (optional)
- **Effort (Days)** (required, number)
- **Due Date** (required, date format)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    effort_days INT NOT NULL DEFAULT 1,
    due_date DATE NOT NULL,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated using express-validator
- **File Type Validation**: Only CSV and Excel files are accepted for uploads
- **User Isolation**: Users can only access their own tasks

## Error Handling

The API returns standardized error responses:

```json
{
  "message": "Error description",
  "errors": ["Detailed error messages array (for validation errors)"]
}
```

## Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon

### Adding New Features

1. Create new route files in `/routes`
2. Add middleware in `/middleware`
3. Update database schema in `/config/database.js`
4. Add validation rules using express-validator

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=task_management
JWT_SECRET=your_very_secure_production_jwt_secret
```

### Docker Support (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **File Upload Issues**
   - Check file format (CSV/Excel only)
   - Verify file size limits
   - Ensure proper column headers

3. **JWT Token Errors**
   - Check token is included in Authorization header
   - Verify JWT_SECRET is set correctly
   - Ensure token hasn't expired (24h default)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.