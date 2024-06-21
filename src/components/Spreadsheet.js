// components/Spreadsheet.js
import { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import styles from '../styles/Spreadsheet.module.css';
import Image from 'next/image';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Spreadsheet = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Spreadsheet component mounted');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/spreadsheet/fetch');
      console.log('API response:', response);
      const fetchedData = response.data;
      if (fetchedData.length > 0) {
        const allHeaders = Object.keys(fetchedData[0]);
        const specificHeaders = ['last_name', 'meter_serialNum'];
        const last10Headers = allHeaders.filter(header => !specificHeaders.includes(header)).slice(-10);
        const finalHeaders = [...specificHeaders, ...last10Headers];
        const finalData = fetchedData.map(row => {
          const newRow = {};
          finalHeaders.forEach(header => {
            newRow[header] = row[header];
          });
          return newRow;
        });
        setHeaders(finalHeaders);
        setData(finalData);
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
        const newHeaders = [...prevHeaders, newHeader].slice(-12);
        setData(data.map(row => ({ ...row, [newHeader]: '' })).map(row => {
          const newRow = {};
          newHeaders.forEach(header => {
            newRow[header] = row[header];
          });
          return newRow;
        }));
        return newHeaders;
      });
    }
  };

  const handleRemoveRow = (rowIndex) => {
    setData(data.filter((_, index) => index !== rowIndex));
  };

  const handleRemoveColumn = (column) => {
    setHeaders(headers.filter(header => header !== column));
    setData(data.map(row => {
      const { [column]: _, ...rest } = row;
      return rest;
    }));
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
      <Button variant="contained" startIcon={<AddBoxIcon />} onClick={handleAddRow}>Add Row</Button>
      <Button variant="contained" startIcon={<AddBoxIcon />} onClick={handleAddColumn}>Add Column</Button>
      <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>Save</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className={styles['table-container']}>
        <table className={styles.table}>
          <thead className={styles.thead} >
            <tr className={styles.tr} >
              {headers.map(header => (
                <th className={styles.th}  key={header}>
                  {header}
                  <Image src="/Images/delete.png" width="25" height="25" alt='Delete Icon' onClick={() => handleRemoveColumn(header)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr className={styles.tr}  key={rowIndex}>
                {headers.map(header => (
                  <td className={styles.td}  key={header}>
                    <TextField
                      value={row[header]}
                      onChange={(e) => handleInputChange(e, rowIndex, header)}
                      inputProps={{
                        style: {
                          color: 'white',
                          backgroundColor: 'blue',
                          border: 'none',
                          width: '100%',
                        },
                      }}
                    />
                  </td>
                ))}
                <td className={styles.td} >
                  <button variant="contained" startIcon={<DeleteForeverIcon />} onClick={() => handleRemoveRow(rowIndex)}>-</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Spreadsheet;
