import React from 'react';

const Table = ({ data, handleInputChange, removeRow, autoResizeTextarea }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered table-hover table-sm" style={{ tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '5%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '9%' }} />
          <col className="remarks-column" />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead className="table-header">
          <tr>
            <th className="text-align">S.No</th>
            <th className="text-align">Name of the Company</th>
            <th className="text-align">Contract Owner</th>
            <th className="text-align">Milestone</th>
            <th className="text-align">Start Date</th>
            <th className="text-align">Due</th>
            <th className="text-align">Select</th>
            <th className="remarks-column text-align">Remarks</th>
            <th className="text-align">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#fff' }}>
              <td className="text-align">{index + 1}</td>
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
              <td className="text-align">
                <input type="checkbox" className="form-check-input" checked={item.selected} onChange={(e) => handleInputChange(e, index, 'selected')} />
              </td>
              <td>
                <textarea className="form-control remarks-textarea" value={item.remarks} onChange={(e) => handleInputChange(e, index, 'remarks')} onFocus={(e) => autoResizeTextarea(e.target)} />
              </td>
              <td className="text-align">
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
