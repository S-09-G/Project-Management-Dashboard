import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Table from './Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import * as XLSX from 'xlsx';

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const plainTextPassword = '123456';

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController);

    return () => {
      abortController.abort();
    };
  }, []);

  const fetchData = async (abortController) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8082/table_data', { signal: abortController.signal });
      setData(response.data);
      setError(null);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationClick = (path) => {
    navigate(path);
  };

  const handleInputChange = (e, index, key) => {
    if (editMode) {
      const updatedData = [...data];
      updatedData[index][key] = e.target.value;
      setData(updatedData);
    }
  };

  const handleCheckboxChange = (e, index) => {
    if (editMode) {
      const updatedData = [...data];
      updatedData[index].reviewed = e.target.checked;
      setData(updatedData);
    }
  };

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const addRow = () => {
    if (editMode) {
      setData([
        ...data,
        {
          id: null,
          innovator: '',
          discChallenge: '',
          contractOwner: '',
          currentMilestone: '',
          lastMsClosureDate: '',
          remarks: '',
          reviewed: false
        }
      ]);
    }
  };

  const removeRow = async (index, id) => {
    if (editMode) {
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
    }
  };

  const handleSave = async () => {
    if (editMode) {
      setLoading(true);
      try {
        const promises = data.map(async (row) => {
          if (row.id) {
            await axios.put(`http://localhost:8082/table_data/${row.id}`, row);
          } else {
            await axios.post('http://localhost:8082/table_data', row);
          }
        });
        await Promise.all(promises);
        setError(null);
        console.log("Data saved:", data);
      } catch (error) {
        console.error('Error saving data:', error);
        setError('Failed to save data.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const filterAndSortData = useCallback(() => {
    let updatedData = [...data];

    // Filter data
    if (searchQuery) {
      updatedData = updatedData.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort data
    if (sortCriteria) {
      updatedData.sort((a, b) => {
        if (sortCriteria === 'reviewed') {
          if (a[sortCriteria] === b[sortCriteria]) return 0;
          return sortOrder === 'asc' ? (a[sortCriteria] ? -1 : 1) : (a[sortCriteria] ? 1 : -1);
        } else {
          if (a[sortCriteria] < b[sortCriteria]) return sortOrder === 'asc' ? -1 : 1;
          if (a[sortCriteria] > b[sortCriteria]) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }

    setFilteredData(updatedData);
  }, [data, searchQuery, sortCriteria, sortOrder]);

  useEffect(() => {
    filterAndSortData();
  }, [data, searchQuery, sortCriteria, sortOrder, filterAndSortData]);

  const handleEditClick = () => {
    setShowPasswordInput(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === plainTextPassword) {
      setEditMode(true);
      setShowPasswordInput(false);
      setPasswordError(null);
    } else {
      setPasswordError('Invalid password');
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
    XLSX.writeFile(workbook, 'table_data.xlsx');
  };

  return (
    <div className="container-fluid vh-100 bg-black">
      <div className="row">
        <div className="col-md-2 text-light py-4 d-flex flex-column justify-content-start sidebar">
          <img src={require('./images/iDEX-Final-Logo-03 (1).jpg')} alt="Logo" className="logo-effect" />
          <ul className="list-unstyled d-flex flex-column align-items-center justify-content-center menu">
            <li className="mb-2 w-100">
              <button className="btn btn-light text-dark px-4 py-2 rounded-3 w-100" onClick={() => handleNavigationClick('/home')}>
                Dashboard
              </button>
            </li>
            <li className="mb-2 w-100">
              <button className="btn btn-light text-dark px-4 py-2 rounded-3 w-100" onClick={() => handleNavigationClick('/analysis')}>
                Analytics
              </button>
            </li>
            <li className="mb-2 w-100">
              <button className="btn btn-light text-dark px-4 py-2 rounded-3 w-100" onClick={() => handleNavigationClick('/settings')}>
                Settings
              </button>
            </li>
          </ul>
        </div>
        <div className="col-md-10 bg-black">
          <div className="bg-black text-light py-4 main-content">
            <h1 className="display-3 bg-black text-light title" style={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              DASHBOARD
            </h1>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <input
                type="text"
                className="form-control w-25 me-2"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <select className="form-control w-25 me-2" value={sortCriteria} onChange={handleSortChange}>
                <option value="">Sort By</option>
                <option value="innovator">Innovator</option>
                <option value="discChallenge">DISC Challenge</option>
                <option value="contractOwner">Contract Owner</option>
                <option value="currentMilestone">Current Milestone</option>
                <option value="lastMsClosureDate">Last Date of MS Closure</option>
                <option value="reviewed">Reviewed</option>
              </select>
              <button className="btn btn-primary" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                {sortOrder === 'asc' ? 'Sort Asc' : 'Sort Desc'}
              </button>
              <button className="btn btn-primary me-2" onClick={exportToExcel}>Export to Excel</button>
              {editMode ? (
                <button className="btn btn-primary me-2" onClick={addRow}>Add Row</button>
              ) :
(
                <button className="btn btn-primary me-2" onClick={handleEditClick}>Edit</button>
              )}
            </div>
            {showPasswordInput && (
              <div className="d-flex justify-content-center mb-3">
                <form onSubmit={handlePasswordSubmit}>
                  <input
                    type="password"
                    className="form-control w-80 me-2 mb-2"
                    placeholder="Enter password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {passwordError && <p className="text-danger mb-2">{passwordError}</p>}
                  <button className="btn btn-primary d-block mx-auto" type="submit">Enter</button>
                </form>
              </div>
            )}

            {editMode ? (
              <Table
                data={filteredData}
                handleInputChange={handleInputChange}
                handleCheckboxChange={handleCheckboxChange}
                removeRow={removeRow}
                autoResizeTextarea={autoResizeTextarea}
              />
            ) : (
              <Table
                data={filteredData}
                handleInputChange={() => {}}
                handleCheckboxChange={() => {}}
                removeRow={() => {}}
                autoResizeTextarea={() => {}}
              />
            )}

            {editMode && (
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-primary me-2" onClick={handleSave}>Save</button>
              </div>
            )}
            {loading && <p className="text-center mt-3">Loading...</p>}
            {error && <p className="text-danger text-center mt-3">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
