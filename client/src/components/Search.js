// Search.js
import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const apiUrl = 'http://localhost:5000/api/places'; // Adjust URL if needed

  const fetchPlaces = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(apiUrl, {
        params: { query }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  return (
    <div>
      <h1>Search Places</h1>
      <form onSubmit={fetchPlaces}>
        <input
          type="text"
          placeholder="Search for places..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((place, index) => (
          <li key={index}>
            <h2>{place.name}</h2>
            <p>{place.formatted_address}</p>
            <p>{place.formatted_phone_number || 'N/A'}</p>
            <p>{place.website ? 'Has website' : 'No website available'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;

