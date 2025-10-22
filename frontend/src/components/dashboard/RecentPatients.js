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
      setRecentPatients(response.data);
    } catch (error) {
      console.error('Error fetching recent patients:', error);
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
        <div className="patient-list">
          {recentPatients.map(patient => (
            <div key={patient._id} className="patient-item">
              <div className="patient-info">
                <h4>{patient.name}</h4>
                <p>Age: {patient.age} | Added: {new Date(patient.createdAt).toLocaleDateString()}</p>
                {patient.frailtyPrediction && (
                  <span className={`risk-badge ${patient.frailtyPrediction.riskLevel.toLowerCase()}`}>
                    {patient.frailtyPrediction.riskLevel} Risk
                  </span>
                )}
              </div>
              <Link to={`/patients/${patient._id}`} className="button small">
                View
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No recent patients found.</p>
      )}
    </div>
  );
};

export default RecentPatients;