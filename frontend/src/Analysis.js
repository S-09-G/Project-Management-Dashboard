import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Analysis.css'; // Import the CSS file

function Analysis() {
  const [totalRows, setTotalRows] = useState(0);
  const [reviewedRows, setReviewedRows] = useState(0);
  const [milestoneCounts, setMilestoneCounts] = useState({});
  const [ownerMilestoneCounts, setOwnerMilestoneCounts] = useState({});
  const [selectedOwner, setSelectedOwner] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8082/table_data');
      const data = response.data;
      setTotalRows(data.length);
      const reviewedCount = data.filter(row => row.reviewed).length;
      setReviewedRows(reviewedCount);

      const milestoneCounts = data.reduce((acc, row) => {
        acc[row.currentMilestone] = (acc[row.currentMilestone] || 0) + 1;
        return acc;
      }, {});
      setMilestoneCounts(milestoneCounts);

      const ownerMilestoneCounts = data.reduce((acc, row) => {
        const owner = row.contractOwner;
        const milestone = row.currentMilestone;
        if (!acc[owner]) acc[owner] = {};
        acc[owner][milestone] = (acc[owner][milestone] || 0) + 1;
        return acc;
      }, {});
      setOwnerMilestoneCounts(ownerMilestoneCounts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculatePercentage = (value, total) => {
    return total !== 0 ? ((value / total) * 100).toFixed(2) : 0;
  };

  const handleOwnerChange = (e) => {
    setSelectedOwner(e.target.value);
  };

  return (
    <div className="analysis-container">
      <div className="analysis-box">
        <h2 className="analysis-header">Overall Analysis</h2>
        <div className="analysis-stat">
          <span className="analysis-stat-label">Total Number of Cases:</span>
          <span className="analysis-stat-value">{totalRows}</span>
        </div>
        <div className="analysis-stat">
          <span className="analysis-stat-label">Total Number of Reviewed Cases:</span>
          <span className="analysis-stat-value">{reviewedRows}</span>
        </div>
        <div className="analysis-stat">
          <span className="analysis-stat-label">Percentage of Reviewed Cases:</span>
          <span className="analysis-stat-value">{calculatePercentage(reviewedRows, totalRows)}%</span>
        </div>
      </div>

      <div className="analysis-box">
        <h2 className="analysis-subheader">Milestone Analysis</h2>
        {Object.keys(milestoneCounts).map(milestone => (
          <div className="analysis-stat" key={milestone}>
            <span className="analysis-stat-label">{`Milestone ${milestone}:`}</span>
            <span className="analysis-stat-value">{milestoneCounts[milestone]}</span>
            <span className="analysis-stat-percentage">
              ({calculatePercentage(milestoneCounts[milestone], totalRows)}%)
            </span>
          </div>
        ))}
      </div>

      <div className="analysis-box">
        <h2 className="analysis-subheader">Contract Owner Analysis</h2>
        <div className="dropdown-container">
          <select onChange={handleOwnerChange} value={selectedOwner}>
            <option value="">Select Contract Owner</option>
            {Object.keys(ownerMilestoneCounts).map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>
        </div>

        {selectedOwner && (
          <div className="analysis-details">
            <h3 className="analysis-subheader">{selectedOwner}</h3>
            <div className="analysis-stat">
              <span className="analysis-stat-label">Total Cases:</span>
              <span className="analysis-stat-value">
                {Object.values(ownerMilestoneCounts[selectedOwner]).reduce((a, b) => a + b, 0)}
              </span>
            </div>
            {Object.keys(ownerMilestoneCounts[selectedOwner]).map(milestone => (
              <div className="analysis-stat" key={milestone}>
                <span className="analysis-stat-label">{`Milestone ${milestone}:`}</span>
                <span className="analysis-stat-value">{ownerMilestoneCounts[selectedOwner][milestone]}</span>
                <span className="analysis-stat-percentage">
                  ({calculatePercentage(ownerMilestoneCounts[selectedOwner][milestone], Object.values(ownerMilestoneCounts[selectedOwner]).reduce((a, b) => a + b, 0))}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Analysis;
