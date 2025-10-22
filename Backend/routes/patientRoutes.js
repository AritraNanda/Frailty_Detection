const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients,
  getRecentPatients,
  getDashboardStats
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');
const { validatePatient, validateId, validateSearch, validate } = require('../middleware/validator');

// Protect all routes
router.use(protect);

// Search and stats routes (must be before /:id)
router.get('/search', validateSearch, validate, searchPatients);
router.get('/recent/:doctorId', getRecentPatients);
router.get('/stats/:doctorId', getDashboardStats);

// CRUD routes
router.route('/')
  .get(getAllPatients)
  .post(validatePatient, validate, createPatient);

router.route('/:id')
  .get(validateId, validate, getPatient)
  .put(validateId, validate, updatePatient)
  .delete(validateId, validate, deletePatient);

module.exports = router;
