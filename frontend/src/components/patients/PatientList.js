import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import '../../styles/PatientList.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAllPatients();
      console.log('Patients response:', response);
      
      // Handle different response formats
      let patientsData = [];
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          patientsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          patientsData = response.data.data;
        } else if (response.data.patients && Array.isArray(response.data.patients)) {
          patientsData = response.data.patients;
        }
      }
      
      setPatients(patientsData);
    } catch (error) {
      setError('Error fetching patients');
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      setPatients([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(patientId);
        setPatients(patients.filter(p => p._id !== patientId));
      } catch (error) {
        setError('Error deleting patient');
      }
    }
  };

  const getRiskLevelClass = (riskLevel) => {
    if (!riskLevel) return 'unknown';
    return riskLevel.toLowerCase();
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="patient-list-container">
      <div className="page-header">
        <h1>All Patients</h1>
        <Link to="/patients/new" className="button primary">
          Add New Patient
        </Link>
      </div>

      {patients.length === 0 ? (
        <div className="no-patients">
          <p>No patients found.</p>
          <Link to="/patients/new" className="button primary">
            Add Your First Patient
          </Link>
        </div>
      ) : (
        <div className="patients-grid">
          {patients.map(patient => (
            <div key={patient._id} className="patient-card">
              <div className="patient-header">
                <h3>{patient.name}</h3>
                {patient.frailtyPrediction && (
                  <span className={`risk-badge ${getRiskLevelClass(patient.frailtyPrediction.riskLevel)}`}>
                    {patient.frailtyPrediction.riskLevel} Risk
                  </span>
                )}
              </div>
              
              <div className="patient-info">
                <p><strong>Patient ID:</strong> {patient.patientId || 'N/A'}</p>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {patient.email || 'N/A'}</p>
                <p><strong>Added:</strong> {new Date(patient.createdAt).toLocaleDateString()}</p>
                {patient.frailtyPrediction && (
                  <p><strong>Confidence:</strong> {(patient.frailtyPrediction.confidence * 100).toFixed(1)}%</p>
                )}
              </div>

              <div className="patient-actions">
                <Link to={`/patients/${patient._id}`} className="button small secondary">
                  View
                </Link>
                <Link to={`/patients/${patient._id}/edit`} className="button small primary">
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(patient._id)}
                  className="button small danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;