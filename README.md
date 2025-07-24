# BookNest - Online Bookstore

A full-stack web application for BookNest's online bookstore, built with MySQL, Express, React, and Node.js. Customers can browse books, create accounts, and place orders securely.

## Features

- **Customer Registration**: Secure account creation with AES-256 encrypted passwords
- **Customer Login**: Authentication system for user accounts
- **Browse Books**: View complete book catalog with details (title, author, price, stock, etc.)
- **Search Books**: Search for books by title and filter by price range
- **Shopping Cart**: Add books to cart and place order
- **Order Management**: View order history
- **Inventory Tracking**: Real-time stock updates when orders are placed

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

2. **Run the complete database schema** by executing the SQL script provided in the repository:
   - Copy the contents from [`backend/databaseSchema.sql`](backend/databaseSchema.sql)
   - Execute the script in your MySQL client (MySQL Workbench, phpMyAdmin, or command line)
   
3. **The schema includes**:
   - Complete database and table creation
   - Sample book data for testing
   - Customer and order management tables
   - Performance indexes
   - Foreign key relationships

4. **Verify setup** by checking that the following tables exist:
   - `books` - Book inventory
   - `customers` - Customer accounts  
   - `orders` - Order records
   - `orderItems` - Order line items

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

## API Endpoints

### Books
- `GET /` - Welcome message
- `GET /books` - Get all books
- `GET /books/search` - Search books by title, price range

### Customers
- `POST /customers/register` - Register a new customer
- `POST /customers/login` - Customer login
- `GET /customers/profile/:customerId` - Get customer profile

### Orders
- `POST /orders` - Create a new order
- `GET /orders/customer/:customerId` - Get customer's order history

## Authors

- **Chad Donahue** – Frontend Developer – [@Retread2000](https://github.com/Retread2000)
- **Darick Le** – Backend Developer – [@darickle](https://github.com/darickle)