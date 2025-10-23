import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import '../../styles/PatientDetails.css';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await patientService.getPatient(id);
      console.log('Patient details response:', response);
      
      // Handle response format (backend returns {success, data})
      const patientData = response.data?.data || response.data;
      console.log('Patient data:', patientData);
      setPatient(patientData);
    } catch (error) {
      setError('Error fetching patient details');
      console.error('Error:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(id);
        navigate('/patients');
      } catch (error) {
        setError('Error deleting patient');
      }
    }
  };

  const getRiskLevelClass = (riskLevel) => {
    if (!riskLevel) return 'unknown';
    return riskLevel.toLowerCase();
  };

  const formatLivingStatus = (status) => {
    if (!status) return 'Not provided';
    const statusMap = {
      'alone': 'Lives Alone',
      'with-family': 'Lives with Family',
      'with-others': 'Lives with Others',
      'care-facility': 'Care Facility'
    };
    return statusMap[status] || status;
  };

  const formatYesNo = (value) => {
    if (!value) return 'Not provided';
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const formatCardiacFunction = (value) => {
    if (!value) return 'Not provided';
    const functionMap = {
      'I': 'Class I (No limitation)',
      'II': 'Class II (Slight limitation)',
      'III-IV': 'Class III-IV (Marked limitation)'
    };
    return functionMap[value] || value;
  };

  if (loading) return <div className="loading">Loading patient details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!patient) return <div className="error-message">Patient not found</div>;

  return (
    <div className="patient-details-container">
      <div className="page-header">
        <div>
          <h1>{patient.name}</h1>
          {patient.frailtyPrediction && patient.frailtyPrediction.riskLevel && (
            <div className={`prediction-banner ${getRiskLevelClass(patient.frailtyPrediction.riskLevel)}`}>
              <div className="prediction-content">
                <h3>Frailty Risk Assessment: {patient.frailtyPrediction.riskLevel}</h3>
                <p>Confidence: {(patient.frailtyPrediction.confidence * 100).toFixed(1)}%</p>
                {patient.frailtyPrediction.predictedAt && (
                  <p className="prediction-date">
                    Assessed on: {new Date(patient.frailtyPrediction.predictedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
                {patient.frailtyPrediction.modelVersion && (
                  <p className="model-version">Model: {patient.frailtyPrediction.modelVersion}</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="header-actions">
          <Link to={`/patients/${id}/edit`} className="button primary">
            Edit Patient
          </Link>
          <button onClick={handleDelete} className="button danger">
            Delete Patient
          </button>
        </div>
      </div>

      <div className="patient-details-grid">
        <div className="details-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Patient ID:</label>
              <span>{patient.patientId || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <label>Name:</label>
              <span>{patient.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{patient.email || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <span>{patient.phone || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <label>Age:</label>
              <span>{patient.age} years</span>
            </div>
            <div className="info-item">
              <label>Gender:</label>
              <span>{patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Not provided'}</span>
            </div>
            <div className="info-item">
              <label>Date Added:</label>
              <span>{new Date(patient.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h3>Frailty Assessment Data</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Living Status:</label>
              <span>{formatLivingStatus(patient.livingStatus)}</span>
            </div>
            <div className="info-item">
              <label>Depression:</label>
              <span>{formatYesNo(patient.depression)}</span>
            </div>
            <div className="info-item">
              <label>Cardiac Function:</label>
              <span>{formatCardiacFunction(patient.cardiacFunction)}</span>
            </div>
            <div className="info-item">
              <label>Cerebrovascular Disease:</label>
              <span>{formatYesNo(patient.cerebrovascularDisease)}</span>
            </div>
            <div className="info-item">
              <label>Diabetes:</label>
              <span>{formatYesNo(patient.diabetes)}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h3>Laboratory Results</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Total Cholesterol:</label>
              <span>{patient.totalCholesterol ? `${patient.totalCholesterol} mmol/L` : 'Not provided'}</span>
            </div>
            <div className="info-item">
              <label>LDL Cholesterol:</label>
              <span>{patient.ldlCholesterol ? `${patient.ldlCholesterol} mmol/L` : 'Not provided'}</span>
            </div>
            <div className="info-item">
              <label>Hemoglobin:</label>
              <span>{patient.hemoglobin ? `${patient.hemoglobin} g/dL` : 'Not provided'}</span>
            </div>
            <div className="info-item">
              <label>ADL Score:</label>
              <span>{patient.adlScore !== undefined ? `${patient.adlScore}/100` : 'Not provided'}</span>
            </div>
          </div>
        </div>

        {patient.notes && (
          <div className="details-section">
            <h3>Additional Notes</h3>
            <div className="info-item">
              <p style={{ whiteSpace: 'pre-wrap' }}>{patient.notes}</p>
            </div>
          </div>
        )}

        <div className="details-section" style={{ background: 'var(--bg-secondary)', border: 'none' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            {patient.updatedAt && patient.updatedAt !== patient.createdAt && (
              <p>Last updated: {new Date(patient.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            )}
          </div>
        </div>
      </div>

      <div className="back-navigation">
        <Link to="/patients" className="button secondary">
          ← Back to Patients
        </Link>
      </div>
    </div>
  );
};

export default PatientDetails;