import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Frailty Detection System</h3>
                    <p>Advanced healthcare technology for better patient care and frailty assessment.</p>
                </div>
                
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/patients">Patients</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h4>Contact Info</h4>
                    <ul className="footer-contact">
                        <li>📞 +1 (555) 123-4567</li>
                        <li>✉️ info@frailtydetection.com</li>
                        <li>📍 Health City, HC 12345</li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h4>Support</h4>
                    <ul className="footer-links">
                        <li><a href="#help">Help Center</a></li>
                        <li><a href="#docs">Documentation</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Frailty Detection System. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;