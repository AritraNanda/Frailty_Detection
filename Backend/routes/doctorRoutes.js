const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctor,
  updateDoctor,
  createDoctor,
  deactivateDoctor
} = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');
const { validateDoctor, validateId, validate } = require('../middleware/validator');

// Protect all routes
router.use(protect);

router.route('/')
  .get(getAllDoctors)
  .post(validateDoctor, validate, createDoctor);

router.route('/:id')
  .get(validateId, validate, getDoctor)
  .put(validateId, validate, updateDoctor)
  .delete(validateId, validate, deactivateDoctor);

module.exports = router;
