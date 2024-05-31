import React from 'react';

const TableRow = ({ item, index, handleInputChange, removeRow, autoResizeTextarea }) => (
  <tr>
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
      <textarea
        value={item.remarks}
        onChange={(e) => handleInputChange(e, index, 'remarks')}
        onInput={(e) => autoResizeTextarea(e.target)}
        style={{ height: 'auto', width: '100%' }}
      />
    </td>
    <td>
      <button onClick={() => removeRow(index, item.id)} className="btn btn-danger">
        Remove
      </button>
    </td>
  </tr>
);

export default TableRow;
