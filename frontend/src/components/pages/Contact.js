import React, { useState } from 'react';
import '../../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We're here to help. Get in touch with our support team.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Have questions about the Frailty Detection System? Need technical support? 
            Our team is ready to assist you.
          </p>

          <div className="info-section">
            <div className="info-item">
              <h3>📍 Address</h3>
              <p>
                Healthcare Technology Center<br />
                123 Medical District<br />
                Health City, HC 12345
              </p>
            </div>

            <div className="info-item">
              <h3>📞 Phone</h3>
              <p>
                Main: +1 (555) 123-4567<br />
                Support: +1 (555) 123-4568<br />
                Toll-free: 1-800-FRAILTY
              </p>
            </div>

            <div className="info-item">
              <h3>✉️ Email</h3>
              <p>
                General: info@frailtydetection.com<br />
                Support: support@frailtydetection.com<br />
                Sales: sales@frailtydetection.com
              </p>
            </div>

            <div className="info-item">
              <h3>🕐 Business Hours</h3>
              <p>
                Monday - Friday: 8:00 AM - 6:00 PM<br />
                Saturday: 9:00 AM - 2:00 PM<br />
                Sunday: Closed<br />
                <em>24/7 Emergency Support Available</em>
              </p>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {submitted && (
            <div className="success-message">
              ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
            </div>
          )}
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Dr. John Smith"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@hospital.com"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="How can we help you?"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Please describe your inquiry or issue..."
                className="input-field"
              />
            </div>

            <button type="submit" className="button primary submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do I get started?</h3>
            <p>Simply enter your employee ID on the login page to begin using the system.</p>
          </div>
          <div className="faq-item">
            <h3>Is my patient data secure?</h3>
            <p>Yes, all data is encrypted and stored securely in compliance with healthcare regulations.</p>
          </div>
          <div className="faq-item">
            <h3>Can I export patient data?</h3>
            <p>Data export features are available through the patient details page.</p>
          </div>
          <div className="faq-item">
            <h3>How accurate is the frailty assessment?</h3>
            <p>Our ML model has been trained on comprehensive medical datasets with high accuracy rates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
