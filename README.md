# Task Management Application

A full-stack task management application built with React.js frontend and Node.js backend, featuring user authentication, CRUD operations, file upload/export, and modern responsive design.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based login and registration
- **Task CRUD Operations**: Create, read, update, and delete tasks
- **Task Properties**: Title, description, effort estimation (days), due dates, and status tracking
- **Excel Export**: Download all tasks in Excel format
- **Bulk Import**: Upload multiple tasks via CSV/Excel files
- **Advanced Filtering**: Search, filter by status, and sort tasks
- **Responsive Design**: Works seamlessly on all devices

### Technical Features
- **Secure API**: JWT authentication with password hashing
- **File Processing**: Support for CSV and Excel file formats
- **Data Validation**: Comprehensive input validation on both frontend and backend
- **Error Handling**: Graceful error handling with user-friendly messages
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MySQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **ExcelJS** for Excel operations
- **Multer** for file uploads
- **express-validator** for input validation

### Frontend
- **React.js 18** with hooks
- **React Router DOM** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📁 Project Structure

```
task-management-app/
├── backend/                    # Node.js API server
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── tasks.js           # Task management routes
│   ├── uploads/               # Temporary file uploads
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── server.js              # Main server file
│   └── README.md
├── frontend/                   # React.js application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v8 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create MySQL database
mysql -u root -p
CREATE DATABASE task_management;
exit

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will open in your browser at `http://localhost:3000`

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
NODE_ENV=development
```

### Frontend Environment Variables (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

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

## 🔑 API Endpoints

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
- `POST /api/tasks/bulk-upload` - Bulk upload tasks

### Health Check
- `GET /api/health` - API health status

## 📋 Usage Guide

### 1. User Registration & Login
1. Open the application at `http://localhost:3000`
2. Click "Create a new account" to register
3. Fill in username, email, and password
4. After registration, you'll be automatically logged in

### 2. Creating Tasks
1. Click the "New Task" button
2. Fill in the task details:
   - **Title**: Required task name
   - **Description**: Optional task details
   - **Effort (Days)**: Number of days needed
   - **Due Date**: Task deadline
3. Click "Create Task"

### 3. Managing Tasks
- **Edit**: Click the edit icon on any task card
- **Delete**: Click the delete icon and confirm
- **Filter**: Use the search bar and status filters
- **Sort**: Choose sorting options from the dropdown

### 4. Bulk Upload Tasks
1. Click "Bulk Upload" button
2. Download the sample template (optional)
3. Prepare your CSV/Excel file with columns:
   - `title` (required)
   - `description` (optional)
   - `effort_days` (required, number)
   - `due_date` (required, YYYY-MM-DD format)
4. Drag and drop your file or click to browse
5. Click "Upload Tasks"

### 5. Export Tasks
1. Click "Export Excel" button
2. Your browser will download an Excel file with all your tasks

## 🔧 Development

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📝 File Upload Format

### CSV Example
```csv
title,description,effort_days,due_date
"Complete Project Report","Write and submit the quarterly project report",3,"2024-12-31"
"Code Review","Review pull requests from team members",1,"2024-12-28"
"Team Meeting","Attend weekly team standup meeting",1,"2024-12-27"
```

### Excel Format
Create an Excel file with the following columns:
- **Title** (Column A) - Required
- **Description** (Column B) - Optional
- **Effort (Days)** (Column C) - Required, numeric value
- **Due Date** (Column D) - Required, date format (YYYY-MM-DD)

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Solution: Check MySQL is running and credentials in .env are correct
   ```

2. **CORS Error**
   ```
   Solution: Ensure backend is running on port 5000 and frontend on port 3000
   ```

3. **File Upload Error**
   ```
   Solution: Check file format (CSV/Excel only) and ensure proper column headers
   ```

4. **JWT Token Error**
   ```
   Solution: Clear localStorage in browser and login again
   ```

### Debug Commands

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check database connection
mysql -u root -p -e "USE task_management; SHOW TABLES;"

# Clear React cache
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **File Upload Security**: Type and size validation

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)
4. Set up SSL certificate

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, S3)
3. Configure environment variables for production API

### Docker Deployment (Optional)

```bash
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

# Frontend Dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Express.js for the robust backend framework
- Tailwind CSS for the beautiful styling system
- All the open-source contributors who made this possible

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Include error logs and steps to reproduce

---

**Happy Task Managing! 🎯**