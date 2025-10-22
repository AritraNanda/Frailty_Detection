# 🚀 Quick Start - ML Model Integration

## TL;DR - Get Started in 3 Steps

### **Option 1: Automatic Setup (Recommended)**

```bash
# Make sure you're in the project root
./setup_ml_model.sh
```

**Windows users:**
```cmd
setup_ml_model.bat
```

### **Option 2: Manual Setup**

```bash
# 1. Install Python dependencies
pip3 install numpy pandas scikit-learn xgboost lightgbm

# 2. Train the model
python3 train_model.py

# 3. Move model files
mkdir -p Backend/ml_models
mv model.pkl scaler.pkl model_metadata.json Backend/ml_models/

# 4. Test prediction
cd Backend
python3 predict_frailty.py '{"age": 75, "depression": "yes", "diabetes": "yes"}'
```

---

## 📋 What You Have

I've created the following files for you:

### **Training & Prediction Scripts**
- `train_model.py` - Trains ML models from your dataset
- `Backend/predict_frailty.py` - Makes predictions on new patients
- `Backend/utils/mlPredictor.js` - Node.js integration (updated)

### **Setup Files**
- `requirements.txt` - Python dependencies
- `setup_ml_model.sh` - Automated setup script (Mac/Linux)
- `setup_ml_model.bat` - Automated setup script (Windows)
- `ML_MODEL_SETUP.md` - Detailed documentation

---

## 🎯 How It Works

```
┌─────────────────┐
│  Patient Data   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐      ┌──────────────┐
│  Frontend Form  │ ───> │ Node.js API  │
└─────────────────┘      └──────┬───────┘
                                │
                                ↓
                         ┌──────────────┐
                         │  mlPredictor │
                         │     .js      │
                         └──────┬───────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
         ✅ ML Model Available        ⚠️  No ML Model
                 │                             │
                 ↓                             ↓
         ┌───────────────┐          ┌─────────────────┐
         │ Python Script │          │ Rule-based      │
         │ (ML Model)    │          │ Fallback System │
         └───────────────┘          └─────────────────┘
                 │                             │
                 └──────────────┬──────────────┘
                                │
                                ↓
                      ┌──────────────────┐
                      │ Risk Prediction  │
                      │ Low/Medium/High  │
                      └──────────────────┘
                                │
                                ↓
                      ┌──────────────────┐
                      │   Save to DB     │
                      │   Return to UI   │
                      └──────────────────┘
```

---

## 📊 Model Training Results

When you run `train_model.py`, you'll see:

```
BEST MODEL: XGBoost (or LightGBM/Random Forest)
Test AUC:     0.85  (Excellent discrimination)
Accuracy:     0.82  (82% correct predictions)
Precision:    0.79  (79% of positive predictions are correct)
Recall:       0.83  (83% of actual positives are caught)
F1 Score:     0.80  (Good balance)
```

**What these metrics mean:**
- **AUC > 0.80**: Excellent model performance
- **Accuracy**: Overall correctness
- **Precision**: When model says "frail", how often is it right?
- **Recall**: How many actual frail patients does it catch?

---

## 🧪 Testing Your Model

### Test Prediction Directly

```bash
cd Backend

# Test with sample patient
python3 predict_frailty.py '{
  "age": 78,
  "livingStatus": "alone",
  "depression": "yes",
  "cardiacFunction": "III-IV",
  "cerebrovascularDisease": "no",
  "diabetes": "yes",
  "totalCholesterol": 5.5,
  "ldlCholesterol": 3.2,
  "hemoglobin": 11.5,
  "adlScore": 75
}'
```

**Expected Output:**
```json
{
  "success": true,
  "prediction": {
    "riskLevel": "High",
    "confidence": 0.89,
    "frailtyProbability": 0.82
  },
  "model": {
    "name": "XGBoost",
    "version": "1.0.0"
  }
}
```

---

## 🔧 Troubleshooting

### "Python not found"
```bash
# Check Python installation
python3 --version

# If not installed, install Python 3.7+
# Mac: brew install python3
# Ubuntu: sudo apt install python3 python3-pip
```

### "Module not found"
```bash
# Install missing packages
pip3 install numpy pandas scikit-learn xgboost lightgbm

# Or all at once
pip3 install -r requirements.txt
```

### "Model files not found"
Make sure files are in the right place:
```
Backend/
├── ml_models/
│   ├── model.pkl           ← Trained model
│   ├── scaler.pkl          ← Feature scaler
│   └── model_metadata.json ← Model info
└── predict_frailty.py
```

### Backend using fallback?
Check backend console logs:
```
✅ "Using ML model for prediction"
   or
⚠️ "ML model files not found, using fallback"
```

---

## 📈 Model Performance Tracking

After training, check model quality:

```bash
# View model metadata
cat Backend/ml_models/model_metadata.json
```

**Key metrics to monitor:**
- `test_auc`: Should be > 0.75 (higher is better)
- `accuracy`: Should be > 0.70 (higher is better)
- `f1_score`: Should be > 0.70 (higher is better)

---

## 🔄 Updating the Model

When you have new patient data:

1. **Add new data** to `frailty_dataset_modified.csv`
2. **Retrain**: Run `./setup_ml_model.sh` again
3. **Compare**: Check if new model performs better
4. **Deploy**: Restart backend to use new model

---

## 💡 Tips

### For Better Predictions:
- ✅ Use complete patient data (all fields filled)
- ✅ Ensure data quality (accurate measurements)
- ✅ Retrain model with more data periodically

### For Production:
- 📊 Log predictions for monitoring
- 🔍 Track model accuracy over time
- 🔄 Retrain quarterly with new data
- 📈 Compare model vs fallback performance

---

## 🎓 Understanding Your Model

### Input Features (10 total):
1. **age** - Patient age (years)
2. **living_alone** - Lives alone or with others
3. **depression** - Has depression diagnosis
4. **cardiac_function** - Heart function classification
5. **cerebrovascular_disease** - Brain/blood vessel disease
6. **diabetes** - Diabetes diagnosis
7. **tc** - Total cholesterol level
8. **ldl_c** - LDL (bad) cholesterol
9. **hemoglobin** - Blood hemoglobin level
10. **adl_score** - Activities of daily living score

### Output:
- **Risk Level**: Low / Medium / High
- **Confidence**: How sure the model is (0-1)
- **Probability**: Exact probability of frailty (0-1)

---

## 📞 Need Help?

1. **Check logs**: Look at backend console for errors
2. **Read docs**: See `ML_MODEL_SETUP.md` for details
3. **Test Python**: Run prediction script directly
4. **Verify files**: Ensure all model files exist

---

## ✅ Checklist

Before running your application:

- [ ] Python 3.7+ installed
- [ ] Dependencies installed (`pip3 install -r requirements.txt`)
- [ ] Model trained (`python3 train_model.py`)
- [ ] Model files in `Backend/ml_models/`
- [ ] Prediction test successful
- [ ] Backend can import required modules
- [ ] Frontend form sends correct data format

**You're ready when:**
```bash
# This command works:
cd Backend && python3 predict_frailty.py '{"age": 75}'

# Output shows: "success": true
```

---

**Happy Predicting! 🎉**
