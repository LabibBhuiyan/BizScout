//passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const dotenv = require('dotenv');
const User = require('./models/User')

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],  // Request email in addition to profile
    },  (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our own db
      User.findOne({googleId: profile.id}).then((currentUser) => {
          if(currentUser){
              // already have this user
              console.log('user is: ', currentUser);
              done(null, currentUser);
          } else {
              // if not, create user in our db
              new User({
                  googleId: profile.id,
                  username: profile.displayName,
                  thumbnail: profile.photos[0].value
              }).save().then((newUser) => {
                  console.log('created new user: ', newUser);
                  done(null, newUser);
              });
          }
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user ID into the session
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user); // Deserialize user object from user ID
    })
    .catch(err => {
      done(err, null);
    });
});

module.exports = passport;
