import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import './Header.css'

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');  // JWTトークンを取得してログイン状態を判定

  const handleLogout = () => {
    // ローカルストレージからトークンを削除
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // ログイン画面にリダイレクト
    navigate('/login');
  };

  return (
    <header>
      <h1>Menlo</h1>
      
      <nav className='header-nav'>
        <SearchBar />
        {token ? (
          // ログインしている場合
          <>
            <Link to="/user-page" className="header-button link-no-underline">
              UserPage
            </Link>
            <button onClick={handleLogout} className='header-button'>Logout</button>

          </>
        ) : (
          // ログインしていない場合
          <>
            <Link to="/login" className="header-button link-no-underline">
              Login
            </Link>
            <Link to="/signup" className="header-button link-no-underline">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
