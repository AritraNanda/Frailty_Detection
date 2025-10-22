const Patient = require('../models/Patient');
const { predictFrailty } = require('../utils/mlPredictor');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find({ doctorId: req.doctor.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctorId: req.doctor.id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res, next) => {
  try {
    // Add doctor ID to request body
    req.body.doctorId = req.doctor.id;

    // Create patient
    let patient = await Patient.create(req.body);

    // Predict frailty risk
    try {
      const prediction = await predictFrailty(patient);
      patient.frailtyPrediction = {
        riskLevel: prediction.riskLevel,
        confidence: prediction.confidence,
        predictedAt: Date.now(),
        modelVersion: prediction.modelVersion
      };
      await patient.save();
    } catch (predictionError) {
      console.error('Prediction error:', predictionError);
      // Continue even if prediction fails
    }

    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res, next) => {
  try {
    let patient = await Patient.findOne({
      _id: req.params.id,
      doctorId: req.doctor.id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Update patient
    patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Re-predict frailty if health data changed
    try {
      const prediction = await predictFrailty(patient);
      patient.frailtyPrediction = {
        riskLevel: prediction.riskLevel,
        confidence: prediction.confidence,
        predictedAt: Date.now(),
        modelVersion: prediction.modelVersion
      };
      await patient.save();
    } catch (predictionError) {
      console.error('Prediction error:', predictionError);
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctorId: req.doctor.id
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    await patient.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search patients
// @route   GET /api/patients/search
// @access  Private
exports.searchPatients = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const patients = await Patient.find({
      doctorId: req.doctor.id,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { medicalHistory: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent patients
// @route   GET /api/patients/recent/:doctorId
// @access  Private
exports.getRecentPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find({ doctorId: req.doctor.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/patients/stats/:doctorId
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalPatients = await Patient.countDocuments({ doctorId: req.doctor.id });
    
    const recentPatients = await Patient.countDocuments({
      doctorId: req.doctor.id,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    const highRiskPatients = await Patient.countDocuments({
      doctorId: req.doctor.id,
      'frailtyPrediction.riskLevel': 'High'
    });

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        recentPatients,
        highRiskPatients
      }
    });
  } catch (error) {
    next(error);
  }
};
