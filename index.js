const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./database')

const userRoutes = require('./routes/users');


// make sure this comes AFTER dotenv config
const productsRouter = require('./routes/products');

const userRoutes2 = require('./routes/users');

const app = express();

// console.log("pool", pool); 
// console.log(  "userRoutes", userRoutes);
// console.log("productsRouter", productsRouter);
//  console.log(userRoutes2, userRoutes2);
// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/users', userRoutes);


// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.get('/api/register', (req, res) => {
  res.json({ message: "at /api/register" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});