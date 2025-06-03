require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passportSetup = require('./passport');
const passport = require('passport');
const cookieSession = require('cookie-session');
const authRoute = require('./auth');
const axios = require('axios');

const app = express();

app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB();

// CORS setup
app.use(cors({
  origin: 'http://localhost:3000', // Change this to your frontend URL in production
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

// Cookie session and passport setup
app.use(cookieSession({
  name: 'session',
  keys: [process.env.MY_SECRET_KEY],
  maxAge: 24 * 60 * 60 * 1000,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Authentication routes
app.use('/auth', authRoute);

app.get('/auth/status', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
});

// In-memory bookmarks storage (replace with DB later)
const bookmarks = [];

app.post('/bookmarks', (req, res) => {
  if (req.isAuthenticated()) {
    bookmarks.push({ userId: req.user.id, place: req.body.place });
    res.status(200).send('Bookmark saved');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/bookmarks', (req, res) => {
  if (req.isAuthenticated()) {
    const userBookmarks = bookmarks.filter(b => b.userId === req.user.id);
    res.status(200).json(userBookmarks);
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.delete('/bookmarks', (req, res) => {
  if (req.isAuthenticated()) {
    const { name, address } = req.body;
    const index = bookmarks.findIndex(b =>
      b.userId === req.user.id &&
      b.place.name === name &&
      b.place.formatted_address === address
    );
    if (index > -1) {
      bookmarks.splice(index, 1);
      res.status(200).send('Bookmark deleted');
    } else {
      res.status(404).send('Bookmark not found');
    }
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Google Places API integration

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const textSearchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const autocompleteUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

async function fetchPlaces(query, apiKey, pageToken = null) {
  const maxResultsPerPage = 5;

  try {
    const response = await axios.get(textSearchUrl, {
      params: { query, key: apiKey, pagetoken: pageToken },
    });

    const placesWithIcons = await Promise.all(
      response.data.results.map(async place => {
        const detailsResp = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
          params: {
            place_id: place.place_id,
            fields: 'name,place_id,types,formatted_address,formatted_phone_number,website,icon,icon_background_color',
            key: apiKey,
          },
        });
        const details = detailsResp.data.result;
        return {
          name: details.name,
          place_id: details.place_id,
          types: details.types,
          formatted_address: details.formatted_address,
          formatted_phone_number: details.formatted_phone_number || 'N/A',
          icon: details.icon || null,
          icon_background_color: details.icon_background_color || null,
          website: details.website || null,
        };
      })
    );

    const places = placesWithIcons.filter(place => !place.website);

    return {
      places: places.slice(0, maxResultsPerPage),
      nextPageToken: response.data.next_page_token,
    };
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
}

async function fetchAutocomplete(input, apiKey) {
  try {
    const response = await axios.get(autocompleteUrl, {
      params: { input, key: apiKey },
    });

    return response.data.predictions.map(prediction => ({
      description: prediction.description,
    }));
  } catch (error) {
    console.error('Error fetching autocomplete:', error);
    throw error;
  }
}

app.get('/api/places', async (req, res) => {
  const { query, pageToken } = req.query;

  try {
    const { places, nextPageToken } = await fetchPlaces(query, apiKey, pageToken);
    res.json({ places, nextPageToken });
  } catch {
    res.status(500).send('Error fetching places');
  }
});

app.get('/api/autocomplete', async (req, res) => {
  const { input } = req.query;

  try {
    const predictions = await fetchAutocomplete(input, apiKey);
    res.json(predictions);
  } catch {
    res.status(500).send('Error fetching autocomplete predictions');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
