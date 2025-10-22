# Frailty Detection Web Application

A comprehensive web application for healthcare professionals to assess patient frailty using machine learning predictions. Built with React frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

- **Doctor Authentication**: Simple employee ID-based login system
- **Patient Data Management**: Upload and store comprehensive patient information
- **Frailty Prediction**: ML-based frailty assessment using patient health metrics
- **Search Functionality**: Search and retrieve patient records
- **Recent Patients**: Quick access to recently uploaded patient data
- **Responsive Design**: Mobile-friendly interface

## 🛠 Tech Stack

**Frontend:**
- React.js
- Axios for API calls
- CSS3 for styling
- React Router for navigation

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file uploads
- CORS for cross-origin requests

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## 🔧 Installation & Setup

### Phase 1: Project Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frailty-detection-webapp
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm init -y
   npm install express mongoose cors dotenv multer
   npm install -D nodemon
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npx create-react-app .
   npm install axios react-router-dom
   ```

### Phase 2: Environment Configuration

4. **Create Environment Variables**
   Create `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/frailty_detection
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

### Phase 3: Database Setup

5. **Start MongoDB**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Update connection string in `.env`

### Phase 4: Run the Application

6. **Start Backend Server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start Frontend Development Server**
   ```bash
   cd client
   npm start
   ```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
frailty-detection-webapp/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS files
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── package.json
└── README.md
```

## 🔄 Development Phases

### Phase 1: Backend Foundation (Days 1-2)
- [x] Setup Express server
- [x] Configure MongoDB connection
- [x] Create data models (Doctor, Patient)
- [x] Implement basic API routes

### Phase 2: Authentication & Core APIs (Days 3-4)
- [x] Doctor authentication system
- [x] Patient CRUD operations
- [x] Search functionality
- [x] File upload handling

### Phase 3: Frontend Foundation (Days 5-6)
- [x] React app setup
- [x] Component structure
- [x] Routing configuration
- [x] API service integration

### Phase 4: UI Components (Days 7-8)
- [x] Doctor login component
- [x] Dashboard layout
- [x] Patient upload form
- [x] Search interface

### Phase 5: Advanced Features (Days 9-10)
- [x] Frailty prediction integration
- [x] Recent patients display
- [x] Data visualization
- [x] Error handling

### Phase 6: Polish & Testing (Days 11-12)
- [ ] UI/UX improvements
- [ ] Testing implementation
- [ ] Performance optimization
- [ ] Documentation completion

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - Doctor login
- `GET /api/auth/verify` - Verify doctor session

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/search` - Search patients
- `GET /api/patients/recent/:doctorId` - Get recent patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

## 🎯 Usage Guide

1. **Doctor Login**: Enter employee ID to access the system
2. **Add Patient**: Fill out the comprehensive patient form with health metrics
3. **View Predictions**: System automatically calculates frailty risk
4. **Search Patients**: Use search functionality to find existing patients
5. **Recent Activity**: View recently added patients on dashboard

## 🔮 Future Enhancements

- [ ] Advanced ML model integration
- [ ] Data export functionality
- [ ] Patient history tracking
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact [your-email@domain.com]