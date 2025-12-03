# University Department System - Frontend

A React-based frontend application for managing university departments and professors.

## Features

- View, create, edit, and delete departments
- View, create, edit, and delete professors
- View department details with associated professors
- Responsive design with clean UI
- Error handling and validation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Running Spring Boot backend on http://localhost:8080

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the backend Spring Boot application first (it should be running on port 8080)

2. Start the React development server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── department/
│   │   │   ├── DepartmentList.js
│   │   │   ├── DepartmentDetail.js
│   │   │   └── DepartmentForm.js
│   │   ├── professor/
│   │   │   ├── ProfessorList.js
│   │   │   ├── ProfessorDetail.js
│   │   │   └── ProfessorForm.js
│   │   └── Home.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## API Endpoints Used

### Departments
- GET `/api/departments` - Get all departments
- GET `/api/departments/{id}` - Get department by ID
- GET `/api/departments/{id}/professors` - Get department with professors
- POST `/api/departments` - Create new department
- PUT `/api/departments/{id}` - Update department
- DELETE `/api/departments/{id}` - Delete department

### Professors
- GET `/api/professors` - Get all professors
- GET `/api/professors/{id}` - Get professor by ID
- POST `/api/professors` - Create new professor
- PUT `/api/professors/{id}` - Update professor
- DELETE `/api/professors/{id}` - Delete professor

## Environment Variables

You can set the API base URL using environment variables:

```
REACT_APP_API_URL=http://localhost:8080/api
```

## Technologies Used

- React 18
- React Router DOM v6
- Axios for HTTP requests
- CSS3 for styling

## Notes

- The application uses a proxy configuration to route API requests to the backend
- CORS is configured in the backend to allow requests from localhost:3000
- All forms include validation for required fields
- Error messages are displayed for failed API calls
