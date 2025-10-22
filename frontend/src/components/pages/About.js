import React from 'react';
import '../../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Frailty Detection System</h1>
        <p className="subtitle">Advanced Healthcare Technology for Better Patient Care</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            The Frailty Detection System is designed to assist healthcare professionals in 
            identifying and managing frailty in elderly patients. Our mission is to provide 
            doctors with advanced tools to improve patient outcomes through early detection 
            and comprehensive assessment.
          </p>
        </section>

        <section className="about-section">
          <h2>What is Frailty?</h2>
          <p>
            Frailty is a clinical syndrome characterized by decreased reserve and resistance 
            to stressors, resulting from cumulative decline across multiple physiological 
            systems. It increases vulnerability to adverse health outcomes including falls, 
            hospitalization, disability, and mortality.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Technology</h2>
          <p>
            Our system uses advanced machine learning algorithms to analyze multiple health 
            parameters including:
          </p>
          <ul className="feature-list">
            <li>Physical measurements and vital signs</li>
            <li>Cognitive and mobility assessments</li>
            <li>Medical history and current medications</li>
            <li>Lifestyle factors and social support</li>
            <li>Functional independence levels</li>
          </ul>
          <p>
            By analyzing these comprehensive data points, our system provides accurate 
            frailty risk assessments to help doctors make informed clinical decisions.
          </p>
        </section>

        <section className="about-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🏥 Easy Data Entry</h3>
              <p>Intuitive forms for quick and accurate patient data collection</p>
            </div>
            <div className="feature-card">
              <h3>🤖 ML Predictions</h3>
              <p>Advanced algorithms for reliable frailty risk assessment</p>
            </div>
            <div className="feature-card">
              <h3>🔍 Smart Search</h3>
              <p>Quickly find and access patient records</p>
            </div>
            <div className="feature-card">
              <h3>📊 Dashboard Analytics</h3>
              <p>Visual insights into patient population and risk levels</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Benefits for Healthcare Professionals</h2>
          <ul className="benefit-list">
            <li>✓ Early identification of at-risk patients</li>
            <li>✓ Streamlined patient assessment workflow</li>
            <li>✓ Comprehensive patient history tracking</li>
            <li>✓ Data-driven clinical decision support</li>
            <li>✓ Improved care coordination and planning</li>
            <li>✓ Time-efficient documentation</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Commitment</h2>
          <p>
            We are committed to continuous improvement and innovation in healthcare technology. 
            Our team works closely with medical professionals to ensure our system meets the 
            evolving needs of clinical practice while maintaining the highest standards of 
            data security and patient privacy.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
