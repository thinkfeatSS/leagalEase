const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const poetRouter = require('../src/routes/poetRouter');
const userRouter = require('../src/routes/userRoutes');
const alphabetRouter = require('../src/routes/alphabetRouter');
const kalamRouter = require('../src/routes/kalamRouter');
const poemRouter = require('../src/routes/poemRouter');
const errorHandler = require('../src/middleware/errorHandler');
const cors = require('cors'); // Import the CORS middleware
// Load environment variables
require('dotenv').config();
// Create an Express instance
const app = express();
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 'loopback, linklocal, uniquelocal' : 'loopback');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
// Enable CORS for all origins (allow cross-origin requests)
app.use(cors());
  // Middleware to parse JSON requests
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(limiter);

// API routes
app.use('/api', alphabetRouter);
app.use('/api', kalamRouter);
app.use('/api', poemRouter);
app.use('/api', poetRouter);
app.use('/api', userRouter);

app.use(errorHandler);
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);  // Exit after closing the server
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);  // Exit after closing the server
  });
});

// Export the app as a serverless function for Vercel
module.exports = app; 