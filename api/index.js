const express = require('express');
const routes = require('../src/routes');
require('dotenv').config();
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Create an Express instance
const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
// Middleware to parse JSON requests
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(limiter);

// Use routes
app.use('/api', routes);
// Export the app as a serverless function for Vercel
module.exports = app;