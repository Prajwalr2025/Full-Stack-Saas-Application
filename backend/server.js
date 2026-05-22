const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load the secret variables from the .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the Express application
const app = express();

// Middleware: The security bouncer and the JSON translator
app.use(cors());
app.use(express.json());

// A simple test route to ensure the server is responding
app.get('/', (req, res) => {
  res.send('Warehouse SaaS API is running...');
});

// Define the port (use the one from .env, or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});