/**
 * ML Frailty Predictor
 * 
 * This module handles frailty risk prediction using machine learning.
 * Integrates with Python-based ML model for predictions.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Check if ML model files exist
 */
function checkModelFiles() {
  const modelDir = path.join(__dirname, '..', 'ml_models');
  const requiredFiles = ['model.pkl', 'scaler.pkl', 'model_metadata.json'];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(modelDir, file))) {
      return false;
    }
  }
  return true;
}

/**
 * ML-based prediction using Python model
 */
exports.predictFrailty = async (patientData) => {
  try {
    // Check if model files exist
    const hasModel = checkModelFiles();
    
    if (!hasModel) {
      console.warn('ML model files not found, using fallback prediction');
      return fallbackPrediction(patientData);
    }
    
    // Prepare patient data for Python script
    const pythonInput = {
      age: patientData.age || 70,
      livingStatus: patientData.livingStatus,
      depression: patientData.depression,
      cardiacFunction: patientData.cardiacFunction,
      cerebrovascularDisease: patientData.cerebrovascularDisease,
      diabetes: patientData.diabetes,
      totalCholesterol: patientData.totalCholesterol || patientData.tc,
      ldlCholesterol: patientData.ldlCholesterol || patientData.ldl_c,
      hemoglobin: patientData.hemoglobin,
      adlScore: patientData.adlScore
    };
    
    // Call Python prediction script
    const prediction = await callPythonPredictor(pythonInput);
    
    if (prediction.success) {
      return {
        riskLevel: prediction.prediction.riskLevel,
        confidence: prediction.prediction.confidence,
        frailtyProbability: prediction.prediction.frailtyProbability,
        modelVersion: prediction.model.version,
        modelName: prediction.model.name,
        modelMetrics: prediction.model.metrics
      };
    } else {
      console.error('Python prediction failed:', prediction.error);
      return fallbackPrediction(patientData);
    }
    
  } catch (error) {
    console.error('Prediction error:', error);
    return fallbackPrediction(patientData);
  }
};

/**
 * Call Python prediction script
 */
function callPythonPredictor(patientData) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'predict_frailty.py');
    
    // Check if Python script exists
    if (!fs.existsSync(scriptPath)) {
      reject(new Error('Python prediction script not found'));
      return;
    }
    
    // Spawn Python process
    const python = spawn('python3', [scriptPath]);
    
    let output = '';
    let errorOutput = '';
    
    // Send patient data to Python script via stdin
    python.stdin.write(JSON.stringify(patientData));
    python.stdin.end();
    
    // Collect output
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    // Handle completion
    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
        return;
      }
      
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error.message}`));
      }
    });
    
    // Handle errors
    python.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      python.kill();
      reject(new Error('Python prediction timeout'));
    }, 10000);
  });
}

/**
 * Fallback prediction using rule-based system
 */
function fallbackPrediction(patientData) {
  console.log('Using fallback rule-based prediction');
  
  const features = extractFeatures(patientData);
  const riskScore = calculateRiskScore(features);
  
  let riskLevel;
  if (riskScore < 0.33) {
    riskLevel = 'Low';
  } else if (riskScore < 0.67) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'High';
  }
  
  return {
    riskLevel,
    confidence: Math.min(0.95, riskScore + 0.1),
    frailtyProbability: riskScore,
    modelVersion: '1.0.0-fallback',
    modelName: 'Rule-based System',
    isFallback: true
  };
}

// Extract relevant features from patient data
function extractFeatures(patient) {
  return {
    age: patient.age || 0,
    bmi: calculateBMI(patient.height, patient.weight),
    cognitiveStatus: patient.cognitiveStatus || 'normal',
    mobilityStatus: patient.mobilityStatus || 'independent',
    smokingStatus: patient.smokingStatus || 'never',
    alcoholConsumption: patient.alcoholConsumption || 'never',
    exerciseFrequency: patient.exerciseFrequency || 'regularly',
    hasChronicConditions: Boolean(patient.medicalHistory),
    medicationCount: countMedications(patient.currentMedications)
  };
}

// Calculate BMI
function calculateBMI(height, weight) {
  if (!height || !weight) return 0;
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

// Count number of medications
function countMedications(medications) {
  if (!medications) return 0;
  return medications.split(',').length;
}

// Calculate risk score (0-1)
function calculateRiskScore(features) {
  let score = 0;
  let maxScore = 0;

  // Age factor (weight: 3)
  maxScore += 3;
  if (features.age > 80) {
    score += 3;
  } else if (features.age > 70) {
    score += 2;
  } else if (features.age > 60) {
    score += 1;
  }

  // BMI factor (weight: 2)
  maxScore += 2;
  if (features.bmi < 18.5 || features.bmi > 30) {
    score += 2;
  } else if (features.bmi < 20 || features.bmi > 28) {
    score += 1;
  }

  // Cognitive status (weight: 3)
  maxScore += 3;
  const cognitiveScores = {
    'severe-impairment': 3,
    'moderate-impairment': 2,
    'mild-impairment': 1,
    'normal': 0
  };
  score += cognitiveScores[features.cognitiveStatus] || 0;

  // Mobility status (weight: 3)
  maxScore += 3;
  const mobilityScores = {
    'wheelchair': 3,
    'mobility-aid': 2,
    'assistance-needed': 1,
    'independent': 0
  };
  score += mobilityScores[features.mobilityStatus] || 0;

  // Smoking status (weight: 1)
  maxScore += 1;
  if (features.smokingStatus === 'current') {
    score += 1;
  } else if (features.smokingStatus === 'former') {
    score += 0.5;
  }

  // Exercise frequency (weight: 2)
  maxScore += 2;
  const exerciseScores = {
    'never': 2,
    'rarely': 1.5,
    'sometimes': 1,
    'regularly': 0
  };
  score += exerciseScores[features.exerciseFrequency] || 0;

  // Chronic conditions (weight: 2)
  maxScore += 2;
  if (features.hasChronicConditions) {
    score += 2;
  }

  // Medication count (weight: 1)
  maxScore += 1;
  if (features.medicationCount > 5) {
    score += 1;
  } else if (features.medicationCount > 3) {
    score += 0.5;
  }

  // Normalize score to 0-1
  return maxScore > 0 ? score / maxScore : 0.5;
}

/**
 * Integration with external ML API (for future use)
 */
exports.predictWithExternalAPI = async (patientData) => {
  // Example integration with external ML API
  // const axios = require('axios');
  // const response = await axios.post(process.env.ML_API_URL, {
  //   features: extractFeatures(patientData)
  // });
  // return response.data;
  
  throw new Error('External ML API not configured');
};
