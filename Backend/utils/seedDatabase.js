/**
 * Database seeding utility
 * Run this to populate the database with sample data for testing
 */

const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
require('dotenv').config();

const connectDB = require('../config/database');

// Sample doctors
const doctors = [
  {
    employeeId: 'DOC001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    specialty: 'Geriatrics',
    department: 'Internal Medicine',
    phone: '+1234567890'
  },
  {
    employeeId: 'DOC002',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    specialty: 'Family Medicine',
    department: 'Primary Care',
    phone: '+1234567891'
  },
  {
    employeeId: 'DOC003',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    specialty: 'Neurology',
    department: 'Neurosciences',
    phone: '+1234567892'
  }
];

// Sample patients
const generateSamplePatients = (doctorId) => {
  return [
    {
      doctorId,
      name: 'John Smith',
      age: 75,
      gender: 'male',
      height: 175,
      weight: 70,
      bloodPressure: '130/85',
      heartRate: 72,
      respiratoryRate: 16,
      temperature: 36.8,
      medicalHistory: 'Hypertension, Type 2 Diabetes',
      currentMedications: 'Metformin, Lisinopril',
      smokingStatus: 'former',
      alcoholConsumption: 'occasional',
      exerciseFrequency: 'sometimes',
      cognitiveStatus: 'normal',
      mobilityStatus: 'independent',
      frailtyPrediction: {
        riskLevel: 'Medium',
        confidence: 0.72,
        predictedAt: new Date(),
        modelVersion: '1.0.0'
      }
    },
    {
      doctorId,
      name: 'Mary Johnson',
      age: 82,
      gender: 'female',
      height: 162,
      weight: 58,
      bloodPressure: '145/90',
      heartRate: 78,
      respiratoryRate: 18,
      temperature: 36.6,
      medicalHistory: 'Osteoporosis, Arthritis, Heart Disease',
      currentMedications: 'Alendronate, Aspirin, Atorvastatin',
      smokingStatus: 'never',
      alcoholConsumption: 'never',
      exerciseFrequency: 'rarely',
      cognitiveStatus: 'mild-impairment',
      mobilityStatus: 'mobility-aid',
      frailtyPrediction: {
        riskLevel: 'High',
        confidence: 0.85,
        predictedAt: new Date(),
        modelVersion: '1.0.0'
      }
    },
    {
      doctorId,
      name: 'Robert Williams',
      age: 68,
      gender: 'male',
      height: 180,
      weight: 85,
      bloodPressure: '120/80',
      heartRate: 68,
      respiratoryRate: 14,
      temperature: 37.0,
      medicalHistory: 'None',
      currentMedications: 'None',
      smokingStatus: 'never',
      alcoholConsumption: 'occasional',
      exerciseFrequency: 'regularly',
      cognitiveStatus: 'normal',
      mobilityStatus: 'independent',
      frailtyPrediction: {
        riskLevel: 'Low',
        confidence: 0.88,
        predictedAt: new Date(),
        modelVersion: '1.0.0'
      }
    }
  ];
};

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Doctor.deleteMany({});
    await Patient.deleteMany({});

    // Insert doctors
    console.log('👨‍⚕️  Creating doctors...');
    const createdDoctors = await Doctor.insertMany(doctors);
    console.log(`✅ Created ${createdDoctors.length} doctors`);

    // Insert patients for each doctor
    console.log('🏥  Creating patients...');
    let totalPatients = 0;
    for (const doctor of createdDoctors) {
      const patients = generateSamplePatients(doctor._id);
      await Patient.insertMany(patients);
      totalPatients += patients.length;
    }
    console.log(`✅ Created ${totalPatients} patients`);

    console.log('🎉  Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
