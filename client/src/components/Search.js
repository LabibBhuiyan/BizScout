// client/src/components/Search.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:5001/auth/status', { withCredentials: true });
        setIsLoggedIn(response.data.isAuthenticated);
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };
    checkAuthentication();
  }, []);

  const apiUrl = 'http://localhost:5000/api/places';
  const autocompleteUrl = 'http://localhost:5000/api/autocomplete';

  const fetchPlaces = async (e) => {
    if (e) e.preventDefault();

    try {
      const response = await axios.get(apiUrl, { params: { query } });
      setResults(response.data.places);
      setNextPageToken(response.data.nextPageToken);
      setCurrentPage(0);
      setPages([{ places: response.data.places, token: response.data.nextPageToken }]);

      if (response.data.places.length === 0) {
        setNoResultsMessage('The place you searched for might not exist or already has a website.');
      } else {
        setNoResultsMessage('');
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const fetchMorePlaces = async (page) => {
    if (pages[page]) {
      setResults(pages[page].places);
      setNextPageToken(pages[page].token);
      setCurrentPage(page);
      return;
    }

    try {
      const response = await axios.get(apiUrl, {
        params: {
          query,
          pageToken: nextPageToken,
        },
      });
      const newPages = [...pages, { places: response.data.places, token: response.data.nextPageToken }];
      setPages(newPages);
      setResults(response.data.places);
      setNextPageToken(response.data.nextPageToken);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching more places:', error);
    }
  };

  const savePlace = async (place) => {
    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.place_id === place.place_id
    );

    if (isBookmarked) {
      alert('This place is already saved.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/bookmarks', { place }, { withCredentials: true });
      if (response.data.alreadySaved) {
        alert('This place is already saved.');
      } else {
        console.log('Response from server:', response);
        alert('Place saved successfully!');
        setBookmarks([...bookmarks, place]);
      }
    } catch (error) {
      console.error('Error saving place:', error);
      alert('Failed to save place.');
    }
  };

  const sharePlaceByEmail = (place) => {
    const subject = `Check out ${place.name}`;
    const body = `I found this place:\n\nName: ${place.name}\nAddress: ${place.formatted_address}\nPhone: ${place.formatted_phone_number || 'N/A'}`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  };

  const formatTypes = (types) => {
    return types.map((type) => type.replace(/_/g, ' '));
  };

  const fetchAutocompleteSuggestions = async (input) => {
    try {
      const response = await axios.get(autocompleteUrl, {
        params: {
          input,
        },
      });
      setSuggestions(response.data || []);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    if (inputValue.trim() !== '') {
      fetchAutocompleteSuggestions(inputValue);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.description);
    setSuggestions([]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchPlaces();
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Search Places</h1>
      {!isLoggedIn && (
        <p className="login-message">Please <a href="http://localhost:3000/login">log in</a> to search for places.</p>
      )}
      <form onSubmit={handleFormSubmit} className={`search-form ${!isLoggedIn ? 'disabled' : ''}`}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search by place name, type, or location..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="search-input"
            disabled={!isLoggedIn}
          />
          {suggestions.length > 0 && showSuggestions && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="search-button" disabled={!isLoggedIn}>Search</button>
      </form>
      {noResultsMessage && <p className="no-results-message">{noResultsMessage}</p>}
      <ul className="results-list">
        {results.map((place, index) => (
          <li key={index} className="place-item">
            <div className="place-icon" style={{ backgroundImage: `url(${place.icon})` }}></div>
            <div className="place-content">
              <h2 className="place-name">{place.name}</h2>
              <p className="place-address">{place.formatted_address}</p>
              <p className="place-phone">{place.formatted_phone_number || 'N/A'}</p>
              <p className="place-types">{formatTypes(place.types).join(', ')}</p>
              <button onClick={() => sharePlaceByEmail(place)} className="share-button">Share via Email</button>
              <button onClick={() => savePlace(place)} className="save-button">Save</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {currentPage > 0 && (
          <button className="pagination-button" onClick={() => fetchMorePlaces(currentPage - 1)}>Previous</button>
        )}
        {nextPageToken && (
          <button className="pagination-button" onClick={() => fetchMorePlaces(currentPage + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default Search;
