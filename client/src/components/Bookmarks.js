// client/src/components/Bookmarks.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// Styled components
const BookmarksContainer = styled.div`
  background-color: #f0f4f8;
  border-radius: 20px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 800px;
  margin: 20px auto;
`;

const BookmarkItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 10px;
  margin-bottom: 15px;
`;

const BookmarkInfo = styled.div`
  flex: 1;
`;

const BusinessName = styled.h3`
  font-size: 20px;
  color: #1a202c;
  margin-bottom: 5px;
`;

const BusinessAddress = styled.p`
  font-size: 16px;
  color: #4a5568;
  margin-bottom: 5px;
`;

const BusinessPhone = styled.p`
  font-size: 16px;
  color: #4a5568;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const DeleteButton = styled.button`
  background-color: #e53e3e;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
`;

const ShareButton = styled.button`
  background-color: #3182ce;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
`;

const Bookmarks = ({ user }) => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get('http://localhost:5001/bookmarks', { withCredentials: true });
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      alert('Failed to fetch bookmarks.');
    }
  };

  const deleteBookmark = async (name, address) => {
    try {
      await axios.delete('http://localhost:5001/bookmarks', {
        data: { name, address },
        withCredentials: true,
      });
      setBookmarks(bookmarks.filter(bookmark => !(bookmark.place.name === name && bookmark.place.formatted_address === address)));
      alert('Bookmark deleted successfully!');
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      alert('Failed to delete bookmark.');
    }
  };

  const sharePlaceByEmail = (place) => {
    const subject = `Check out ${place.name}`;
    const body = `I found this place:\n\nName: ${place.name}\nAddress: ${place.formatted_address}\nPhone: ${place.formatted_phone_number || 'N/A'}`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  };

  return (
    <BookmarksContainer>
      <h1>Your Bookmarks</h1>
      {user ? (
        bookmarks.length === 0 ? (
          <p>No bookmarks saved yet.</p>
        ) : (
          <ul>
            {bookmarks.map((bookmark, index) => (
              <BookmarkItem key={index}>
                <BookmarkInfo>
                  <BusinessName>{bookmark.place.name}</BusinessName>
                  <BusinessAddress>{bookmark.place.formatted_address}</BusinessAddress>
                  <BusinessPhone>{bookmark.place.formatted_phone_number || 'Phone number not available'}</BusinessPhone>
                </BookmarkInfo>
                <ButtonContainer>
                  <ShareButton onClick={() => sharePlaceByEmail(bookmark.place)}>Share</ShareButton>
                  <DeleteButton onClick={() => deleteBookmark(bookmark.place.name, bookmark.place.formatted_address)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </DeleteButton>
                </ButtonContainer>
              </BookmarkItem>
            ))}
          </ul>
        )
      ) : (
        <p>Please log in to view bookmarks.</p>
      )}
    </BookmarksContainer>
  );
};

export default Bookmarks;
