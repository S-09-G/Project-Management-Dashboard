const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tables"
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS table_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    innovator VARCHAR(255) NOT NULL,
    discChallenge VARCHAR(255) NOT NULL,
    contractOwner VARCHAR(255) NOT NULL,
    currentMilestone VARCHAR(255) NOT NULL,
    lastMsClosureDate DATE NOT NULL,
    remarks VARCHAR(255),
    reviewed BOOLEAN DEFAULT FALSE,
    UNIQUE (innovator, discChallenge, contractOwner, currentMilestone, lastMsClosureDate)
  )
`;

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database');

  connection.query(createTableQuery, err => {
    connection.release();
    if (err) {
      console.error('Error creating table: ' + err.message);
    } else {
      console.log('Table created successfully');
    }
  });
});

app.get("/", (req, res) => {
  res.json("backend");
});

app.get('/table_data', (req, res) => {
  const sql = 'SELECT * FROM table_data';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.message);
      return res.status(500).json({ error: 'Error fetching data' });
    }
    const formattedResults = results.map(row => ({
      ...row,
      lastMsClosureDate: row.lastMsClosureDate.toISOString().slice(0, 10)
    }));
    res.json(formattedResults);
  });
});

app.post('/table_data', (req, res) => {
  const { innovator, discChallenge, contractOwner, currentMilestone, lastMsClosureDate, remarks, reviewed } = req.body;

  if (!innovator || !discChallenge || !contractOwner || !currentMilestone || !lastMsClosureDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  console.log('Received request body:', req.body);

  // Check if a similar record already exists
  const checkSql = `SELECT * FROM table_data WHERE innovator = ? AND discChallenge = ? AND contractOwner = ? AND currentMilestone = ? AND lastMsClosureDate = ?`;
  db.query(checkSql, [innovator, discChallenge, contractOwner, currentMilestone, lastMsClosureDate], (err, results) => {
    if (err) {
      console.error('Error checking existing record: ', err);
      return res.status(500).json({ error: 'Error checking existing record' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'A similar record already exists' });
    }

    // Insert the new record if no similar record exists
    const insertSql = `INSERT INTO table_data (innovator, discChallenge, contractOwner, currentMilestone, lastMsClosureDate, remarks, reviewed) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(insertSql, [innovator, discChallenge, contractOwner, currentMilestone, lastMsClosureDate, remarks, reviewed || false], (err, result) => {
      if (err) {
        console.error('Error inserting row: ', err);
        return res.status(500).json({ error: 'Error inserting row' });
      }
      console.log('Row inserted successfully, ID:', result.insertId);
      res.json({ message: 'Row inserted successfully', id: result.insertId });
    });
  });
});

app.put('/table_data/:id', (req, res) => {
  const { id } = req.params;
  const { innovator, discChallenge, contractOwner, currentMilestone, lastMsClosureDate, remarks, reviewed } = req.body;

  console.log('Received request body:', req.body);

  const sql = `UPDATE table_data SET innovator = ?, discChallenge = ?, contractOwner = ?, currentMilestone = ?, lastMsClosureDate = ?, remarks = ?, reviewed = ? WHERE id = ?`;
  db.query(sql, [innovator, discChallenge, contractOwner, currentMilestone, lastMsClosureDate, remarks, reviewed || false, id], (err, result) => {
    if (err) {
      console.error('Error updating row: ', err);
      return res.status(500).json({ error: 'Error updating row' });
    }
    console.log('Row updated successfully');
    res.json({ message: 'Row updated successfully' });
  });
});

app.delete('/table_data/:id', (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM table_data WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting row: ', err);
      return res.status(500).json({ error: 'Error deleting row' });
    }
    console.log('Row deleted successfully');
    res.json({ message: 'Row deleted successfully' });
  });
});

app.listen(8082, () => {
  console.log("Server is listening on port 8082");
});
