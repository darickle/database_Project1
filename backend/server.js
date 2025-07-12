// Imports and Middleware Setup
const express = require('express');         // Web framework
const mysql = require('mysql');             // MySQL driver
const cors = require('cors');               // Cross-origin support
const app = express();                      // Initialize Express app

app.use(cors());                            // Allow cross-origin requests from frontend
app.use(express.json());                    // Parse incoming JSON payloads

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} request for '${req.url}'`);
  next();
});

// MySQL Database Configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookstore", // Name of database
  port: 3306
});

// Test DB Connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// GET /
// Welcome route
app.get('/', (req, res) => {
  res.json("Welcome to the Bookstore Inventory API");
});

// GET /books
// Fetch all books
app.get('/books', (req, res) => {
  const sql = "SELECT * FROM books";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

// GET /books/search/:title
// Search books by title
app.get('/books/search/:title', (req, res) => {
  const title = req.params.title;
  const sql = "SELECT * FROM books WHERE title LIKE ?";
  db.query(sql, [`%${title}%`], (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
});

// POST /books
// Add a new book
app.post('/books', (req, res) => {
  const { title, isbn, price, publication_year, stock, author_name, category } = req.body;
  
  if (!title || !isbn || !price || !publication_year || stock === undefined) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  const sql = `
    INSERT INTO books (title, isbn, price, publication_year, stock, author_name, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, isbn, price, publication_year, stock, author_name || '', category || ''], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({ message: "Book added successfully", bookId: result.insertId });
  });
});

// PUT /books/:id
// Update book details by ID
app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, isbn, price, publication_year, stock, author_name, category } = req.body;

  const sql = `
    UPDATE books SET title = ?, isbn = ?, price = ?, publication_year = ?, stock = ?, author_name = ?, category = ?
    WHERE id = ?
  `;

  db.query(sql, [title, isbn, price, publication_year, stock, author_name, category, bookId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Book not found" });
    return res.json({ message: "Book updated successfully" });
  });
});

// DELETE /books/:id
// Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;

  const sql = "DELETE FROM books WHERE id = ?";
  db.query(sql, [bookId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Book not found" });
    return res.json({ message: "Book deleted successfully" });
  });
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});