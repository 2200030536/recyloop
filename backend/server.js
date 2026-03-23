const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Route Check
app.get('/', (req, res) => {
    res.send('Recyloop API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/city-admin', require('./routes/cityAdminRoutes'));
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/recycler', require('./routes/recyclerRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the Express API to work natively with Vercel's Serverless Functions
module.exports = app;
