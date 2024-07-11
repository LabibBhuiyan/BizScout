// BizScout/SearchServer.js

const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

async function fetchPlaces(query, apiKey, pageToken = null) {
  const maxResultsPerPage = 5; // Number of results per page

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: query,
        key: apiKey,
        pagetoken: pageToken,
      },
    });

    const placesWithIcons = await Promise.all(
      response.data.results.map(async place => {
        const placeDetailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
          params: {
            place_id: place.place_id,
            fields: 'name,types,formatted_address,formatted_phone_number,website,icon,icon_background_color',
            key: apiKey,
          },
        });

        const placeDetails = placeDetailsResponse.data.result;

        return {
          name: placeDetails.name,
          types: placeDetails.types,
          formatted_address: placeDetails.formatted_address,
          formatted_phone_number: placeDetails.formatted_phone_number || 'N/A',
          icon: placeDetails.icon || null,
          icon_background_color: placeDetails.icon_background_color || null,
        };
      })
    );

    const places = placesWithIcons.filter(place => !place.website);

    return {
      places: places.slice(0, maxResultsPerPage), // Return first page of results
      nextPageToken: response.data.next_page_token,
    };
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error; // Propagate the error
  }
}

app.get('/api/places', async (req, res) => {
  const { query, pageToken } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    const { places, nextPageToken } = await fetchPlaces(query, apiKey, pageToken);

    res.json({ places, nextPageToken });
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).send('Error fetching places');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
