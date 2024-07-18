// LoginServer.js
const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');
const passportSetup = require('./passport');
const passport = require('passport');
const authRoute = require('./auth');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

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

// Bookmark routes
const bookmarks = []; // In-memory storage for bookmarks

app.post('/bookmarks', (req, res) => {
  if (req.isAuthenticated()) {
    bookmarks.push({ userId: req.user.id, place: req.body.place });
    res.status(200).send('Bookmark saved');
  } else {
    console.error('Unauthorized access attempt');
    res.status(401).send('Unauthorized');
  }
});

app.get('/bookmarks', (req, res) => {
  if (req.isAuthenticated()) {
    const userBookmarks = bookmarks.filter(bookmark => bookmark.userId === req.user.id);
    res.status(200).json(userBookmarks);
  } else {
    console.error('Unauthorized access attempt');
    res.status(401).send('Unauthorized');
  }
});

app.delete('/bookmarks', (req, res) => {
  if (req.isAuthenticated()) {
    const { name, address } = req.body;
    const index = bookmarks.findIndex(bookmark => 
      bookmark.userId === req.user.id && 
      bookmark.place.name === name && 
      bookmark.place.formatted_address === address
    );
    if (index > -1) {
      bookmarks.splice(index, 1);
      res.status(200).send('Bookmark deleted');
    } else {
      res.status(404).send('Bookmark not found');
    }
  } else {
    console.error('Unauthorized access attempt');
    res.status(401).send('Unauthorized');
  }
});


// connect to mongodb
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Login Server is running on port ${PORT}`);
});
