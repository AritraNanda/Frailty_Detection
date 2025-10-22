#!/bin/bash

# ML Model Setup Script for Frailty Detection System
# This script automates the setup of the ML model

echo "======================================"
echo "ML Model Setup - Frailty Detection"
echo "======================================"
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    echo "Please install Python 3.7 or higher"
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"
echo ""

# Check if dataset exists
if [ ! -f "frailty_dataset_modified.csv" ]; then
    echo "❌ Error: frailty_dataset_modified.csv not found"
    echo "Please make sure the dataset file is in the project root"
    exit 1
fi

echo "✓ Dataset found"
echo ""

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Train the model
echo "🤖 Training ML model..."
python3 train_model.py

if [ $? -ne 0 ]; then
    echo "❌ Model training failed"
    exit 1
fi

echo ""
echo "✓ Model training complete"
echo ""

# Create ml_models directory
echo "📁 Creating ml_models directory..."
mkdir -p Backend/ml_models

# Move model files
echo "📦 Moving model files..."
if [ -f "model.pkl" ]; then
    mv model.pkl Backend/ml_models/
    echo "  ✓ model.pkl moved"
fi

if [ -f "scaler.pkl" ]; then
    mv scaler.pkl Backend/ml_models/
    echo "  ✓ scaler.pkl moved"
fi

if [ -f "model_metadata.json" ]; then
    mv model_metadata.json Backend/ml_models/
    echo "  ✓ model_metadata.json moved"
fi

echo ""

# Test prediction
echo "🧪 Testing prediction script..."
cd Backend
python3 predict_frailty.py '{"age": 75, "livingStatus": "alone", "depression": "yes", "cardiacFunction": "II", "cerebrovascularDisease": "no", "diabetes": "yes", "totalCholesterol": 5.2, "ldlCholesterol": 3.1, "hemoglobin": 12.5, "adlScore": 85}'

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Prediction test successful"
else
    echo "❌ Prediction test failed"
    exit 1
fi

cd ..

echo ""
echo "======================================"
echo "✅ ML Model Setup Complete!"
echo "======================================"
echo ""
echo "Model files are ready in Backend/ml_models/"
echo ""
echo "Next steps:"
echo "1. Start the backend: cd Backend && npm run dev"
echo "2. Start the frontend: cd frontend && npm start"
echo "3. The system will automatically use the ML model for predictions"
echo ""
echo "To view model performance, check:"
echo "  Backend/ml_models/model_metadata.json"
echo ""
