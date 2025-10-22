const Doctor = require('../models/Doctor');
const { generateToken } = require('../middleware/auth');

// @desc    Login doctor
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { employeeId, password } = req.body;

    // Find doctor by employee ID
    let doctor = await Doctor.findOne({ employeeId }).select('+password');

    if (!doctor) {
      // If doctor doesn't exist, create a new one (for simplicity)
      // In production, you'd want proper registration
      doctor = await Doctor.create({
        employeeId,
        name: `Dr. ${employeeId}`, // Default name
        isActive: true
      });
    }

    // Check if doctor is active
    if (!doctor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // If password authentication is needed (optional)
    if (password && doctor.password) {
      const isMatch = await doctor.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    }

    // Update last login
    await doctor.updateLastLogin();

    // Generate token
    const token = generateToken(doctor._id);

    res.status(200).json({
      success: true,
      token,
      doctor: {
        id: doctor._id,
        employeeId: doctor.employeeId,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        department: doctor.department
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
exports.verify = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      doctor: {
        id: req.doctor._id,
        employeeId: req.doctor.employeeId,
        name: req.doctor.name,
        email: req.doctor.email,
        specialty: req.doctor.specialty,
        department: req.doctor.department
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current doctor profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.doctor.id);
    
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout doctor
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // Client-side will remove token from localStorage
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
