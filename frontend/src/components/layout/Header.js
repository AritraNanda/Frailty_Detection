import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Header.css';

const Header = () => {
  const { doctor, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/dashboard" className="logo">
            <h1>Frailty Detection System</h1>
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/patients" className="nav-link">Patients</Link>
          <Link to="/patients/new" className="nav-link">Add Patient</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        <div className="header-right">
          <span className="doctor-info">Dr. {doctor?.name || 'Doctor'}</span>
          <button onClick={handleLogout} className="button logout-button">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;