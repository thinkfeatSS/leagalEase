const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// API routes
app.use('/api', routes);

// Error handling middleware (for centralized error management)
app.use(errorHandler);

module.exports = app;
