# Frailty Detection - Backend API

Node.js/Express backend API for the Frailty Detection Web Application with MongoDB database and ML-based frailty risk assessment.

## 🚀 Features

- **RESTful API**: Complete CRUD operations for patients and doctors
- **Authentication**: JWT-based authentication system
- **ML Integration**: Frailty risk prediction using machine learning
- **Data Validation**: Express-validator for input validation
- **Security**: Helmet, CORS, and secure authentication
- **Error Handling**: Comprehensive error handling middleware
- **Database**: MongoDB with Mongoose ODM
- **Logging**: Morgan HTTP request logger

## 🛠 Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js 4.18.2**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose 7.0.0**: MongoDB ODM
- **JWT**: Token-based authentication
- **Bcrypt**: Password hashing
- **Express Validator**: Input validation
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

## 🔧 Installation

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the Backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/frailty_detection
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
Update `MONGODB_URI` in `.env` with your Atlas connection string.

### 4. Seed Database (Optional)

Populate database with sample data:

```bash
node utils/seedDatabase.js
```

This creates:
- 3 sample doctors
- 9 sample patients (3 per doctor)

## 🚀 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js          # MongoDB configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── doctorController.js  # Doctor CRUD operations
│   └── patientController.js # Patient CRUD operations
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   ├── errorHandler.js     # Error handling middleware
│   └── validator.js        # Input validation rules
├── models/
│   ├── Doctor.js          # Doctor schema
│   └── Patient.js         # Patient schema
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   ├── doctorRoutes.js    # Doctor routes
│   └── patientRoutes.js   # Patient routes
├── utils/
│   ├── helpers.js         # Utility functions
│   ├── mlPredictor.js     # ML prediction logic
│   └── seedDatabase.js    # Database seeding
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── app.js                # Express app configuration
├── package.json          # Dependencies and scripts
├── README.md             # This file
└── server.js             # Server entry point
```

## 🔌 API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "employeeId": "DOC001"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "doctor": {
    "id": "doctor_id",
    "employeeId": "DOC001",
    "name": "Dr. Sarah Johnson",
    "email": "sarah.johnson@hospital.com"
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer {token}
```

#### Get Current Doctor
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Patients

All patient endpoints require authentication (Bearer token).

#### Get All Patients
```http
GET /api/patients
Authorization: Bearer {token}
```

#### Get Single Patient
```http
GET /api/patients/:id
Authorization: Bearer {token}
```

#### Create Patient
```http
POST /api/patients
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "age": 75,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "bloodPressure": "130/85",
  "heartRate": 72,
  "medicalHistory": "Hypertension",
  "cognitiveStatus": "normal",
  "mobilityStatus": "independent"
}
```

#### Update Patient
```http
PUT /api/patients/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "age": 76,
  "weight": 68
}
```

#### Delete Patient
```http
DELETE /api/patients/:id
Authorization: Bearer {token}
```

#### Search Patients
```http
GET /api/patients/search?q=john
Authorization: Bearer {token}
```

#### Get Recent Patients
```http
GET /api/patients/recent/:doctorId
Authorization: Bearer {token}
```

#### Get Dashboard Statistics
```http
GET /api/patients/stats/:doctorId
Authorization: Bearer {token}
```

### Doctors

All doctor endpoints require authentication.

#### Get All Doctors
```http
GET /api/doctors
Authorization: Bearer {token}
```

#### Get Single Doctor
```http
GET /api/doctors/:id
Authorization: Bearer {token}
```

#### Update Doctor Profile
```http
PUT /api/doctors/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Dr. Sarah Johnson Updated",
  "phone": "+1234567890"
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Login with employee ID to receive a token
2. Include token in Authorization header for all protected routes:
   ```
   Authorization: Bearer your_jwt_token_here
   ```
3. Token expires after 7 days (configurable)
4. Token contains doctor ID for authorization

## 🤖 ML Frailty Prediction

The system includes a rule-based frailty prediction algorithm that considers:

- **Age** (weight: 3)
- **BMI** (weight: 2)
- **Cognitive Status** (weight: 3)
- **Mobility Status** (weight: 3)
- **Smoking Status** (weight: 1)
- **Exercise Frequency** (weight: 2)
- **Chronic Conditions** (weight: 2)
- **Medication Count** (weight: 1)

**Risk Levels:**
- **Low**: Score < 0.33
- **Medium**: Score 0.33 - 0.67
- **High**: Score > 0.67

### Integration with External ML Model

To integrate with an external ML model/API:

1. Update `ML_API_URL` in `.env`
2. Modify `utils/mlPredictor.js` to use `predictWithExternalAPI()`
3. Ensure your ML service accepts patient features and returns risk predictions

## 🗄️ Database Schema

### Doctor Schema
```javascript
{
  employeeId: String (unique),
  name: String,
  email: String,
  password: String (hashed),
  specialty: String,
  department: String,
  phone: String,
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Patient Schema
```javascript
{
  doctorId: ObjectId (ref: Doctor),
  name: String,
  age: Number,
  gender: String (enum),
  height: Number,
  weight: Number,
  bloodPressure: String,
  heartRate: Number,
  medicalHistory: String,
  currentMedications: String,
  cognitiveStatus: String (enum),
  mobilityStatus: String (enum),
  frailtyPrediction: {
    riskLevel: String (enum),
    confidence: Number,
    predictedAt: Date,
    modelVersion: String
  },
  timestamps: true
}
```

## 🛡️ Security Features

- **Helmet**: Sets security HTTP headers
- **CORS**: Configured for specific origins
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing (10 salt rounds)
- **Input Validation**: Express-validator for all inputs
- **Error Handling**: No sensitive data in error responses
- **MongoDB Injection Protection**: Mongoose built-in protection

## 📊 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🧪 Testing

### Manual Testing with curl

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"DOC001"}'
```

**Create Patient:**
```bash
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Patient",
    "age": 70,
    "gender": "male"
  }'
```

### Automated Testing (Future)

```bash
npm test
```

## 📝 Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node utils/seedDatabase.js",
  "test": "jest --watchAll --verbose"
}
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/frailty_detection
JWT_SECRET=very_long_random_secret_key_for_production
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

### Deployment Platforms

- **Heroku**: `git push heroku main`
- **AWS EC2**: Use PM2 for process management
- **DigitalOcean**: Deploy with App Platform
- **Render**: Connect GitHub repository
- **Railway**: Simple deployment with database

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure MongoDB Atlas
- [ ] Set up HTTPS
- [ ] Enable rate limiting
- [ ] Set up logging service
- [ ] Configure backup strategy
- [ ] Set up monitoring (e.g., New Relic, DataDog)
- [ ] Enable compression middleware
- [ ] Review security headers

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongod --version

# Check connection string
echo $MONGODB_URI
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### JWT Errors

- Ensure `JWT_SECRET` is set in `.env`
- Check token format: `Bearer {token}`
- Verify token hasn't expired

## 🔄 API Versioning

Current version: `v1.0.0`

Future versions will use URL versioning:
- `/api/v1/patients`
- `/api/v2/patients`

## 📈 Performance Optimization

- Database indexing on frequently queried fields
- Mongoose lean queries for read-only operations
- Connection pooling for MongoDB
- Caching strategies (Redis) for future implementation
- Rate limiting to prevent abuse

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the Frailty Detection Web Application system.

## 📞 Support

For questions or issues:
- Check this README
- Review API documentation
- Check error logs
- Contact development team

---

**Built with ❤️ for healthcare professionals**
