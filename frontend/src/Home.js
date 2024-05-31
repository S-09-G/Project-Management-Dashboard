import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Table from './Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

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
      if (key === 'remarks') {
        autoResizeTextarea(e.target);
      }
    }
    setData(updatedData);
  };

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const addRow = () => {
    setData([
      ...data,
      {
        id: null,
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

  const removeRow = async (index, id) => {
    if (id) {
      try {
        await axios.delete(`http://localhost:8082/table_data/${id}`);
      } catch (error) {
        console.error('Error deleting row:', error);
        setError('Failed to delete row.');
        return;
      }
    }
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const row of data) {
        if (row.id) {
          await axios.put(`http://localhost:8082/table_data/${row.id}`, row);
        } else {
          await axios.post('http://localhost:8082/table_data', row);
        }
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
    <div className="container-fluid vh-100 bg-black">
      <div className="row">
        <div className="col-md-2 text-light py-4 d-flex flex-column justify-content-start sidebar">
          <img src={require('./images/iDEX-Final-Logo-03 (1).jpg')} alt="Logo" className="img-fluid mb-4 logo" />
          <ul className="list-unstyled d-flex flex-column align-items-center justify-content-center menu">
            <li className="mb-2 w-100">
              <button className="btn btn-light text-dark px-4 py-2 rounded-3 border border-dark w-100" onClick={handleDashboardClick}>
                Dashboard
              </button>
            </li>
            <li className="mb-2 w-100">
              <button className="btn btn-light text-dark px-4 py-2 rounded-3 border border-dark w-100" onClick={handleAnalyticsClick}>
                Analytics
              </button>
            </li>
            <li className="mb-2 w-100">
              <button className="btn btn-light text-dark px-4 py-2 rounded-3 border border-dark w-100" onClick={handleSettingsClick}>
                Settings
              </button>
            </li>
          </ul>
        </div>
        <div className="col-md-10 bg-black">
          <div className="bg-black text-light py-4 main-content">
            <h1 className="display-3 bg-dark text-light title" style={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              DASHBOARD
            </h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            <Table
              data={data}
              handleInputChange={handleInputChange}
              removeRow={removeRow}
              autoResizeTextarea={autoResizeTextarea}
            />
              <button onClick={addRow} className="btn btn-primary me-1 ms-4">
                Add Row
              </button>
              <button onClick={handleSave} className="btn btn-primary">
                Save
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
