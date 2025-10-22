"""
Frailty Prediction Script

This script loads the trained model and makes predictions on new patient data.
It's called by the Node.js backend via child process.
"""

import sys
import json
import pickle
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

def load_model_artifacts():
    """Load the trained model, scaler, and metadata"""
    try:
        with open('ml_models/model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        with open('ml_models/scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        
        with open('ml_models/model_metadata.json', 'r') as f:
            metadata = json.load(f)
        
        return model, scaler, metadata
    except FileNotFoundError as e:
        print(json.dumps({
            'error': f'Model files not found: {str(e)}',
            'suggestion': 'Please run train_model.py first to create the model files'
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            'error': f'Error loading model: {str(e)}'
        }))
        sys.exit(1)

def prepare_features(patient_data, feature_names, continuous_features):
    """Prepare patient data for prediction"""
    try:
        # Create a DataFrame with the patient data
        # Map frontend field names to model feature names
        feature_mapping = {
            'age': patient_data.get('age', 70),
            'living_alone': 1 if patient_data.get('livingStatus') == 'alone' else 0,
            'depression': 1 if patient_data.get('depression') == 'yes' else 0,
            'cardiac_function': 1 if patient_data.get('cardiacFunction') in ['III-IV', 'IV'] else 0,
            'cerebrovascular_disease': 1 if patient_data.get('cerebrovascularDisease') == 'yes' else 0,
            'diabetes': 1 if patient_data.get('diabetes') == 'yes' else 0,
            'tc': float(patient_data.get('totalCholesterol', 5.0)),
            'ldl_c': float(patient_data.get('ldlCholesterol', 3.0)),
            'hemoglobin': float(patient_data.get('hemoglobin', 13.5)),
            'adl_score': float(patient_data.get('adlScore', 100))
        }
        
        # Create DataFrame with correct feature order
        df = pd.DataFrame([feature_mapping])
        df = df[feature_names]  # Ensure correct order
        
        return df
    except Exception as e:
        raise ValueError(f"Error preparing features: {str(e)}")

def predict_frailty(patient_data):
    """Make frailty prediction for a patient"""
    try:
        # Load model artifacts
        model, scaler, metadata = load_model_artifacts()
        
        # Prepare features
        X = prepare_features(
            patient_data, 
            metadata['features'],
            metadata['continuous_features']
        )
        
        # Scale continuous features
        X_scaled = X.copy()
        X_scaled[metadata['continuous_features']] = scaler.transform(
            X[metadata['continuous_features']]
        )
        
        # Make prediction
        prediction = model.predict(X_scaled)[0]
        probability = model.predict_proba(X_scaled)[0]
        
        # Determine risk level
        frailty_probability = probability[1]  # Probability of being frail
        
        if frailty_probability < 0.33:
            risk_level = 'Low'
        elif frailty_probability < 0.67:
            risk_level = 'Medium'
        else:
            risk_level = 'High'
        
        # Return prediction result
        result = {
            'success': True,
            'prediction': {
                'riskLevel': risk_level,
                'confidence': float(max(probability)),
                'frailtyProbability': float(frailty_probability),
                'nonFrailtyProbability': float(probability[0]),
                'isFramil': bool(prediction == 1)
            },
            'model': {
                'name': metadata['model_name'],
                'version': metadata['version'],
                'metrics': {
                    'auc': metadata['metrics']['test_auc'],
                    'accuracy': metadata['metrics']['accuracy'],
                    'f1_score': metadata['metrics']['f1_score']
                }
            }
        }
        
        return result
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'prediction': {
                'riskLevel': 'Unknown',
                'confidence': 0.0,
                'frailtyProbability': 0.0
            }
        }

def main():
    """Main function to handle command line input"""
    try:
        # Read patient data from stdin or command line argument
        if len(sys.argv) > 1:
            # Data passed as command line argument
            patient_data = json.loads(sys.argv[1])
        else:
            # Data passed via stdin
            input_data = sys.stdin.read()
            patient_data = json.loads(input_data)
        
        # Make prediction
        result = predict_frailty(patient_data)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        print(json.dumps({
            'success': False,
            'error': 'Invalid JSON input'
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
