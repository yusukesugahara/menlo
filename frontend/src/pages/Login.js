import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import apiUrl from '../config'; 

const Login = () => {
  const [email, setEmail] = useState('');  // email用の状態変数
  const [password, setPassword] = useState('');  // password用の状態変数
  const [error, setError] = useState('');  // エラーメッセージ用の状態変数
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);

      navigate('/');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);  // エラーメッセージを状態にセット
      } else {
        setError('Login failed. Please try again.');
      }
      console.error('Login failed', error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <div className="login-form">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleLogin} className="login-button">Login</button>
        <Link to="/sign-up" className="signup-link">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
