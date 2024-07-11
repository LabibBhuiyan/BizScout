import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
      <div className="menu-toggle" onClick={toggleMenu}>
        <div className="hamburger"></div>
      </div>
      <div className="menu-items">
        <Link to="/login" onClick={toggleMenu}>Login</Link>
        <Link to="/bookmarks" onClick={toggleMenu}>Bookmarks</Link>
        <Link to="/how-to-use" onClick={toggleMenu}>How to Use</Link>
      </div>
    </div>
  );
};

export default HamburgerMenu;
