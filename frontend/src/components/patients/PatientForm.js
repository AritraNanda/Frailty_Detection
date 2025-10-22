import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import '../../styles/PatientForm.css';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctor } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    // Basic Information
    patientId: '',
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    // ML Model Required Fields
    livingStatus: '', // living_alone
    depression: '', // depression
    cardiacFunction: '', // cardiac_function
    cerebrovascularDisease: '', // cerebrovascular_disease
    diabetes: '', // diabetes
    totalCholesterol: '', // tc
    ldlCholesterol: '', // ldl_c
    hemoglobin: '', // hemoglobin
    adlScore: '', // adl_score
    // Optional
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchPatient();
    }
  }, [id, isEditing]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await patientService.getPatient(id);
      setFormData(response.data);
    } catch (error) {
      setError('Error fetching patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const patientData = {
        ...formData,
        doctorId: doctor.id
      };

      let response;
      if (isEditing) {
        response = await patientService.updatePatient(id, patientData);
      } else {
        response = await patientService.createPatient(patientData);
      }

      setPrediction(response.data.frailtyPrediction);
      
      setTimeout(() => {
        navigate('/patients');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving patient data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Loading patient data...</div>;
  }

  return (
    <div className="patient-form-container">
      <div className="form-header">
        <h1>{isEditing ? 'Edit Patient' : 'Add New Patient'}</h1>
      </div>

      {prediction && (
        <div className="prediction-result">
          <h3>Frailty Assessment Result</h3>
          <div className={`prediction-score ${prediction.riskLevel.toLowerCase()}`}>
            <p>Risk Level: <strong>{prediction.riskLevel}</strong></p>
            <p>Confidence: <strong>{(prediction.confidence * 100).toFixed(1)}%</strong></p>
          </div>
        </div>
      )}

      <form className="patient-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="patientId">Patient ID *</label>
              <input
                type="text"
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                placeholder="e.g., P-2025-001"
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="patient@example.com"
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1 234 567 8900"
                className="input-field"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                max="150"
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Frailty Assessment - Required for ML Model</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="livingStatus">Living Status *</label>
              <select
                id="livingStatus"
                name="livingStatus"
                value={formData.livingStatus}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Status</option>
                <option value="alone">Lives Alone</option>
                <option value="with-family">Lives with Family</option>
                <option value="with-others">Lives with Others</option>
                <option value="care-facility">Care Facility</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="depression">Depression *</label>
              <select
                id="depression"
                name="depression"
                value={formData.depression}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cardiacFunction">Cardiac Function Class *</label>
              <select
                id="cardiacFunction"
                name="cardiacFunction"
                value={formData.cardiacFunction}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Class</option>
                <option value="I">Class I (No limitation)</option>
                <option value="II">Class II (Slight limitation)</option>
                <option value="III-IV">Class III-IV (Marked limitation)</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cerebrovascularDisease">Cerebrovascular Disease *</label>
              <select
                id="cerebrovascularDisease"
                name="cerebrovascularDisease"
                value={formData.cerebrovascularDisease}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="diabetes">Diabetes *</label>
              <select
                id="diabetes"
                name="diabetes"
                value={formData.diabetes}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Laboratory Values - Required for ML Model</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalCholesterol">Total Cholesterol (mmol/L) *</label>
              <input
                type="number"
                id="totalCholesterol"
                name="totalCholesterol"
                value={formData.totalCholesterol}
                onChange={handleChange}
                required
                step="any"
                min="0"
                placeholder="e.g., 5.27"
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="ldlCholesterol">LDL Cholesterol (mmol/L) *</label>
              <input
                type="number"
                id="ldlCholesterol"
                name="ldlCholesterol"
                value={formData.ldlCholesterol}
                onChange={handleChange}
                required
                step="any"
                min="0"
                placeholder="e.g., 1.27"
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="hemoglobin">Hemoglobin (g/dL) *</label>
              <input
                type="number"
                id="hemoglobin"
                name="hemoglobin"
                value={formData.hemoglobin}
                onChange={handleChange}
                required
                step="any"
                min="0"
                placeholder="e.g., 131.42"
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="adlScore">ADL Score (0-100) *</label>
              <input
                type="number"
                id="adlScore"
                name="adlScore"
                value={formData.adlScore}
                onChange={handleChange}
                required
                step="any"
                min="0"
                max="100"
                placeholder="e.g., 85"
                className="input-field"
              />
              <small style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
                Activities of Daily Living Score (100 = fully independent)
              </small>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Notes (Optional)</h3>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Any additional observations or notes about the patient..."
              className="input-field"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="button secondary"
            onClick={() => navigate('/patients')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Patient' : 'Save Patient')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;