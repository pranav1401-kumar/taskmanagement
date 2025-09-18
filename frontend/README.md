# Task Management Frontend

A modern, responsive React.js frontend for the Task Management application with user authentication, task CRUD operations, and file upload/export capabilities.

## Features

- **User Authentication**: JWT-based login and registration
- **Task Management**: Create, read, update, and delete tasks
- **Advanced Filtering**: Search, filter by status, and sort tasks
- **Bulk Operations**: Upload tasks via CSV/Excel files
- **Export Functionality**: Download tasks as Excel files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Feedback**: Toast notifications for all actions
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## Tech Stack

- **React.js 18** with functional components and hooks
- **React Router DOM** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BulkUpload.js       # File upload component
│   │   ├── Header.js           # Navigation header
│   │   ├── Login.js            # Login form
│   │   ├── ProtectedRoute.js   # Route protection
│   │   ├── Register.js         # Registration form
│   │   ├── TaskCard.js         # Individual task display
│   │   └── TaskForm.js         # Task creation/editing form
│   ├── contexts/
│   │   └── AuthContext.js      # Authentication context
│   ├── pages/
│   │   └── Tasks.js            # Main tasks page
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.js                  # Main app component
│   ├── index.js                # App entry point
│   └── index.css               # Global styles
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 5000

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

If not specified, the app defaults to `http://localhost:5000/api`.

### 3. Start Development Server

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Key Components

### Authentication System

- **AuthContext**: Manages user authentication state globally
- **ProtectedRoute**: Ensures only authenticated users can access protected pages
- **Login/Register**: Beautiful forms with validation and error handling

### Task Management

- **Tasks Page**: Main dashboard with task listing, filtering, and actions
- **TaskCard**: Individual task display with status indicators and actions
- **TaskForm**: Modal form for creating and editing tasks

### File Operations

- **BulkUpload**: Drag-and-drop file upload with template download
- **Export**: One-click Excel export functionality

## Features in Detail

### User Authentication
- JWT token-based authentication
- Automatic token refresh handling
- Secure logout with token cleanup
- Form validation with real-time error display

### Task Management
- **Create Tasks**: Title, description, effort estimation, and due dates
- **Edit Tasks**: Inline editing with status updates
- **Delete Tasks**: Confirmation dialog for safety
- **Status Tracking**: Pending, In Progress, Completed states

### Advanced Filtering & Search
- **Text Search**: Search by title and description
- **Status Filter**: Filter by task status with counts
- **Sorting**: Sort by date, title, effort, or status
- **Real-time Updates**: Filters apply instantly

### Bulk Operations
- **File Upload**: Support for CSV and Excel files
- **Template Download**: Sample file for proper formatting
- **Error Handling**: Detailed feedback for failed imports
- **Drag & Drop**: Intuitive file upload interface

### Export Features
- **Excel Export**: Download all tasks in Excel format
- **Formatted Output**: Professional spreadsheet with headers
- **Date Stamped**: Automatic filename with current date

## API Integration

The frontend communicates with the backend through a centralized API service:

```javascript
// Example API calls
const tasks = await taskAPI.getTasks();
const newTask = await taskAPI.createTask(taskData);
const blob = await taskAPI.exportTasks();
const result = await taskAPI.bulkUpload(file);
```

### Authentication Flow
1. User enters credentials
2. Frontend sends login request to backend
3. Backend returns JWT token
4. Token stored in localStorage
5. Token included in all subsequent API requests
6. Automatic redirect on token expiration

## Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured interface with multi-column layouts
- **Tablet**: Adapted layouts with touch-friendly interactions
- **Mobile**: Single-column layouts with collapsible elements

## Error Handling

- **Network Errors**: Graceful handling of connection issues
- **Validation Errors**: Real-time form validation with helpful messages
- **API Errors**: User-friendly error messages for all API failures
- **File Upload Errors**: Detailed feedback for file format and content issues

## Performance Features

- **Lazy Loading**: Components loaded on demand
- **Optimized Re-renders**: React.memo and useCallback optimization
- **Efficient Filtering**: Client-side filtering for instant results
- **Minimal API Calls**: Smart caching and state management

## Security Features

- **XSS Protection**: All user inputs properly sanitized
- **CSRF Protection**: Token-based authentication prevents CSRF
- **Input Validation**: Both client and server-side validation
- **Secure Storage**: Tokens stored securely in localStorage

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

### Component Structure
- Use functional components with hooks
- Implement proper prop validation
- Follow React best practices for performance
- Maintain consistent naming conventions

### Styling Guidelines
- Use Tailwind utility classes
- Maintain consistent spacing and colors
- Implement responsive design patterns
- Follow accessibility best practices

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Environment Variables

For production deployment, set:

```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Hosting Options

The built files can be hosted on:
- **Vercel**: Zero-config deployment
- **Netlify**: Git-based deployment
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repositories

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend server is running
   - Verify API URL in environment variables
   - Check CORS configuration on backend

2. **Authentication Issues**
   - Clear localStorage and refresh
   - Check JWT token expiration
   - Verify backend authentication middleware

3. **File Upload Problems**
   - Check file format (CSV/Excel only)
   - Verify file size limits
   - Ensure proper column headers

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check for version compatibility issues
   - Update dependencies if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.