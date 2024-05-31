const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Add this line for body parsing

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});

// Route handler for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to my application');
});
// Route handler for signing up
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please provide name, email, and password" });
    }

    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    const values = [name, email, password];

    // Execute the database query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: "An error occurred while signing up" });
        }

        console.log("Signup successful:", result);
        return res.status(200).json({ message: "Signup successful" });
    });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if all required fields are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }

    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    const values = [email, password];

    // Execute the database query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: "An error occurred while logging in" });
        }
        
        if (result.length > 0) {
            return res.json("success");
        } else {
            return res.json("failure");
        }
    });
});
// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
