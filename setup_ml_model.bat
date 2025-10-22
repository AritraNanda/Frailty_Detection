@echo off
REM ML Model Setup Script for Frailty Detection System (Windows)

echo ======================================
echo ML Model Setup - Frailty Detection
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed
    echo Please install Python 3.7 or higher
    exit /b 1
)

echo Python found
python --version
echo.

REM Check if dataset exists
if not exist "frailty_dataset_modified.csv" (
    echo Error: frailty_dataset_modified.csv not found
    echo Please make sure the dataset file is in the project root
    exit /b 1
)

echo Dataset found
echo.

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo Failed to install dependencies
    exit /b 1
)

echo Dependencies installed
echo.

REM Train the model
echo Training ML model...
python train_model.py

if errorlevel 1 (
    echo Model training failed
    exit /b 1
)

echo.
echo Model training complete
echo.

REM Create ml_models directory
echo Creating ml_models directory...
if not exist "Backend\ml_models" mkdir Backend\ml_models

REM Move model files
echo Moving model files...
if exist "model.pkl" (
    move /Y model.pkl Backend\ml_models\
    echo   model.pkl moved
)

if exist "scaler.pkl" (
    move /Y scaler.pkl Backend\ml_models\
    echo   scaler.pkl moved
)

if exist "model_metadata.json" (
    move /Y model_metadata.json Backend\ml_models\
    echo   model_metadata.json moved
)

echo.

REM Test prediction
echo Testing prediction script...
cd Backend
python predict_frailty.py "{\"age\": 75, \"livingStatus\": \"alone\", \"depression\": \"yes\", \"cardiacFunction\": \"II\", \"cerebrovascularDisease\": \"no\", \"diabetes\": \"yes\", \"totalCholesterol\": 5.2, \"ldlCholesterol\": 3.1, \"hemoglobin\": 12.5, \"adlScore\": 85}"

if errorlevel 1 (
    echo Prediction test failed
    cd ..
    exit /b 1
)

cd ..

echo.
echo ======================================
echo ML Model Setup Complete!
echo ======================================
echo.
echo Model files are ready in Backend\ml_models\
echo.
echo Next steps:
echo 1. Start the backend: cd Backend ^&^& npm run dev
echo 2. Start the frontend: cd frontend ^&^& npm start
echo 3. The system will automatically use the ML model for predictions
echo.
echo To view model performance, check:
echo   Backend\ml_models\model_metadata.json
echo.

pause
