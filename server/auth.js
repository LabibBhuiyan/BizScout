//auth.js
const router = require('express').Router();
const passport = require('passport');

const CLIENT_URL = 'http://localhost:3000'; 

// Route for successful login
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'Successfully authenticated',
      user: {
        displayName: req.user.username, 
        photo: req.user.thumbnail,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
});

// Route for logging out
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

// Google OAuth route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
  })
);

module.exports = router;
