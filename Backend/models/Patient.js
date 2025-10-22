const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // Doctor reference
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },

  // Patient Identification
  patientId: {
    type: String,
    required: [true, 'Patient ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },

  // Basic Information
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age must be positive'],
    max: [150, 'Age must be less than 150']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  dateOfBirth: {
    type: Date
  },

  // Physical Measurements
  height: {
    type: Number,
    min: [0, 'Height must be positive']
  },
  weight: {
    type: Number,
    min: [0, 'Weight must be positive']
  },

  // Vital Signs
  bloodPressure: {
    type: String,
    trim: true
  },
  heartRate: {
    type: Number,
    min: [0, 'Heart rate must be positive']
  },
  respiratoryRate: {
    type: Number,
    min: [0, 'Respiratory rate must be positive']
  },
  temperature: {
    type: Number
  },

  // Health History
  medicalHistory: {
    type: String,
    trim: true
  },
  currentMedications: {
    type: String,
    trim: true
  },

  // Lifestyle Factors
  smokingStatus: {
    type: String,
    enum: ['never', 'former', 'current', ''],
    default: ''
  },
  alcoholConsumption: {
    type: String,
    enum: ['never', 'occasional', 'moderate', 'heavy', ''],
    default: ''
  },
  exerciseFrequency: {
    type: String,
    enum: ['never', 'rarely', 'sometimes', 'regularly', ''],
    default: ''
  },

  // Functional Assessment
  cognitiveStatus: {
    type: String,
    enum: ['normal', 'mild-impairment', 'moderate-impairment', 'severe-impairment', ''],
    default: ''
  },
  mobilityStatus: {
    type: String,
    enum: ['independent', 'assistance-needed', 'mobility-aid', 'wheelchair', ''],
    default: ''
  },
  nutritionalStatus: {
    type: String,
    trim: true
  },
  socialSupport: {
    type: String,
    trim: true
  },
  livingSituation: {
    type: String,
    trim: true
  },

  // Additional Health Data
  fallsHistory: {
    type: String,
    trim: true
  },
  visionProblems: {
    type: String,
    trim: true
  },
  hearingProblems: {
    type: String,
    trim: true
  },
  depressionScreening: {
    type: String,
    trim: true
  },
  painLevel: {
    type: String,
    trim: true
  },

  // ML Model Required Fields
  livingStatus: {
    type: String,
    enum: ['alone', 'with-family', 'with-others', 'care-facility', ''],
    default: ''
  },
  depression: {
    type: String,
    enum: ['yes', 'no', 'unknown', ''],
    default: ''
  },
  cardiacFunction: {
    type: String,
    enum: ['I', 'II', 'III-IV', ''],
    default: ''
  },
  cerebrovascularDisease: {
    type: String,
    enum: ['yes', 'no', 'unknown', ''],
    default: ''
  },
  diabetes: {
    type: String,
    enum: ['yes', 'no', 'unknown', ''],
    default: ''
  },
  totalCholesterol: {
    type: Number,
    min: [0, 'Total cholesterol must be positive']
  },
  ldlCholesterol: {
    type: Number,
    min: [0, 'LDL cholesterol must be positive']
  },
  hemoglobin: {
    type: Number,
    min: [0, 'Hemoglobin must be positive']
  },
  adlScore: {
    type: Number,
    min: [0, 'ADL score must be between 0 and 100'],
    max: [100, 'ADL score must be between 0 and 100']
  },

  // Frailty Prediction
  frailtyPrediction: {
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', ''],
      default: ''
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    predictedAt: {
      type: Date
    },
    modelVersion: {
      type: String
    }
  },

  // Contact Information
  contactNumber: {
    type: String,
    trim: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },

  // Metadata
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
patientSchema.index({ doctorId: 1, createdAt: -1 });
patientSchema.index({ patientId: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ name: 'text' });
patientSchema.index({ 'frailtyPrediction.riskLevel': 1 });

// Virtual for BMI
patientSchema.virtual('bmi').get(function() {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

// Ensure virtuals are included in JSON
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);
