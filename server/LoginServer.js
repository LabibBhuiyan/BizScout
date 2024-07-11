const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');
const passportSetup = require('./passport');
const passport = require('passport');
const authRoute = require('./auth');
require('dotenv').config(); 

const app = express();

// Session middleware setup
app.use(cookieSession({
  name: 'session',
  keys: [process.env.MY_SECRET_KEY],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
}));

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

// Middleware to check authentication status
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// CORS setup
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

// Mount authRoute under /auth
app.use('/auth', authRoute);

// Route to check authentication status
app.get('/auth/status', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
});

// Other routes or middleware definitions

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Login Server is running on port ${PORT}`);
});
