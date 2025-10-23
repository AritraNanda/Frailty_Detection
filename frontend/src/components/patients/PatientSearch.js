import React, { useState } from 'react';
import { patientService } from '../../services/patientService';
import { Link } from 'react-router-dom';

const PatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await patientService.searchPatients(searchTerm);
      console.log('Search response:', response);
      
      // Handle response format (backend returns {success, count, data})
      const results = response.data?.data || response.data || [];
      setSearchResults(Array.isArray(results) ? results : []);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, patient ID, email, or phone..."
            className="input-field search-input"
          />
          <button type="submit" className="button primary search-button" disabled={loading}>
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
          {hasSearched && (
            <button 
              type="button" 
              className="button secondary search-button" 
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
                setHasSearched(false);
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {hasSearched && (
        <div className="search-results">
          <h4>Search Results ({searchResults.length})</h4>
          {searchResults.length > 0 ? (
            <div className="patient-cards">
              {searchResults.map(patient => (
                <div key={patient._id} className="patient-card">
                  <div className="patient-header">
                    <h5>{patient.name}</h5>
                    {patient.frailtyPrediction && (
                      <span className={`risk-badge ${patient.frailtyPrediction.riskLevel?.toLowerCase() || 'unknown'}`}>
                        {patient.frailtyPrediction.riskLevel} Risk
                      </span>
                    )}
                  </div>
                  <div className="patient-info">
                    <p><strong>Patient ID:</strong> {patient.patientId || 'N/A'}</p>
                    <p><strong>Age:</strong> {patient.age} | <strong>Gender:</strong> {patient.gender}</p>
                    <p><strong>Email:</strong> {patient.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                    {patient.frailtyPrediction && (
                      <p><strong>Confidence:</strong> {(patient.frailtyPrediction.confidence * 100).toFixed(1)}%</p>
                    )}
                  </div>
                  <div className="patient-actions">
                    <Link to={`/patients/${patient._id}`} className="button small secondary">
                      View Details
                    </Link>
                    <Link to={`/patients/${patient._id}/edit`} className="button small primary">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">No patients found matching "{searchTerm}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;