// Info.js
import React from 'react';
import './Info.css';

const Info = () => {
  return (
    <div className="info-container">
      <section className="intro-section">
        <h1>Welcome to BizScout</h1>
        <p>Discover and explore businesses near you with BizScout.</p>
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <ul>
          <li>Search for businesses based on location.</li>
          <li>Filter results by category or rating.</li>
          <li>Bookmark favorite businesses for quick access.</li>
          <li>View detailed information about each business.</li>
        </ul>
      </section>

      <section className="how-to-use-section">
        <h2>How to Use BizScout</h2>
        <ol>
          <li>Enter your location to search for nearby businesses.</li>
          <li>Filter search results based on your preferences.</li>
          <li>Bookmark your favorite places for quick access.</li>
          <li>Explore detailed information about each business.</li>
        </ol>
      </section>

      <section className="contact-section">
        <h2>Contact Me</h2>
        <p>Hi, I'm [Your Name], the creator of BizScout. I'm passionate about helping people discover local businesses.</p>
        <p>Feel free to reach out to me at [Your Email Address] for any questions or feedback!</p>
      </section>
    </div>
  );
}

export default Info;
