const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection URI - using the newer connection syntax
const uri = 'mongodb://127.0.0.1:27017/test';

console.log('Connecting to MongoDB...');
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('\nTROUBLESHOOTING TIPS:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check if MongoDB service is started in Windows Services');
    console.log('3. Or start MongoDB manually with: mongod --dbpath="C:\\data\\db"');
  });

// Routes
app.use('/api/clients', require('./routes/clients'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});