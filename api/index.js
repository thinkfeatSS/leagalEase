const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const poetRouter = require('../src/routes/poetRouter');
const userRouter = require('../src/routes/userRoutes');
const errorHandler = require('../src/middleware/errorHandler');

// Load environment variables
require('dotenv').config();
// Create an Express instance
const app = express();
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 'loopback, linklocal, uniquelocal' : 'loopback');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
// Middleware to parse JSON requests
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(limiter);

// API routes
app.use('/api', poetRouter);
app.use('/api', userRouter);

app.use(errorHandler);


// Export the app as a serverless function for Vercel
module.exports = app; 