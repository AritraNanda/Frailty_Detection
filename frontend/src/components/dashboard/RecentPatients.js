import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const RecentPatients = ({ doctorId }) => {
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPatients();
  }, [doctorId]);

  const fetchRecentPatients = async () => {
    try {
      const response = await patientService.getRecentPatients(doctorId);
      console.log('Recent patients response:', response);
      
      // Handle response format (backend returns {success, count, data})
      const patientsData = response.data?.data || response.data || [];
      setRecentPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (error) {
      console.error('Error fetching recent patients:', error);
      setRecentPatients([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading recent patients...</div>;
  }

  return (
    <div className="recent-patients">
      {recentPatients.length > 0 ? (
        <>
          <div className="patient-list">
            {recentPatients.map((patient, index) => (
              <div key={patient._id} className="patient-item">
                <div className="patient-number">
                  {index + 1}
                </div>
                <div className="patient-info">
                  <h4>{patient.name}</h4>
                  <div className="patient-details">
                    <span className="patient-id">ID: {patient.patientId || 'N/A'}</span>
                    <span className="separator">•</span>
                    <span>Age: {patient.age}</span>
                    <span className="separator">•</span>
                    <span className="added-date">
                      {new Date(patient.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {patient.frailtyPrediction && (
                    <span className={`risk-badge ${patient.frailtyPrediction.riskLevel?.toLowerCase() || 'unknown'}`}>
                      {patient.frailtyPrediction.riskLevel} Risk
                    </span>
                  )}
                </div>
                <Link to={`/patients/${patient._id}`} className="button small secondary">
                  View
                </Link>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/patients" className="button secondary">
              View All Patients →
            </Link>
          </div>
        </>
      ) : (
        <p className="no-patients">No recent patients found.</p>
      )}
    </div>
  );
};

export default RecentPatients;