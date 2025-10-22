"""
Frailty Detection ML Model Training Script

This script trains multiple ML models and saves the best performing one
for use in the Node.js backend application.
"""

import numpy as np
import pandas as pd
import pickle
import json
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from sklearn.metrics import (accuracy_score, roc_auc_score, precision_score, 
                            recall_score, f1_score, confusion_matrix)
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)

def load_and_preprocess_data(csv_path='frailty_dataset_modified.csv'):
    """Load and preprocess the frailty dataset"""
    print("Loading dataset...")
    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.lower().str.replace(' ', '_')
    
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    
    # Handle missing values for numeric columns
    numeric_cols = df.select_dtypes(include=np.number).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    
    # Handle missing values for categorical columns
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns
    for col in categorical_cols:
        if df[col].isnull().sum() > 0:
            mode_value = df[col].mode()[0] if len(df[col].mode()) > 0 else 'Unknown'
            df[col] = df[col].fillna(mode_value)
    
    # Convert cardiac_function to binary
    df['cardiac_function'] = df['cardiac_function'].apply(
        lambda x: 1 if x in ['III–IV', 'III-IV', 'IV'] else 0
    )
    
    # Select features
    features = [
        'age', 'living_alone', 'depression',
        'cardiac_function', 'cerebrovascular_disease',
        'diabetes', 'tc', 'ldl_c', 'hemoglobin', 'adl_score'
    ]
    target = 'frailty'
    
    X = df[features]
    y = df[target]
    
    return X, y, features

def train_and_evaluate_models(X, y):
    """Train multiple models and return the best one"""
    print("\nSplitting data (50-50 train-test split)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.5, random_state=42, stratify=y
    )
    
    # Scale continuous features
    continuous_features = ['age', 'tc', 'ldl_c', 'hemoglobin', 'adl_score']
    scaler = StandardScaler()
    
    X_train_scaled = X_train.copy()
    X_test_scaled = X_test.copy()
    
    X_train_scaled[continuous_features] = scaler.fit_transform(X_train[continuous_features])
    X_test_scaled[continuous_features] = scaler.transform(X_test[continuous_features])
    
    # Initialize models
    models = {
        'Logistic Regression': LogisticRegression(penalty='l2', C=1.0, max_iter=1000, random_state=42),
        'XGBoost': XGBClassifier(learning_rate=0.3, max_depth=6, min_child_weight=2, 
                                reg_lambda=1, random_state=42, use_label_encoder=False, eval_metric='logloss'),
        'LightGBM': LGBMClassifier(learning_rate=0.1, max_depth=-1, n_estimators=100, 
                                  num_leaves=31, random_state=42, verbose=-1),
        'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42),
        'AdaBoost': AdaBoostClassifier(learning_rate=1.0, n_estimators=50, random_state=42)
    }
    
    print("\nTraining and evaluating models...")
    results = {}
    
    for name, model in models.items():
        print(f"\nEvaluating {name}...")
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='roc_auc')
        
        # Train model
        model.fit(X_train_scaled, y_train)
        
        # Predictions
        y_pred = model.predict(X_test_scaled)
        y_proba = model.predict_proba(X_test_scaled)[:, 1]
        
        # Calculate metrics
        results[name] = {
            'model': model,
            'cv_auc_mean': cv_scores.mean(),
            'cv_auc_std': cv_scores.std(),
            'test_auc': roc_auc_score(y_test, y_proba),
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred, zero_division=0),
            'recall': recall_score(y_test, y_pred, zero_division=0),
            'f1': f1_score(y_test, y_pred, zero_division=0),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist()
        }
        
        print(f"  AUC: {results[name]['test_auc']:.4f}")
        print(f"  Accuracy: {results[name]['accuracy']:.4f}")
        print(f"  F1 Score: {results[name]['f1']:.4f}")
    
    # Select best model based on AUC
    best_model_name = max(results, key=lambda x: results[x]['test_auc'])
    best_model = results[best_model_name]['model']
    
    print(f"\n{'='*60}")
    print(f"BEST MODEL: {best_model_name}")
    print(f"Test AUC: {results[best_model_name]['test_auc']:.4f}")
    print(f"Accuracy: {results[best_model_name]['accuracy']:.4f}")
    print(f"Precision: {results[best_model_name]['precision']:.4f}")
    print(f"Recall: {results[best_model_name]['recall']:.4f}")
    print(f"F1 Score: {results[best_model_name]['f1']:.4f}")
    print(f"{'='*60}")
    
    return best_model, scaler, best_model_name, results[best_model_name], continuous_features

def save_model_artifacts(model, scaler, model_name, metrics, features, continuous_features):
    """Save model, scaler, and metadata"""
    print("\nSaving model artifacts...")
    
    # Save model
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)
    print("✓ Model saved to model.pkl")
    
    # Save scaler
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    print("✓ Scaler saved to scaler.pkl")
    
    # Save metadata
    metadata = {
        'model_name': model_name,
        'features': features,
        'continuous_features': continuous_features,
        'metrics': {
            'test_auc': metrics['test_auc'],
            'accuracy': metrics['accuracy'],
            'precision': metrics['precision'],
            'recall': metrics['recall'],
            'f1_score': metrics['f1'],
            'cv_auc_mean': metrics['cv_auc_mean'],
            'cv_auc_std': metrics['cv_auc_std'],
            'confusion_matrix': metrics['confusion_matrix']
        },
        'version': '1.0.0',
        'trained_date': pd.Timestamp.now().isoformat()
    }
    
    with open('model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    print("✓ Metadata saved to model_metadata.json")
    
    print("\n✅ All model artifacts saved successfully!")
    print("\nFiles created:")
    print("  - model.pkl (trained model)")
    print("  - scaler.pkl (feature scaler)")
    print("  - model_metadata.json (model information)")

def main():
    """Main training pipeline"""
    print("="*60)
    print("FRAILTY DETECTION MODEL TRAINING")
    print("="*60)
    
    # Load and preprocess data
    X, y, features = load_and_preprocess_data()
    
    # Train and evaluate models
    best_model, scaler, model_name, metrics, continuous_features = train_and_evaluate_models(X, y)
    
    # Save model artifacts
    save_model_artifacts(best_model, scaler, model_name, metrics, features, continuous_features)
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE!")
    print("="*60)
    print("\nNext steps:")
    print("1. Move the .pkl and .json files to Backend/ml_models/ directory")
    print("2. Install Python dependencies: pip install numpy pandas scikit-learn xgboost lightgbm")
    print("3. The Node.js backend will automatically use this trained model")
    print("\nTo make predictions:")
    print("  - The backend will call predict_frailty.py with patient data")
    print("  - The script will load the model and return predictions")

if __name__ == "__main__":
    main()
