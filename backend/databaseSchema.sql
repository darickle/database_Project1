-- Create the database if it does not exist already
CREATE DATABASE IF NOT EXISTS BookNest;
USE BookNest;

-- Stores information about books in the inventory
CREATE TABLE IF NOT EXISTS books (
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

-- Stores customer account information
CREATE TABLE IF NOT EXISTS customers (
  customerId INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  emailAddress VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  shippingAddress TEXT,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stores order information linking customers to their purchases
CREATE TABLE IF NOT EXISTS orders (
  orderId INT AUTO_INCREMENT PRIMARY KEY,
  customerId INT,
  orderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  totalAmount DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (customerId) REFERENCES customers(customerId)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- Stores individual items within each order and forms a many-to-many relationship between orders and books
CREATE TABLE IF NOT EXISTS orderItems (
  itemId INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  bookId INT NOT NULL,
  quantity INT NOT NULL,
  unitPrice DECIMAL(6,2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(orderId)
    ON DELETE CASCADE,
  FOREIGN KEY (bookId) REFERENCES books(id)
    ON DELETE CASCADE
);

-- Insert some sample books for testing 
INSERT IGNORE INTO books (title, isbn, author_name, price, publication_year, stock, category) VALUES
('The Great Gatsby', '9780743273565', 'F. Scott Fitzgerald', 15.99, 1925, 10, 'Fiction'),
('To Kill a Mockingbird', '9780061120084', 'Harper Lee', 14.99, 1960, 15, 'Fiction'),
('1984', '9780451524935', 'George Orwell', 13.99, 1949, 20, 'Dystopian'),
('Pride and Prejudice', '9780486284736', 'Jane Austen', 12.99, 1813, 8, 'Romance'),
('The Catcher in the Rye', '9780316769174', 'J.D. Salinger', 16.99, 1951, 12, 'Fiction'),
('Harry Potter and the Sorcerer''s Stone', '9780439708180', 'J.K. Rowling', 18.99, 1997, 25, 'Fantasy'),
('The Lord of the Rings', '9780544003415', 'J.R.R. Tolkien', 22.99, 1954, 18, 'Fantasy'),
('Dune', '9780441172719', 'Frank Herbert', 17.99, 1965, 14, 'Science Fiction'),
('The Hobbit', '9780547928227', 'J.R.R. Tolkien', 15.99, 1937, 22, 'Fantasy'),
('Fahrenheit 451', '9781451673319', 'Ray Bradbury', 14.99, 1953, 16, 'Science Fiction');


-- Add indexes to improve query performance
CREATE INDEX idx_customer_email ON customers(emailAddress);
CREATE INDEX idx_orders_customer ON orders(customerId);
CREATE INDEX idx_orders_date ON orders(orderDate);
CREATE INDEX idx_orderitems_order ON orderItems(orderId);
CREATE INDEX idx_orderitems_book ON orderItems(bookId);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author_name);
CREATE INDEX idx_books_price ON books(price);
CREATE INDEX idx_books_category ON books(category);
