# Bookstore Inventory Management System

A full-stack web application for managing BookNest's inventory, built with MySQL, Express, React, and Node.js.

## Features

- **Add New Books**: Create new book entries with title, ISBN, author, price, publication year, stock, and category
- **Edit Books**: Update existing book information
- **Delete Books**: Remove books from the inventory
- **Search Books**: Search for books by title
- **View Inventory**: Display all books in a formatted table

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and development server
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Database
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MySQL** (v8.0 or higher)
- **Git** (for version control)

## Database Setup

1. **Start MySQL** service on your machine
2. **Create a database** named `BookNest`:
   ```sql
   CREATE DATABASE BookNest;
   ```
3. **Create the books table**:
   ```sql
   USE BookNest;
   
   CREATE TABLE books (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     isbn VARCHAR(20) NOT NULL UNIQUE,
     author_name VARCHAR(255) NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     publication_year INT NOT NULL,
     stock INT NOT NULL DEFAULT 0,
     category VARCHAR(100),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

## Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:darickle/database_Project1.git
   cd database_Project1
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

1. **Configure database connection** in `backend/server.js`:
   ```javascript
   const db = mysql.createConnection({
     host: "localhost",
     user: "root",        // Your MySQL username
     password: "",        // Your MySQL password
     database: "BookNest",
     port: 3306
   });
   ```

2. **Update the database credentials** to match your MySQL setup.

## Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:3000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Books

- `GET /` - Welcome message
- `GET /books` - Get all books
- `GET /books/search/:title` - Search books by title
- `POST /books` - Create a new book
- `PUT /books/:id` - Update a book by ID
- `DELETE /books/:id` - Delete a book by ID

### Example API Request

**Create a new book:**
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "isbn": "9780743273565",
    "author_name": "F. Scott Fitzgerald",
    "price": 15.99,
    "publication_year": 1925,
    "stock": 10,
    "category": "Fiction"
  }'
```

## Usage

1. **Adding Books**: Fill out the form on the left side and click "Add Book"
2. **Editing Books**: Click the "Edit" button next to any book in the table
3. **Deleting Books**: Click the "Delete" button (you'll be asked to confirm)
4. **Searching**: Use the search bar to find books by title

## Authors

- **Chad Donahue** – Frontend Developer – [@Retread2000](https://github.com/Retread2000)
- **Darick Le** – Backend Developer – [@darickle](https://github.com/darickle)