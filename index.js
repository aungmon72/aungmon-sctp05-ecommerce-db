const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./database')

// make sure this comes AFTER dotenv config
const productsRouter = require('./routes/products');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/products', productsRouter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});