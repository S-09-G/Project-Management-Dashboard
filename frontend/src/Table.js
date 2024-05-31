import React from 'react';

const Table = ({ data, handleInputChange, removeRow, autoResizeTextarea }) => {
  return (
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
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input type="text" className="form-control" value={item.companyName} onChange={(e) => handleInputChange(e, index, 'companyName')} />
              </td>
              <td>
                <input type="text" className="form-control" value={item.contractOwner} onChange={(e) => handleInputChange(e, index, 'contractOwner')} />
              </td>
              <td>
                <input type="text" className="form-control" value={item.milestone} onChange={(e) => handleInputChange(e, index, 'milestone')} />
              </td>
              <td>
                <input type="date" className="form-control" value={item.startdate} onChange={(e) => handleInputChange(e, index, 'startdate')} />
              </td>
              <td>
                <input type="date" className="form-control" value={item.due} onChange={(e) => handleInputChange(e, index, 'due')} />
              </td>
              <td>
                <input type="checkbox" className="form-check-input" checked={item.selected} onChange={(e) => handleInputChange(e, index, 'selected')} />
              </td>
              <td>
                <textarea className="form-control" value={item.remarks} onChange={(e) => handleInputChange(e, index, 'remarks')} onFocus={(e) => autoResizeTextarea(e.target)} />
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => removeRow(index, item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
