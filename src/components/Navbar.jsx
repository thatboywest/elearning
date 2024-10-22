import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false); // For controlling the mobile menu

  // Toggle the navbar-burger and menu visibility
  const toggleNavbar = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar is-link is-light" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <strong>E-Learning Platform</strong>
        </Link>

        {/* Hamburger button for mobile view */}
        <a
          role="button is-info is-dark"
          className={`navbar-burger ${isActive ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={toggleNavbar}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-end">
          <Link className="navbar-item" to="/courses">Courses</Link>
          <Link className="navbar-item" to="/about">About Us</Link>

          {!user ? (
            <div className="navbar-item has-text-centered">
              <div className="buttons">
                <Link className="button is-link is-light" to="/login">Login</Link>
                <Link className="button is-link is-dark" to="/signup">Sign Up</Link>
              </div>
            </div>
          ) : (
            <div className="navbar-item">
              <button
                className="button is-danger"
                onClick={logout}
                style={{
                  borderRadius: '5px',
                  marginLeft: '10px',
                  fontWeight: 'bold',
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
