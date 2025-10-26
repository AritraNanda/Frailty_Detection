import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import { generatePatientReport } from '../../utils/pdfGenerator';
import '../../styles/PatientDetails.css';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctor } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const handleGenerateReport = () => {
    if (patient && doctor) {
      generatePatientReport(patient, doctor.name);
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
      <div className="back-navigation-top">
        <Link to="/patients" className="back-link">
          ← Back to Patients
        </Link>
      </div>

      <div className="patient-header-card">
        <div className="patient-header-content">
          <div className="patient-avatar">
            <div className="avatar-circle">
              {patient.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="patient-header-info">
            <h1 className="patient-name">{patient.name}</h1>
            <div className="patient-meta">
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                </svg>
                ID: {patient.patientId}
              </span>
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                {patient.age} years • {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Not specified'}
              </span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={handleGenerateReport} className="action-btn report-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
              <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
            </svg>
            Generate Report
          </button>
          <Link to={`/patients/${id}/edit`} className="action-btn edit-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
            Edit
          </Link>
          <button onClick={handleDelete} className="action-btn delete-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      {patient.frailtyPrediction && patient.frailtyPrediction.riskLevel && (
        <div className={`frailty-risk-card ${getRiskLevelClass(patient.frailtyPrediction.riskLevel)}`}>
          <div className="risk-card-header">
            <div className="risk-icon">
              {patient.frailtyPrediction.riskLevel.toLowerCase() === 'low' && (
                <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
              )}
              {patient.frailtyPrediction.riskLevel.toLowerCase() === 'medium' && (
                <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
              )}
              {patient.frailtyPrediction.riskLevel.toLowerCase() === 'high' && (
                <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
              )}
            </div>
            <div>
              <h3>Frailty Risk Assessment</h3>
              <div className="risk-level">{patient.frailtyPrediction.riskLevel} Risk</div>
            </div>
          </div>
          <div className="risk-card-body">
            <div className="risk-stat">
              <div className="stat-label">Confidence Level</div>
              <div className="stat-value">{(patient.frailtyPrediction.confidence * 100).toFixed(1)}%</div>
            </div>
            {patient.frailtyPrediction.predictedAt && (
              <div className="risk-stat">
                <div className="stat-label">Assessment Date</div>
                <div className="stat-value">
                  {new Date(patient.frailtyPrediction.predictedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
            {patient.frailtyPrediction.modelVersion && (
              <div className="risk-stat">
                <div className="stat-label">Model Version</div>
                <div className="stat-value">{patient.frailtyPrediction.modelVersion}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="details-grid">
        <div className="detail-card">
          <div className="card-header">
            <svg className="card-icon" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
            <h3>Contact Information</h3>
          </div>
          <div className="card-body">
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{patient.email || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{patient.phone || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date Added</span>
              <span className="detail-value">
                {new Date(patient.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="card-header">
            <svg className="card-icon" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
              <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13z"/>
            </svg>
            <h3>Health Assessment</h3>
          </div>
          <div className="card-body">
            <div className="detail-row">
              <span className="detail-label">Living Status</span>
              <span className="detail-value">{formatLivingStatus(patient.livingStatus)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Depression</span>
              <span className="detail-value">{formatYesNo(patient.depression)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Cardiac Function</span>
              <span className="detail-value">{formatCardiacFunction(patient.cardiacFunction)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Cerebrovascular Disease</span>
              <span className="detail-value">{formatYesNo(patient.cerebrovascularDisease)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Diabetes</span>
              <span className="detail-value">{formatYesNo(patient.diabetes)}</span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="card-header">
            <svg className="card-icon" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
            </svg>
            <h3>Laboratory Results</h3>
          </div>
          <div className="card-body">
            <div className="detail-row">
              <span className="detail-label">Total Cholesterol</span>
              <span className="detail-value">
                {patient.totalCholesterol ? `${patient.totalCholesterol} mmol/L` : 'Not provided'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">LDL Cholesterol</span>
              <span className="detail-value">
                {patient.ldlCholesterol ? `${patient.ldlCholesterol} mmol/L` : 'Not provided'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Hemoglobin</span>
              <span className="detail-value">
                {patient.hemoglobin ? `${patient.hemoglobin} g/dL` : 'Not provided'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">ADL Score</span>
              <span className="detail-value">
                {patient.adlScore !== undefined ? `${patient.adlScore}/100` : 'Not provided'}
              </span>
            </div>
          </div>
        </div>

        {patient.notes && (
          <div className="detail-card notes-card">
            <div className="card-header">
              <svg className="card-icon" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
                <path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"/>
              </svg>
              <h3>Additional Notes</h3>
            </div>
            <div className="card-body">
              <p className="notes-text">{patient.notes}</p>
            </div>
          </div>
        )}
      </div>

      {patient.updatedAt && patient.updatedAt !== patient.createdAt && (
        <div className="update-timestamp">
          Last updated: {new Date(patient.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  );
};

export default PatientDetails;