import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Search from './components/Search';
import Login from './components/Login';
import Bookmarks from './components/Bookmarks';
import Home from './components/Home';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const logout = () => {
    window.open("http://localhost:5001/auth/logout", "_self");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5001/auth/status", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });

        const data = await response.json();

        if (data.isAuthenticated) {
          fetchUser();
        }

        setAuthChecked(true); // Mark authentication check complete
      } catch (err) {
        console.log(err);
        setAuthChecked(true); // Mark authentication check complete even if there's an error
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5001/auth/login/success", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });

        if (response.status === 200) {
          const resObject = await response.json();
          setUser(resObject.user);
        } else {
          throw new Error("Authentication failed!");
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>; // Render loading state while authentication check is in progress
  }

  return (
    <Router>
      <div className="AppContainer">
        <div className="App">
          <header className="App-header">
            <button className="menu-toggle" onClick={toggleMenu}>
              ☰
            </button>
            <nav className={`menu ${isOpen ? 'open' : ''}`}>
              <button className="menu-close" onClick={toggleMenu}>✖</button>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/bookmarks">Bookmarks</Link></li>
                <li>
                  {user ? (
                    <Link onClick={logout}>Logout</Link>
                  ) : (
                    <Link to="/login">Login</Link>
                  )}
                </li>
              </ul>
            </nav>
            <span className="logo">
              <Link className="link" to="/">
                BizScout
              </Link>
            </span>
            {user ? (
              <ul className="list">
                {user.photos && user.photos.length > 0 && (
                  <li className="listItem">
                    <img
                      src={user.photos[0].value}
                      alt=""
                      className="avatar"
                    />
                  </li>
                )}
                <li className="listItem">{user.displayName}</li>
                <li className="listItem" onClick={logout}>
                  Logout
                </li>
              </ul>
            ) : (
              <Link className="link" to="/login">
                Login
              </Link>
            )}
          </header>
          <main className={`App-main ${isOpen ? 'open' : ''}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/bookmarks" element={<Bookmarks user={user} />} />
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            </Routes>
          </main>
          <footer className="App-footer">
            <div>
              <p>&copy; 2024 BizScout. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
