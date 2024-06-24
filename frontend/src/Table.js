import React from 'react';
import * as XLSX from 'xlsx';

function Table({ data, handleInputChange, removeRow, autoResizeTextarea, handleCheckboxChange }) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
    XLSX.writeFile(workbook, 'table_data.xlsx');
  };

  return (
    <div className="table-responsive">
      <table id="table" className="table table-dark table-striped">
        <thead>
          <tr>
            <th>S.No</th>
            <th>IDEX Innovator</th>
            <th>DISC Challenge</th>
            <th>Contract Owner</th>
            <th>Current Milestone</th>
            <th>Last Date of MS Closure</th>
            <th className="remarks-column">Remarks/Action</th>
            <th>Reviewed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <textarea
                  value={row.innovator}
                  onChange={(e) => handleInputChange(e, index, 'innovator')}
                  onInput={(e) => autoResizeTextarea(e.target)}
                  placeholder="Innovator"
                />
              </td>
              <td>
                <textarea
                  value={row.discChallenge}
                  onChange={(e) => handleInputChange(e, index, 'discChallenge')}
                  onInput={(e) => autoResizeTextarea(e.target)}
                  placeholder="DISC Challenge"
                />
              </td>
              <td>
                <textarea
                  value={row.contractOwner}
                  onChange={(e) => handleInputChange(e, index, 'contractOwner')}
                  onInput={(e) => autoResizeTextarea(e.target)}
                  placeholder="Contract Owner"
                />
              </td>
              <td>
                <textarea
                  value={row.currentMilestone}
                  onChange={(e) => handleInputChange(e, index, 'currentMilestone')}
                  onInput={(e) => autoResizeTextarea(e.target)}
                  placeholder="Current Milestone"
                />
              </td>
              <td>
                <input
                  type="date"
                  value={row.lastMsClosureDate}
                  onChange={(e) => handleInputChange(e, index, 'lastMsClosureDate')}
                />
              </td>
              <td className="remarks-column">
                <textarea
                  value={row.remarks}
                  onChange={(e) => handleInputChange(e, index, 'remarks')}
                  onInput={(e) => autoResizeTextarea(e.target)}
                  placeholder="Remarks"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={row.reviewed}
                  onChange={(e) => handleCheckboxChange(e, index)}
                />
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => removeRow(index, row.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-primary" onClick={exportToExcel}>Export to Excel</button>
      </div>
    </div>
  );
}

export default Table;
