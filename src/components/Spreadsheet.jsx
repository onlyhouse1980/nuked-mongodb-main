import { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import styles from '../styles/Spreadsheet.module.css';

const Spreadsheet = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState(['last_name', 'meter_serialNum', 'lot_number', 'feb01_25', 'apr01_25', 'jun01_25', 'last_name']);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/spreadsheet/fetch');
      const fetchedData = response.data;

      if (fetchedData.length > 0) {
        const allHeaders = Object.keys(fetchedData[0]);
        setHeaders(allHeaders);
        setData(fetchedData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data');
    }
  };

  const handleAddRow = () => {
    setData([...data, headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {})]);
  };

  const handleAddColumn = () => {
    const newHeader = prompt('Enter column name:');
    if (newHeader) {
      setHeaders(prevHeaders => {
        const newHeaders = [...prevHeaders, newHeader];
        setVisibleColumns([...visibleColumns, newHeader]); // Make new column visible by default
        setData(data.map(row => ({ ...row, [newHeader]: '' })));
        return newHeaders;
      });
    }
  };

  const handleRemoveRow = (rowIndex) => {
    setData(data.filter((_, index) => index !== rowIndex));
  };

  const handleHideColumn = (column) => {
    setVisibleColumns(visibleColumns.filter(header => header !== column));
  };

  const handleRemoveColumn = (column) => {
    // Remove column from visibility without deleting it from data
    setVisibleColumns(visibleColumns.filter(header => header !== column));
  };

  const handleInputChange = (e, rowIndex, column) => {
    const newData = [...data];
    newData[rowIndex][column] = e.target.value;
    setData(newData);
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/spreadsheet/update', { data });
      alert('Data saved successfully');
    } catch (err) {
      console.error('Error saving data:', err);
      setError('Error saving data');
    }
  };

  return (
    <div>
      <div>
        <Button variant="contained" startIcon={<AddBoxIcon />} onClick={handleAddRow}>Add Row</Button>
        <Button variant="contained" startIcon={<AddBoxIcon />} onClick={handleAddColumn}>Add Column</Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>Save</Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="scroll-container">
        <style jsx>{`
          .scroll-container {
            overflow-x: auto;
            max-width: 100%;
          }
          table {
            min-width: 1200px;
            white-space: nowrap;
          }
        `}</style>

        <div className={styles['table-container']}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.tr}>
                {visibleColumns.map(header => (
                  <th className={styles.th} key={header}>
                    {header}
                    <IconButton aria-label="hide" color="secondary" onClick={() => handleHideColumn(header)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr className={styles.tr} key={rowIndex}>
                  {visibleColumns.map(header => (
                    <td className={styles.td} key={header}>
                      <TextField
                        value={row[header] || ''}
                        onChange={(e) => handleInputChange(e, rowIndex, header)}
                        inputProps={{
                          style: { color: 'white', backgroundColor: 'blue', border: 'none', width: '75px' },
                        }}
                      />
                    </td>
                  ))}
                  <td className={styles.td}>
                    <IconButton aria-label="delete" color="error" onClick={() => handleRemoveRow(rowIndex)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
