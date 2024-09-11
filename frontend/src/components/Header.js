import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import './Header.css'

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    navigate('/login');
  };

  return (
    <header>
      <h1>Menlo</h1>
      
      <nav className='header-nav'>
        <SearchBar />
        {token ? (
          <>
            <Link to="/user-page" className="header-button link-no-underline">
              UserPage
            </Link>
            <button onClick={handleLogout} className='header-button'>Logout</button>

          </>
        ) : (
          <>
            <Link to="/login" className="header-button link-no-underline">
              Login
            </Link>
            <Link to="/sign-up" className="header-button link-no-underline">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
