require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

connectDB();

const app = express();

// CORS — allow the React frontend (port 3000) to call this API
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    /\.vercel\.app$/
  ],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SkillSwap API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/feedback', feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SkillSwap server running on http://localhost:${PORT}`);
});
