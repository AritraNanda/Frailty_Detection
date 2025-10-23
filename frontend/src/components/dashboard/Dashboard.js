import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import RecentPatients from './RecentPatients';
import PatientSearch from '../patients/PatientSearch';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const { doctor } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    recentPatients: 0,
    highRiskPatients: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await patientService.getDashboardStats(doctor.id);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, Dr. {doctor?.name || 'Doctor'}</h1>
        <p>Frailty Detection Dashboard</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.totalPatients}</h3>
          <p>Total Patients</p>
        </div>
        <div className="stat-card">
          <h3>{stats.recentPatients}</h3>
          <p>Recent Patients</p>
        </div>
        <div className="stat-card">
          <h3>{stats.highRiskPatients}</h3>
          <p>High Risk Patients</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/patients/new" className="button primary">
          Add New Patient
        </Link>
        <Link to="/patients" className="button secondary">
          View All Patients
        </Link>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Search Patients</h2>
          <PatientSearch />
        </div>

        <div className="dashboard-section">
          <h2>Recent Patients</h2>
          <RecentPatients doctorId={doctor.id} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;