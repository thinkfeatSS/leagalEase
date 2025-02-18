const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('../src/middleware/errorHandler');
const cors = require('cors'); // Import the CORS middleware
const mongoose = require("mongoose");



// Routes
const authRoutes = require("../src/routes/authRoutes");




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
const corsOptions = {
  origin: '*', // Allow all origins (You can restrict this later)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
  // Middleware to parse JSON requests
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(limiter);




app.get('/',(req, res) => {
  res.status(200).json({ msg: "hello api"});
})
app.use('/api', authRoutes);
app.use("/api/diary", require("../src/routes/diaryRoutes"));
app.use("/api/appointments", require("../src/routes/appointmentRoutes"));
app.use("/api/chat", require("../src/routes/conversationRoutes"));
// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ msg: "Route not found" });
});

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
})
.then(() => console.log("MongoDB Connected Successfully! 🚀"))
.catch((err) => console.error("MongoDB Connection Error ❌", err));

  
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   server.close(() => {
//     process.exit(1);  // Exit after closing the server
//   });
// });

// Export the app as a serverless function for Vercel

// Start Server
// app.listen(5000, () => console.log(`Server running on port ${PORT}`));
module.exports = app; 