# ML Model Setup Guide

This guide explains how to train and integrate the machine learning model for frailty detection.

## Overview

The system uses a machine learning model trained on patient data to predict frailty risk. The model is trained in Python and integrated with the Node.js backend.

## Architecture

```
Python ML Model (trained) → Node.js Backend (API) → React Frontend
```

1. **Python Scripts**: Train and run ML predictions
2. **Node.js Integration**: Calls Python script via child process
3. **Fallback System**: Uses rule-based prediction if ML model unavailable

## Setup Instructions

### Step 1: Install Python Dependencies

Make sure you have Python 3.7+ installed, then install required packages:

```bash
pip install numpy pandas scikit-learn xgboost lightgbm
```

Or use the requirements file:

```bash
pip install -r requirements.txt
```

### Step 2: Train the ML Model

From the project root directory, run:

```bash
python train_model.py
```

This will:
- Load and preprocess the frailty dataset
- Train multiple ML models (Logistic Regression, XGBoost, LightGBM, Random Forest, AdaBoost)
- Select the best performing model based on AUC score
- Save the model artifacts:
  - `model.pkl` - Trained model
  - `scaler.pkl` - Feature scaler
  - `model_metadata.json` - Model information and metrics

**Expected Output:**
```
FRAILTY DETECTION MODEL TRAINING
Loading dataset...
Dataset shape: (XXX, XX)
Training and evaluating models...
Evaluating Logistic Regression...
  AUC: 0.XXXX
Evaluating XGBoost...
  AUC: 0.XXXX
...
BEST MODEL: XGBoost with AUC: 0.XXXX
```

### Step 3: Move Model Files

Create the ml_models directory and move the trained model files:

```bash
mkdir -p Backend/ml_models
mv model.pkl Backend/ml_models/
mv scaler.pkl Backend/ml_models/
mv model_metadata.json Backend/ml_models/
```

### Step 4: Test the Prediction Script

Test that predictions work:

```bash
cd Backend
python predict_frailty.py '{"age": 75, "livingStatus": "alone", "depression": "yes", "cardiacFunction": "II", "cerebrovascularDisease": "no", "diabetes": "yes", "totalCholesterol": 5.2, "ldlCholesterol": 3.1, "hemoglobin": 12.5, "adlScore": 85}'
```

**Expected Output:**
```json
{
  "success": true,
  "prediction": {
    "riskLevel": "Medium",
    "confidence": 0.75,
    "frailtyProbability": 0.65,
    "nonFrailtyProbability": 0.35,
    "isFramil": true
  },
  "model": {
    "name": "XGBoost",
    "version": "1.0.0",
    "metrics": {
      "auc": 0.85,
      "accuracy": 0.82,
      "f1_score": 0.80
    }
  }
}
```

### Step 5: Verify Node.js Integration

The Node.js backend will automatically use the Python model if available. Start the backend:

```bash
cd Backend
npm run dev
```

The system will:
- ✅ Use ML model if `ml_models/` directory exists with required files
- ⚠️ Fall back to rule-based prediction if ML model files are missing
- 📊 Log which prediction method is being used

## Model Features

The model uses the following features for prediction:

| Feature | Type | Description |
|---------|------|-------------|
| `age` | Continuous | Patient age in years |
| `living_alone` | Binary | Lives alone (1) or with others (0) |
| `depression` | Binary | Has depression (1) or not (0) |
| `cardiac_function` | Binary | Cardiac function class III-IV (1) or I-II (0) |
| `cerebrovascular_disease` | Binary | Has disease (1) or not (0) |
| `diabetes` | Binary | Has diabetes (1) or not (0) |
| `tc` | Continuous | Total cholesterol (mmol/L) |
| `ldl_c` | Continuous | LDL cholesterol (mmol/L) |
| `hemoglobin` | Continuous | Hemoglobin level (g/dL) |
| `adl_score` | Continuous | Activities of Daily Living score (0-100) |

## Prediction Output

The model returns:

```javascript
{
  riskLevel: 'Low' | 'Medium' | 'High',
  confidence: 0.0 - 1.0,  // Model confidence
  frailtyProbability: 0.0 - 1.0,  // Probability of being frail
  modelVersion: '1.0.0',
  modelName: 'XGBoost',
  modelMetrics: {
    auc: 0.85,
    accuracy: 0.82,
    f1_score: 0.80
  }
}
```

## Retraining the Model

To retrain with new data:

1. Update `frailty_dataset_modified.csv` with new patient records
2. Run `python train_model.py` again
3. Replace old model files in `Backend/ml_models/`
4. Restart the backend server

## Troubleshooting

### Python not found
```bash
# Check Python installation
python3 --version

# Or use full path
/usr/bin/python3 train_model.py
```

### Missing dependencies
```bash
# Install all at once
pip install numpy pandas scikit-learn xgboost lightgbm

# Or individually
pip install numpy
pip install pandas
pip install scikit-learn
pip install xgboost
pip install lightgbm
```

### Model files not found
Make sure the directory structure is correct:
```
Backend/
├── ml_models/
│   ├── model.pkl
│   ├── scaler.pkl
│   └── model_metadata.json
├── predict_frailty.py
└── utils/
    └── mlPredictor.js
```

### Fallback prediction being used
Check backend logs for:
```
ML model files not found, using fallback prediction
```

This means model files are missing or in wrong location.

## Model Performance

After training, check `model_metadata.json` for model metrics:

```json
{
  "model_name": "XGBoost",
  "metrics": {
    "test_auc": 0.85,
    "accuracy": 0.82,
    "precision": 0.79,
    "recall": 0.83,
    "f1_score": 0.80
  }
}
```

**Good model performance:**
- AUC > 0.80: Excellent discrimination
- Accuracy > 0.75: Good overall correctness
- F1 Score > 0.75: Good balance of precision and recall

## API Usage

Once integrated, predictions are automatic when creating/updating patients:

```javascript
// Frontend makes API call
POST /api/patients

// Backend automatically:
1. Receives patient data
2. Calls ML predictor
3. Gets risk assessment
4. Saves with patient record
5. Returns to frontend
```

## Next Steps

1. ✅ Train the model with your dataset
2. ✅ Test predictions with sample data
3. ✅ Integrate with backend API
4. 📊 Monitor prediction accuracy
5. 🔄 Retrain periodically with new data
6. 📈 Track model performance metrics

## Support

If you encounter issues:
1. Check Python dependencies are installed
2. Verify model files exist in correct location
3. Check backend logs for error messages
4. Test Python script directly before backend integration
