import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import apiUrl from '../config'; 
import './UserPage.css'

const UserPosts = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); 
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user-page`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPosts(response.data);

        const initialLikedPosts = {};
        const initialLikeCounts = {};

        response.data.forEach(post => {
          initialLikedPosts[post._id] = post.likes.includes(localStorage.getItem('userId'));
          initialLikeCounts[post._id] = post.likes.length;
        });

        setLikedPosts(initialLikedPosts);
        setLikeCounts(initialLikeCounts);

      } catch (error) {
        console.error('Error fetching user posts:', error);
        setError('Failed to load posts. Please try again.');
        if (error.response && error.response.status === 401) {
          setError('Token expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login'); 
        }
      }
    };
    fetchUserPosts();

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/api/profiles/${localStorage.getItem('userId')}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(response.data.user.username);
        setBio(response.data.bio);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('プロフィールの取得に失敗しました。');
      }
    };
    fetchProfile();
    
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${apiUrl}/api/profiles/${localStorage.getItem('userId')}`, { username, bio }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('プロフィールが更新されました');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('プロフィールの更新に失敗しました。');
    }
  };


  return (
    <div className="container">
      <Header />
      <div className='content-wrapper'>
        <Sidebar />
        <div className="main-content">
          <h2 className="title">プロフィール編集</h2>
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group form-group-profile">
              <label htmlFor="username">ユーザー名:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group form-group-profile">
              <label htmlFor="bio">プロフィール概要:</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>
            <button type="submit" className='form-group-profile-button'>更新</button>
          </form>
          <h2 className="title">My 投稿一覧</h2>
          <div className="grid">
            {posts.map(post => (
              <PostCard
              key={post._id}
              post={post}
              likedPosts={likedPosts}
              setLikedPosts={setLikedPosts} 
              setLikeCounts={setLikeCounts} 
              likeCounts={likeCounts}
            />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPosts;
