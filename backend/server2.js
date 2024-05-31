const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");

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
    companyName VARCHAR(255) NOT NULL,
    contractOwner VARCHAR(255) NOT NULL,
    milestone VARCHAR(255) NOT NULL,
    startdate DATE NOT NULL,
    due DATE NOT NULL,
    remarks VARCHAR(255),
    selected BOOLEAN
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
    // Ensure dates are correctly formatted as strings
    const formattedResults = results.map(row => ({
      ...row,
      startdate: row.startdate.toISOString().split('T')[0],
      due: row.due.toISOString().split('T')[0]
    }));
    res.json(formattedResults);
  });
});

app.post('/table_data', (req, res) => {
  const { companyName, contractOwner, milestone, startdate, due, remarks, selected } = req.body;

  if (!companyName || !contractOwner || !milestone || !startdate || !due) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `INSERT INTO table_data (companyName, contractOwner, milestone, startdate, due, remarks, selected) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [companyName, contractOwner, milestone, startdate, due, remarks, selected], (err, result) => {
    if (err) {
      console.error('Error inserting row: ' + err.message);
      return res.status(500).json({ error: 'Error inserting row' });
    }
    res.json({ message: 'Row inserted successfully', id: result.insertId });
  });
});

app.put('/table_data/:id', (req, res) => {
  const { id } = req.params;
  const { companyName, contractOwner, milestone, startdate, due, remarks, selected } = req.body;

  const sql = `UPDATE table_data SET companyName = ?, contractOwner = ?, milestone = ?, startdate = ?, due = ?, remarks = ?, selected = ? WHERE id = ?`;

  db.query(sql, [companyName, contractOwner, milestone, startdate, due, remarks, selected, id], (err, result) => {
    if (err) {
      console.error('Error updating row: ' + err.message);
      return res.status(500).json({ error: 'Error updating row' });
    }
    res.json({ message: 'Row updated successfully' });
  });
});

app.delete('/table_data/:id', (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM table_data WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting row: ' + err.message);
      return res.status(500).json({ error: 'Error deleting row' });
    }
    res.json({ message: 'Row deleted successfully' });
  });
});

app.listen(8082, () => {
  console.log("Server is listening on port 8082");
});
