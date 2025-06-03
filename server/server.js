// server/server.js
const express = require('express');
const cors = require('cors');
const session = require('cookie-session');
const passport = require('passport');
require('./passportSetup'); // your Google OAuth passport config

const authRoutes = require('./routes/auth');
const placesRoutes = require('./routes/places');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Update with Vercel domain in prod
  credentials: true,
}));
app.use(express.json());
app.use(session({
  name: 'session',
  keys: ['your_session_secret'],
  maxAge: 24 * 60 * 60 * 1000,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', placesRoutes);

app.get('/', (req, res) => {
  res.send('BizScout backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
