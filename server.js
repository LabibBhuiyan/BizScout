const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

async function fetchAllPlaces(query, apiKey) {
  let places = [];
  let nextPageToken = null;
  let pagesFetched = 0;
  const maxPages = 2; // Limit to 2 pages

  do {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: query,
        key: apiKey,
        pagetoken: nextPageToken,
      },
    });

    places = places.concat(response.data.results);
    nextPageToken = response.data.next_page_token;
    pagesFetched++;

    // Wait a bit before making the next request if there's a nextPageToken and we haven't reached the max pages
    if (nextPageToken && pagesFetched < maxPages) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } while (nextPageToken && pagesFetched < maxPages);

  return places;
}

app.get('/api/places', async (req, res) => {
  const { query } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    const allPlaces = await fetchAllPlaces(query, apiKey);

    const places = await Promise.all(
      allPlaces.map(async place => {
        const placeDetails = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
          params: {
            place_id: place.place_id,
            fields: 'name,types,formatted_address,formatted_phone_number,website',
            key: apiKey,
          },
        });

        return {
          name: placeDetails.data.result.name,
          types: placeDetails.data.result.types,
          formatted_address: placeDetails.data.result.formatted_address,
          formatted_phone_number: placeDetails.data.result.formatted_phone_number || 'N/A',
          website: placeDetails.data.result.website || null,
        };
      })
    );

    // Filter places to only include those without websites
    const placesWithoutWebsites = places.filter(place => !place.website);

    res.json(placesWithoutWebsites);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).send('Error fetching places');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
