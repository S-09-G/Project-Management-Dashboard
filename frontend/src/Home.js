import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import './Home.css'; // Import your CSS file

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8082/table_data');
      setData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDashboardClick = () => {
    navigate('/home');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleAnalyticsClick = () => {
    navigate('/analysis');
  };

  const handleInputChange = (e, index, key) => {
    const updatedData = [...data];
    if (key === 'selected') {
      updatedData[index][key] = e.target.checked;
    } else {
      updatedData[index][key] = e.target.value;
    }
    setData(updatedData);
  };

  const addRow = () => {
    setData([
      ...data,
      {
        id: data.length + 1,
        companyName: '',
        contractOwner: '',
        milestone: '',
        startdate: '',
        due: '',
        remarks: '',
        selected: false
      }
    ]);
  };

  const removeRow = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const row of data) {
        await axios.post('http://localhost:8082/table_data', row);
      }
      setError(null);
      console.log("Data saved:", data);
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Failed to save data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 bg-white">
      <div className="row">
        <div className="col-md-2 text-light py-4 d-flex flex-column justify-content-start sidebar">
          {/* Logo Section */}
          <img src={require('./images/iDEX-Final-Logo-03 (1).jpg')} alt="Logo" className="img-fluid mb-4 logo" />
          <ul className="list-unstyled d-flex flex-column align-items-center justify-content-center menu">
            <li className="mb-2 w-100">
              <button className="btn btn-light text-primary px-4 py-2 rounded-3 border border-dark w-100" onClick={handleDashboardClick}>
                Dashboard
              </button>
            </li>
            <li className="mb-2 w-100">
              <button className="btn btn-light text-primary px-4 py-2 rounded-3 border border-dark w-100" onClick={handleAnalyticsClick}>
                Analytics
              </button>
            </li>
            <li className="mb-2 w-100">
              <button className="btn btn-light text-primary px-4 py-2 rounded-3 border border-dark w-100" onClick={handleSettingsClick}>
                Settings
              </button>
            </li>
          </ul>
        </div>
        <div className="col-md-10">
          <div className="bg-dark text-light py-4 main-content">
            <h1 className="display-3 bg-dark text-light title"style={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              DASHBOARD
            </h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover table-sm">
                <thead className="table-header">
                  <tr>
                    <th>S.No</th>
                    <th>Name of the Company</th>
                    <th>Contract Owner</th>
                    <th>Milestone</th>
                    <th>Start Date</th>
                    <th>Due</th>
                    <th>Select</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>
                        <input type="text" value={item.companyName} onChange={(e) => handleInputChange(e, index, 'companyName')} />
                      </td>
                      <td>
                        <input type="text" value={item.contractOwner} onChange={(e) => handleInputChange(e, index, 'contractOwner')} />
                      </td>
                      <td>
                        <input type="text" value={item.milestone} onChange={(e) => handleInputChange(e, index, 'milestone')} />
                      </td>
                      <td>
                        <input type="date" value={item.startdate} onChange={(e) => handleInputChange(e, index, 'startdate')} />
                      </td>
                      <td>
                        <input type="date" value={item.due} onChange={(e) => handleInputChange(e, index, 'due')} />
                      </td>
                      <td>
                        <input type="checkbox" checked={item.selected} onChange={(e) => handleInputChange(e, index, 'selected')} />
                      </td>
                      <td>
                        <textarea value={item.remarks} onChange={(e) => handleInputChange(e, index, 'remarks')} />
                      </td>
                      <td>
                        <button onClick={() => removeRow(index)} className="btn btn-danger">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addRow} className="btn btn-primary">
              Add Row
            </button>
            <button onClick={handleSave} className="btn btn-primary ms-3">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
