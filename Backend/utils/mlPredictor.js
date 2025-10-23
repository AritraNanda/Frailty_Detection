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
      console.warn('⚠️  ML model files not found, using fallback prediction');
      console.warn('Expected model files in:', path.join(__dirname, '..', 'ml_models'));
      return fallbackPrediction(patientData);
    }
    
    console.log('✅ ML model files found, attempting Python prediction...');
    
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
    
    console.log('📊 Patient data for prediction:', pythonInput);
    
    // Call Python prediction script
    const prediction = await callPythonPredictor(pythonInput);
    
    if (prediction.success) {
      console.log('✅ Python prediction successful:', prediction.prediction.riskLevel);
      return {
        riskLevel: prediction.prediction.riskLevel,
        confidence: prediction.prediction.confidence,
        frailtyProbability: prediction.prediction.frailtyProbability,
        modelVersion: prediction.model.version,
        modelName: prediction.model.name,
        modelMetrics: prediction.model.metrics
      };
    } else {
      console.error('❌ Python prediction failed:', prediction.error);
      console.warn('⚠️  Falling back to rule-based prediction');
      return fallbackPrediction(patientData);
    }
    
  } catch (error) {
    console.error('❌ Prediction error:', error);
    console.warn('⚠️  Falling back to rule-based prediction');
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
      console.error('❌ Python script not found at:', scriptPath);
      reject(new Error('Python prediction script not found'));
      return;
    }
    
    console.log('🐍 Starting Python process with script:', scriptPath);
    
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
      console.error('🐍 Python stderr:', data.toString());
    });
    
    // Handle completion
    python.on('close', (code) => {
      console.log(`🐍 Python process exited with code ${code}`);
      
      if (code !== 0) {
        console.error('❌ Python error output:', errorOutput);
        reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
        return;
      }
      
      try {
        console.log('🐍 Python output:', output);
        const result = JSON.parse(output);
        resolve(result);
      } catch (error) {
        console.error('❌ Failed to parse Python output:', output);
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
  console.log('⚠️  Using fallback rule-based prediction');
  console.log('📊 Patient data for fallback:', {
    age: patientData.age,
    livingStatus: patientData.livingStatus,
    depression: patientData.depression,
    cardiacFunction: patientData.cardiacFunction,
    diabetes: patientData.diabetes
  });
  
  // Calculate risk score based on actual ML features
  let riskScore = 0;
  let maxScore = 0;
  
  // Age factor (weight: 3)
  maxScore += 3;
  if (patientData.age > 80) {
    riskScore += 3;
  } else if (patientData.age > 70) {
    riskScore += 2;
  } else if (patientData.age > 60) {
    riskScore += 1;
  }
  
  // Living alone (weight: 2)
  maxScore += 2;
  if (patientData.livingStatus === 'alone') {
    riskScore += 2;
  }
  
  // Depression (weight: 3)
  maxScore += 3;
  if (patientData.depression === 'yes') {
    riskScore += 3;
  }
  
  // Cardiac function (weight: 3)
  maxScore += 3;
  if (patientData.cardiacFunction === 'III-IV' || patientData.cardiacFunction === 'IV') {
    riskScore += 3;
  } else if (patientData.cardiacFunction === 'II-III' || patientData.cardiacFunction === 'III') {
    riskScore += 2;
  }
  
  // Cerebrovascular disease (weight: 2)
  maxScore += 2;
  if (patientData.cerebrovascularDisease === 'yes') {
    riskScore += 2;
  }
  
  // Diabetes (weight: 2)
  maxScore += 2;
  if (patientData.diabetes === 'yes') {
    riskScore += 2;
  }
  
  // Hemoglobin (weight: 2)
  maxScore += 2;
  if (patientData.hemoglobin < 12) {
    riskScore += 2;
  } else if (patientData.hemoglobin < 13) {
    riskScore += 1;
  }
  
  // ADL Score (weight: 3)
  maxScore += 3;
  if (patientData.adlScore < 60) {
    riskScore += 3;
  } else if (patientData.adlScore < 80) {
    riskScore += 2;
  } else if (patientData.adlScore < 90) {
    riskScore += 1;
  }
  
  // Normalize score to 0-1
  const normalizedScore = maxScore > 0 ? riskScore / maxScore : 0.5;
  
  let riskLevel;
  if (normalizedScore < 0.33) {
    riskLevel = 'Low';
  } else if (normalizedScore < 0.67) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'High';
  }
  
  console.log(`📊 Fallback calculation: ${riskScore}/${maxScore} = ${normalizedScore.toFixed(2)} → ${riskLevel}`);
  
  return {
    riskLevel,
    confidence: Math.min(0.85, normalizedScore + 0.15),
    frailtyProbability: normalizedScore,
    modelVersion: '1.0.0-fallback',
    modelName: 'Rule-based System (Fallback)',
    isFallback: true
  };
}

/**
 * Integration with external ML API (for future use)
 */
exports.predictWithExternalAPI = async (patientData) => {
  throw new Error('External ML API not configured');
};
