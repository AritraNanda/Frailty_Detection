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
      setSearchResults(response.data);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelClass = (riskLevel) => {
    return `risk-level ${riskLevel?.toLowerCase() || 'unknown'}`;
  };

  return (
    <div className="patient-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name..."
            className="input-field search-input"
          />
          <button type="submit" className="button search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {hasSearched && (
        <div className="search-results">
          <h4>Search Results ({searchResults.length})</h4>
          {searchResults.length > 0 ? (
            <div className="patient-cards">
              {searchResults.map(patient => (
                <div key={patient._id} className="patient-card">
                  <div className="patient-info">
                    <h5>{patient.name}</h5>
                    <p>Age: {patient.age} | Gender: {patient.gender}</p>
                    {patient.frailtyPrediction && (
                      <div className={getRiskLevelClass(patient.frailtyPrediction.riskLevel)}>
                        Risk: {patient.frailtyPrediction.riskLevel}
                      </div>
                    )}
                  </div>
                  <div className="patient-actions">
                    <Link to={`/patients/${patient._id}`} className="button small">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No patients found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;