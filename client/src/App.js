import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Search from './components/Search';
import Login from './components/Login';
import Bookmarks from './components/Bookmarks';
import Info from './components/Info';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const logout = () => {
    window.open("http://localhost:5001/auth/logout", "_self");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:5001/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

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
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/bookmarks">Bookmarks</Link></li>
                <li><Link to="/info">Info</Link></li>
              </ul>
            </nav>
            <span className="logo">
              <Link className="link" to="/">
                BizScout
              </Link>
            </span>
            {user ? (
              <ul className="list">
                <li className="listItem">
                  <img
                    src={user.photos[0].value}
                    alt=""
                    className="avatar"
                  />
                </li>
                <li className="listItem">{user.displayName}</li>
                <li className="listItem" onClick={logout}>
                  Logout
                </li>
              </ul>
            ) : (
              <Link className="link" to="login">
                Login
              </Link>
            )}
          </header>
          <main className={`App-main ${isOpen ? 'open' : ''}`}>
            <Routes>
              <Route path="/" element={<Search />} />
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/info" element={<Info />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
