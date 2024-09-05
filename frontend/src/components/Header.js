import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        {/* ログインしているかどうかでボタンを切り替える */}
        {token ? (
          // ログインしている場合
          <>
            <Link to="/user-page" className="link-no-underline">
              <button className='header-button'>UserPage</button>
            </Link>
            <button onClick={handleLogout} className='header-button'>Logout</button>
          </>
        ) : (
          // ログインしていない場合
          <>
            <Link to="/login" className="link-no-underline">
              <button className='header-button'>Login</button>
            </Link>
            <Link to="/signup" className="link-no-underline">
              <button className='header-button'>Sign Up</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
