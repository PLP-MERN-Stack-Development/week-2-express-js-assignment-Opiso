// server.js - Starter Express server for Week 2 assignment

require('dotenv').config();

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const productRoutes = require('./Routes/routes');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const errorHandler = require('./errorsHandler/errorHandler');

require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(logger);
app.use(auth);

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Initialize the port
const PORT = process.env.PORT;

// initialize mongodb server
const mongoUri = process.env.MONGODB_URI

// connect to mongodb server
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("SUCCESSFULLY CONNECTED TO MONGODB"))
.catch(err => console.log("MONGODB CONNECTION ISSUES", err));

// define routing path
app.use('/api/', productRoutes)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' }); //for invalid routes
});
// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
}); 

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling
 app.use(errorHandler);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 