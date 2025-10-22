# Frailty Detection - Frontend

This is the frontend application for the Frailty Detection Web Application, built with React.js.

## 🚀 Features

- **Doctor Authentication**: Simple employee ID-based login system
- **Patient Management**: Complete CRUD operations for patient records
- **Frailty Risk Assessment**: Real-time ML-based frailty predictions
- **Search Functionality**: Quick patient search and filtering
- **Responsive Design**: Mobile-friendly interface
- **Dashboard**: Overview with statistics and recent patients

## 🛠 Tech Stack

- **React 18.2.0**: UI library
- **React Router 6.8.0**: Client-side routing
- **Axios 1.3.0**: HTTP client for API calls
- **React Scripts 5.0.1**: Build tools and development server

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on `http://localhost:5000`

## 🔧 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file (optional)**
   Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm start
```
The app will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.js            # Login component
│   │   ├── common/
│   │   │   ├── Loading.js          # Loading spinner
│   │   │   ├── Loading.css
│   │   │   └── ErrorMessage.js     # Error display
│   │   ├── dashboard/
│   │   │   ├── Dashboard.js        # Main dashboard
│   │   │   └── RecentPatients.js   # Recent patients list
│   │   ├── layout/
│   │   │   ├── Header.js           # App header/navbar
│   │   │   ├── Header.css
│   │   │   ├── Footer.js           # App footer
│   │   │   ├── Footer.css
│   │   │   ├── Sidebar.js          # Sidebar navigation
│   │   │   └── Sidebar.css
│   │   └── patients/
│   │       ├── PatientForm.js      # Add/Edit patient form
│   │       ├── PatientList.js      # List all patients
│   │       ├── PatientDetails.js   # Patient detail view
│   │       └── PatientSearch.js    # Search component
│   ├── context/
│   │   └── AuthContext.js          # Authentication context
│   ├── services/
│   │   ├── api.js                  # Axios configuration
│   │   ├── authService.js          # Auth API calls
│   │   └── patientService.js       # Patient API calls
│   ├── styles/
│   │   ├── App.css                 # Global app styles
│   │   ├── Dashboard.css           # Dashboard styles
│   │   ├── Header.css              # Header styles
│   │   ├── Login.css               # Login styles
│   │   ├── PatientDetails.css      # Patient details styles
│   │   ├── PatientForm.css         # Patient form styles
│   │   ├── PatientList.css         # Patient list styles
│   │   └── global.css              # Global variables
│   ├── utils/
│   │   ├── constants.js            # App constants
│   │   ├── helpers.js              # Helper functions
│   │   └── validation.js           # Form validation
│   ├── App.js                      # Main app component
│   └── index.js                    # Entry point
├── package.json
└── README.md
```

## 🔌 API Integration

The frontend connects to the backend API through the proxy configuration in `package.json`:
```json
"proxy": "http://localhost:5000"
```

### API Endpoints Used:
- `POST /api/auth/login` - Doctor authentication
- `GET /api/auth/verify` - Token verification
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search?q=term` - Search patients
- `GET /api/patients/recent/:doctorId` - Get recent patients
- `GET /api/patients/stats/:doctorId` - Get dashboard statistics

## 🎨 Components Overview

### Authentication
- **Login**: Employee ID-based authentication with error handling

### Dashboard
- **Dashboard**: Overview with statistics cards, search, and recent patients
- **RecentPatients**: Displays recently added patients with frailty risk levels

### Patient Management
- **PatientForm**: Comprehensive form for adding/editing patient data with:
  - Basic information (name, age, gender)
  - Physical measurements (height, weight)
  - Vital signs (BP, heart rate, respiratory rate, temperature)
  - Health history
  - Lifestyle factors
  - Functional assessment
- **PatientList**: Grid view of all patients with action buttons
- **PatientDetails**: Detailed view of patient information and frailty assessment
- **PatientSearch**: Real-time search functionality

### Layout
- **Header**: Navigation bar with branding, menu links, and logout
- **Footer**: App footer with copyright information
- **Sidebar**: Side navigation menu (alternative layout option)

### Common Components
- **Loading**: Animated loading spinner
- **ErrorMessage**: Error display component

## 🔐 Authentication Flow

1. User enters Employee ID on login page
2. Frontend sends credentials to `/api/auth/login`
3. On success, token is stored in localStorage
4. Token is included in all subsequent API requests via Axios interceptor
5. Protected routes check authentication status via AuthContext
6. Automatic logout on 401 responses

## 🎯 Key Features Implementation

### Frailty Risk Assessment
- Patient data is sent to backend for ML prediction
- Results display risk level (Low/Medium/High) with confidence score
- Color-coded badges for quick visual assessment

### Protected Routes
- All patient-related routes require authentication
- Automatic redirect to login if not authenticated
- Loading state while verifying authentication

### Error Handling
- Global error interceptor in Axios configuration
- Component-level error states and user feedback
- Graceful fallbacks for missing data

## 🔄 State Management

- **AuthContext**: Global authentication state
  - `isAuthenticated`: Boolean authentication status
  - `doctor`: Current doctor information
  - `login()`: Login function
  - `logout()`: Logout function
  - `loading`: Initial auth check loading state

## 🎨 Styling

The application uses CSS modules and custom stylesheets:
- Consistent color scheme with CSS variables
- Responsive design with flexbox and grid
- Mobile-first approach
- Reusable utility classes

## 🚀 Deployment

### Build the application
```bash
npm run build
```

### Serve the build
The `build` folder can be served using any static file server:
```bash
npx serve -s build
```

Or deploy to platforms like:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## 🐛 Troubleshooting

### Proxy Issues
If API calls are failing, ensure:
1. Backend server is running on `http://localhost:5000`
2. CORS is properly configured in backend
3. Proxy configuration is correct in `package.json`

### Authentication Issues
- Clear localStorage if experiencing auth problems
- Check token in localStorage: `localStorage.getItem('token')`
- Verify token on backend

### Build Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📝 Environment Variables

Optional environment variables for customization:

```env
# API URL (defaults to proxy if not set)
REACT_APP_API_URL=http://localhost:5000/api

# Other configurations
REACT_APP_ENV=development
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the Frailty Detection Web Application system.

## 📞 Support

For issues or questions, please refer to the main project documentation or contact the development team.
