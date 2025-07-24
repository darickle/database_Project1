// Import necessary modules
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

const app = express();

// AES-256 encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  console.error('ENCRYPTION_KEY environment variable is required');
  console.log('Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  console.log('Then add it to your .env file: ENCRYPTION_KEY=your-generated-key');
  process.exit(1);
}

// Convert hex string to buffer for AES-256
const ENCRYPTION_KEY_BUFFER = Buffer.from(ENCRYPTION_KEY, 'hex');
const IV_LENGTH = 16; // For AES, this is always 16

// Encryption function
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY_BUFFER, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decryption function
function decrypt(text) {
  try {
    const textParts = text.split(':');
    if (textParts.length !== 2) {
      throw new Error('Invalid encrypted format');
    }
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedText = textParts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY_BUFFER, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error details:', error.message);
    throw new Error('Failed to decrypt password - may need to re-register user');
  }
}

// Middleware setup
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  
  // Redact sensitive information from logs
  const logBody = { ...req.body };
  if (logBody.password) {
    logBody.password = '[REDACTED]';
  }
  
  console.log('Request body:', logBody);
  next();
});

// Database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "BookNest",
  port: process.env.DB_PORT || 3306
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database with thread ID:", db.threadId);
});
app.get('/', (req, res) => {
  res.json("Welcome to the BookNest Inventory API");
});

// Endpoint to get all books
app.get('/books', (req, res) => {
  console.log('Fetching all books from database...');
  const sql = "SELECT * FROM books";
  
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error getting books:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    
    console.log(`Successfully got ${data.length} books`);
    return res.json(data);
  });
});

// Endpoint to search books
app.get('/books/search', (req, res) => {
  const { q, title, minPrice, maxPrice } = req.query;
  const searchTitle = q || title;
  
  console.log('Book search params:', { searchTitle, minPrice, maxPrice });
  
  let sql = "SELECT * FROM books WHERE 1=1";
  const params = [];
  
  if (searchTitle && searchTitle.trim()) {
    sql += " AND title LIKE ?";
    params.push(`%${searchTitle.trim()}%`);
  }
  
  if (minPrice && !isNaN(minPrice)) {
    sql += " AND price >= ?";
    params.push(parseFloat(minPrice));
  }
  
  if (maxPrice && !isNaN(maxPrice)) {
    sql += " AND price <= ?";
    params.push(parseFloat(maxPrice));
  }
  
  sql += " ORDER BY title";
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error in book search:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    
    console.log(`Book search returned ${results.length} books`);
    return res.json(results);
  });
});

// Endpoint to register a new customer
app.post('/customers/register', (req, res) => {
  const { firstName, lastName, emailAddress, phone, shippingAddress, password } = req.body;
  
  console.log('Attempting to register new customer:', { firstName, lastName, emailAddress, phone });
  
  if (!firstName || !lastName || !emailAddress || !password) {
    return res.status(400).json({ 
      error: "Required fields are missing",
      required: ["firstName", "lastName", "emailAddress", "password"]
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }
  
  // Encrypt the password before storing
  const encryptedPassword = encrypt(password);
  
  const sql = `
    INSERT INTO customers (firstName, lastName, emailAddress, phone, shippingAddress, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(sql, [firstName, lastName, emailAddress, phone || '', shippingAddress || '', encryptedPassword], (err, result) => {
    if (err) {
      console.error('Error registering customer:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: "Email address already exists" });
      }
      return res.status(500).json({ error: 'Database error', details: err });
    }
    
    console.log(`Customer registered successfully with ID: ${result.insertId}`);
    return res.status(201).json({ 
      message: "Customer registered successfully", 
      customerId: result.insertId,
      customer: { firstName, lastName, emailAddress, phone }
    });
  });
});

// Endpoint to login a customer
app.post('/customers/login', (req, res) => {
  const { emailAddress, password } = req.body;
  
  console.log('Login attempt for email:', emailAddress);
  
  if (!emailAddress || !password) {
    return res.status(400).json({ 
      error: "Email and password are required" 
    });
  }
  
  const sql = "SELECT * FROM customers WHERE emailAddress = ?";
  
  db.query(sql, [emailAddress], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    
    if (results.length === 0) {
      console.log('Login failed: User not found');
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const customer = results[0];
    
    try {
      // Decrypt the stored password and compare with provided password
      const decryptedPassword = decrypt(customer.password);
      
      if (decryptedPassword !== password) {
        console.log('Login failed: Invalid password');
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Remove password from response for security
      delete customer.password;
      
      console.log(`Customer logged in successfully: ${customer.customerId}`);
      return res.json({ 
        message: "Login successful",
        customer: customer
      });
    } catch (decryptError) {
      console.error('Error decrypting password:', decryptError.message);
      return res.status(500).json({ 
        error: "Authentication error", 
        message: "Password decryption failed. You may need to register again if the server encryption key has changed." 
      });
    }
  });
});

// Endpoint to get customer profile
app.get('/customers/:id', (req, res) => {
  const customerId = req.params.id;
  
  console.log(`Fetching profile for customer ID: ${customerId}`);
  
  if (isNaN(customerId) || customerId <= 0) {
    return res.status(400).json({ error: "Invalid customer ID" });
  }
  
  const sql = "SELECT customerId, firstName, lastName, emailAddress, phone, shippingAddress FROM customers WHERE customerId = ?";
  
  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching customer profile:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    console.log(`Customer profile retrieved for ID: ${customerId}`);
    return res.json(results[0]);
  });
});

// Endpoint to create a new order
app.post('/orders', (req, res) => {
  const { customerId, items } = req.body;
  
  console.log('Attempting to create new order for customer:', customerId);
  console.log('Order items:', items);
  
  if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ 
      error: "Customer ID and items array are required" 
    });
  }
  
  if (isNaN(customerId) || customerId <= 0) {
    return res.status(400).json({ error: "Invalid customer ID" });
  }
  
  for (let item of items) {
    if (!item.bookId || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({ 
        error: "Each item must have bookId and positive quantity" 
      });
    }
  }
  
  // Start transaction to ensure atomicity
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Transaction error' });
    }
    
    let totalAmount = 0;
    let processedItems = [];
    let itemsProcessed = 0;
    
    items.forEach((item, index) => {
      const sql = "SELECT id, title, price, stock FROM books WHERE id = ?";
      
      db.query(sql, [item.bookId], (err, bookResults) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error fetching book details:', err);
            res.status(500).json({ error: 'Database error while fetching book details' });
          });
        }
        
        if (bookResults.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: `Book with ID ${item.bookId} not found` });
          });
        }
        
        const book = bookResults[0];
        
        if (book.stock < item.quantity) {
          return db.rollback(() => {
            res.status(400).json({ 
              error: `Insufficient stock for book "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}` 
            });
          });
        }
        
        const itemTotal = book.price * item.quantity;
        totalAmount += itemTotal;
        
        processedItems.push({
          bookId: item.bookId,
          quantity: item.quantity,
          unitPrice: book.price,
          title: book.title
        });
        
        itemsProcessed++;
        
        if (itemsProcessed === items.length) {
          const orderSql = "INSERT INTO orders (customerId, totalAmount) VALUES (?, ?)";
          
          db.query(orderSql, [customerId, totalAmount], (err, orderResult) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error creating order:', err);
                res.status(500).json({ error: 'Error creating order' });
              });
            }
            
            const orderId = orderResult.insertId;
            console.log(`Order created with ID: ${orderId}`);
            
            let itemsInserted = 0;
            
            processedItems.forEach((processedItem) => {
              const itemSql = "INSERT INTO orderItems (orderId, bookId, quantity, unitPrice) VALUES (?, ?, ?, ?)";
              
              db.query(itemSql, [orderId, processedItem.bookId, processedItem.quantity, processedItem.unitPrice], (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error inserting order item:', err);
                    res.status(500).json({ error: 'Error inserting order items' });
                  });
                }
                
                const updateStockSql = "UPDATE books SET stock = stock - ? WHERE id = ?";
                
                db.query(updateStockSql, [processedItem.quantity, processedItem.bookId], (err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error('Error updating stock:', err);
                      res.status(500).json({ error: 'Error updating book stock' });
                    });
                  }
                  
                  itemsInserted++;
                  
                  if (itemsInserted === processedItems.length) {
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          console.error('Error committing transaction:', err);
                          res.status(500).json({ error: 'Error committing order' });
                        });
                      }
                      
                      console.log(`Order ${orderId} completed successfully`);
                      res.status(201).json({
                        message: "Order created successfully",
                        orderId: orderId,
                        customerId: customerId,
                        totalAmount: totalAmount,
                        items: processedItems
                      });
                    });
                  }
                });
              });
            });
          });
        }
      });
    });
  });
});

// Endpoint to get order history for a customer
app.get('/orders/customer/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  
  console.log(`Fetching order history for customer ID: ${customerId}`);
  
  if (isNaN(customerId) || customerId <= 0) {
    return res.status(400).json({ error: "Invalid customer ID" });
  }
  
  const sql = `
    SELECT 
      o.orderId, 
      o.orderDate, 
      o.totalAmount,
      oi.itemId,
      oi.bookId,
      oi.quantity,
      oi.unitPrice,
      b.title,
      b.author_name
    FROM orders o
    LEFT JOIN orderItems oi ON o.orderId = oi.orderId
    LEFT JOIN books b ON oi.bookId = b.id
    WHERE o.customerId = ?
    ORDER BY o.orderDate DESC, oi.itemId
  `;
  
  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching order history:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    
    const ordersMap = new Map();
    
    results.forEach(row => {
      if (!ordersMap.has(row.orderId)) {
        ordersMap.set(row.orderId, {
          orderId: row.orderId,
          orderDate: row.orderDate,
          totalAmount: row.totalAmount,
          items: []
        });
      }
      
      if (row.itemId) {
        ordersMap.get(row.orderId).items.push({
          itemId: row.itemId,
          bookId: row.bookId,
          title: row.title,
          author_name: row.author_name,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
          totalPrice: row.quantity * row.unitPrice
        });
      }
    });
    
    const orders = Array.from(ordersMap.values());
    console.log(`Retrieved ${orders.length} orders for customer ${customerId}`);
    
    return res.json(orders);
  });
});

// Endpoint to get details of a specific order
app.get('/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  
  console.log(`Fetching details for order ID: ${orderId}`);
  
  if (isNaN(orderId) || orderId <= 0) {
    return res.status(400).json({ error: "Invalid order ID" });
  }
  
  const sql = `
    SELECT 
      o.orderId, 
      o.orderDate, 
      o.totalAmount,
      o.customerId,
      c.firstName,
      c.lastName,
      c.emailAddress,
      oi.itemId,
      oi.bookId,
      oi.quantity,
      oi.unitPrice,
      b.title,
      b.author_name
    FROM orders o
    JOIN customers c ON o.customerId = c.customerId
    LEFT JOIN orderItems oi ON o.orderId = oi.orderId
    LEFT JOIN books b ON oi.bookId = b.id
    WHERE o.orderId = ?
    ORDER BY oi.itemId
  `;
  
  db.query(sql, [orderId], (err, results) => {
    if (err) {
      console.error('Error fetching order details:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const orderData = results[0];
    const order = {
      orderId: orderData.orderId,
      orderDate: orderData.orderDate,
      totalAmount: orderData.totalAmount,
      customer: {
        customerId: orderData.customerId,
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        emailAddress: orderData.emailAddress
      },
      items: []
    };
    
    results.forEach(row => {
      if (row.itemId) {
        order.items.push({
          itemId: row.itemId,
          bookId: row.bookId,
          title: row.title,
          author_name: row.author_name,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
          totalPrice: row.quantity * row.unitPrice
        });
      }
    });
    
    console.log(`Order details retrieved for ID: ${orderId}`);
    return res.json(order);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong on our end'
  });
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log('BookNest Customer API Server is running!');
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log('Database: BookNest (MySQL)');
  console.log('Security: AES-256 password encryption enabled');
  console.log(`Encryption Key: Loaded from environment variable ✅`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Available endpoints:');
  console.log('BOOK ENDPOINTS (READ-ONLY):');
  console.log('GET    /                           - Welcome message');
  console.log('GET    /books                      - Get all books');
  console.log('GET    /books/search?q=title&minPrice=&maxPrice= - Search books');
  console.log('CUSTOMER ENDPOINTS:');
  console.log('POST   /customers/register         - Register new customer');
  console.log('POST   /customers/login            - Customer login');
  console.log('GET    /customers/:id              - Get customer profile');
  console.log('ORDER ENDPOINTS:');
  console.log('POST   /orders                     - Create new order');
  console.log('GET    /orders/customer/:customerId - Get customer order history');
  console.log('GET    /orders/:orderId            - Get specific order details');
  console.log('NOTE: Books must be added manually via SQL INSERT statements');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  db.end(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});

// Graceful shutdown for SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  db.end(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});