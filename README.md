# Frailty Detection Web Application

A comprehensive full-stack web application for healthcare professionals to assess patient frailty using machine learning predictions. Built with React frontend and Node.js/Express backend with MongoDB database.

## 🎯 Overview

This application enables doctors to:
- Manage patient records with comprehensive health data
- Get ML-based frailty risk assessments
- Track patient history and trends
- Search and filter patient records
- View dashboard statistics and insights

## 🏗️ Architecture

```
Frailty_Detection/
├── frontend/              # React.js frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context (Auth)
│   │   ├── services/      # API services
│   │   ├── styles/        # CSS stylesheets
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── Backend/               # Node.js/Express backend API
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utilities & ML predictor
│   └── package.json
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd Frailty_Detection
```

### 2. Setup Backend
```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

### 4. Seed Database (Optional)
```bash
cd Backend
node utils/seedDatabase.js
```

## 📋 Features

### ✅ Frontend Features
- **Authentication System**
  - Doctor login with employee ID
  - JWT token management
  - Protected routes
  - Auto-logout on session expiry

- **Dashboard**
  - Statistics overview (total, recent, high-risk patients)
  - Quick patient search
  - Recent patients list
  - Quick action buttons

- **Patient Management**
  - Add new patients with comprehensive forms
  - Edit existing patient records
  - View detailed patient information
  - Delete patients with confirmation
  - Search patients by name
  - Real-time frailty risk assessment

- **UI/UX**
  - Responsive design (mobile/tablet/desktop)
  - Color-coded risk indicators
  - Loading states
  - Error handling
  - Clean, professional medical interface

### ✅ Backend Features
- **RESTful API**
  - Complete CRUD for patients and doctors
  - JWT authentication
  - Input validation
  - Error handling

- **Database**
  - MongoDB with Mongoose ODM
  - Indexed queries for performance
  - Data relationships (Doctor → Patients)

- **ML Integration**
  - Rule-based frailty prediction
  - Multi-factor risk assessment
  - Confidence scoring
  - Ready for external ML API integration

- **Security**
  - Helmet security headers
  - CORS configuration
  - JWT token authentication
  - Input sanitization
  - Password hashing (bcrypt)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Doctor login
- `GET /api/auth/verify` - Verify token
- `GET /api/auth/me` - Get current doctor
- `POST /api/auth/logout` - Logout

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search?q=term` - Search patients
- `GET /api/patients/recent/:doctorId` - Recent patients
- `GET /api/patients/stats/:doctorId` - Dashboard stats

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id` - Update doctor
- `POST /api/doctors` - Create doctor
- `DELETE /api/doctors/:id` - Deactivate doctor

## 🛠 Technology Stack

### Frontend
- React 18.2.0
- React Router 6.8.0
- Axios 1.3.0
- CSS3

### Backend
- Node.js
- Express.js 4.18.2
- MongoDB with Mongoose 7.0.0
- JWT authentication
- Express Validator
- Helmet + CORS
- Morgan logging

## 📊 Data Models

### Doctor
```javascript
{
  employeeId: String (unique),
  name: String,
  email: String,
  specialty: String,
  department: String,
  isActive: Boolean
}
```

### Patient
```javascript
{
  doctorId: ObjectId,
  name: String,
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  vitals: {...},
  medicalHistory: String,
  lifestyleFactors: {...},
  functionalAssessment: {...},
  frailtyPrediction: {
    riskLevel: String (Low/Medium/High),
    confidence: Number,
    predictedAt: Date
  }
}
```

## 🤖 ML Frailty Prediction

The system assesses frailty risk based on multiple factors:
- Age (elderly patients have higher risk)
- BMI (underweight or obese increases risk)
- Cognitive status
- Mobility status
- Lifestyle factors (smoking, exercise, alcohol)
- Medical history and medications

**Risk Levels:**
- 🟢 **Low**: Minimal frailty indicators
- 🟡 **Medium**: Some concerning factors
- 🔴 **High**: Multiple risk factors present

## 🔐 Security

- JWT token-based authentication
- Protected API endpoints
- CORS configuration
- Input validation and sanitization
- Secure password hashing
- Error message sanitization
- XSS protection via Helmet

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/frailty_detection
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env - optional)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Manual Testing
1. Login with employee ID (e.g., DOC001 if seeded)
2. View dashboard statistics
3. Add a new patient
4. View frailty prediction
5. Search for patients
6. Edit patient information
7. View patient details
8. Delete patient

### Sample Credentials (after seeding)
- DOC001 - Dr. Sarah Johnson
- DOC002 - Dr. Michael Chen
- DOC003 - Dr. Emily Rodriguez

## 📚 Documentation

- **Frontend Documentation**: `/frontend/README_FRONTEND.md`
- **Backend Documentation**: `/Backend/README.md`
- **Implementation Status**: `/frontend/IMPLEMENTATION_STATUS.md`
- **Project Requirements**: `/# Frailty Detection Web Application.md`

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy build/ folder to:
# - Netlify
# - Vercel
# - AWS S3 + CloudFront
```

### Backend Deployment
```bash
cd Backend
# Deploy to:
# - Heroku
# - AWS EC2
# - DigitalOcean
# - Render
# - Railway
```

## 🔄 Development Workflow

1. **Start Backend**: `cd Backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm start`
3. **Make Changes**: Edit files and test
4. **Commit**: Git commit with meaningful messages
5. **Deploy**: Push to production when ready

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify network access (MongoDB Atlas)

### CORS Errors
- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend is running on correct port
- Verify backend CORS configuration

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check JWT_SECRET is set
- Verify token format in requests

### Port Already in Use
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

## 🎯 Future Enhancements

- [ ] Advanced ML model integration
- [ ] Data export (PDF/CSV)
- [ ] Patient history timeline
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Telemedicine integration
- [ ] Automated reports
- [ ] Role-based access control

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support:
- Check documentation in respective folders
- Review error logs
- Contact development team

---

**Status**: ✅ **FULLY FUNCTIONAL** - Both frontend and backend are complete and ready to use!

**Last Updated**: October 2025# Frailty_Detection
