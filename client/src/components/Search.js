// client/src/components/Search.js
import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');

  const apiUrl = 'http://localhost:5000/api/places'; // Adjust URL if needed

  const fetchPlaces = async (e) => {
    if (e) e.preventDefault();

    try {
      const response = await axios.get(apiUrl, { params: { query } });
      setResults(response.data.places);
      setNextPageToken(response.data.nextPageToken);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const fetchMorePlaces = async () => {
    try {
      const response = await axios.get(apiUrl, {
        params: {
          query,
          pageToken: nextPageToken,
        },
      });
      setResults((prevResults) => [...prevResults, ...response.data.places]);
      setNextPageToken(response.data.nextPageToken);
    } catch (error) {
      console.error('Error fetching more places:', error);
    }
  };

  const formatTypes = (types) => {
    return types.map((type) => type.replace(/_/g, ' '));
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Search Places</h1>
      <form onSubmit={fetchPlaces} className="search-form">
        <input
          type="text"
          placeholder="Search for places..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <ul className="results-list">
        {results.map((place, index) => (
          <li key={index} className="place-item">
            <div className="place-icon" style={{ backgroundImage: `url(${place.icon})` }}></div>
            <div className="place-content">
              <h2 className="place-name">{place.name}</h2>
              <p className="place-address">{place.formatted_address}</p>
              <p className="place-phone">{place.formatted_phone_number || 'N/A'}</p>
              <p className="place-types">{formatTypes(place.types).join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
      {nextPageToken && (
        <div className="pagination">
          <button className="load-more-button" onClick={fetchMorePlaces}>Load More</button>
        </div>
      )}
    </div>
  );
};

export default Search;
