import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import apiUrl from '../config'; 

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
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
  }, [navigate]);


  const handleLike = async (postId, liked) => {
    const token = localStorage.getItem('token');
  
    try {
      if (liked) {
        await axios.post(`${apiUrl}/api/posts/${postId}/unlike`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikedPosts(prevState => ({
          ...prevState,
          [postId]: false
        }));
        setLikeCounts(prevCounts => ({
          ...prevCounts,
          [postId]: prevCounts[postId] - 1 
        }));
      } else {
        await axios.post(`${apiUrl}/api/posts/${postId}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikedPosts(prevState => ({
          ...prevState,
          [postId]: true
        }));
        setLikeCounts(prevCounts => ({
          ...prevCounts,
          [postId]: prevCounts[postId] + 1 
        }));
      }
    } catch (error) {
      console.error('Error updating like status', error);
    }
  };


  return (
    <div className="container">
      <Header />
      <div className='content-wrapper'>
        <Sidebar />
        <div className="main-content">
          {error && <p>{error}</p>}
          <h2 className="title">My投稿一覧</h2>
          <div className="grid">
          {posts.map(post => (
                <div className="card" key={post._id}>
                  <Link to={`/post/${post._id}`} className="card-link">
                    <p className="card-title">{post.title}</p>
                  </Link>
                  <div className='card-info'>
                    <p className="card-info-text">
                      {post.category ? post.category.name : 'カテゴリなし'}
                    </p>
                    <p className="card-info-text">
                      {new Date(post.createdAt).toLocaleDateString('ja-JP', {year: 'numeric',month: 'numeric',day: 'numeric',})}
                    </p>
                  </div>                
                  <div className="button-container">
                    <button 
                      onClick={() => handleLike(post._id, likedPosts[post._id])}
                      className={likedPosts[post._id] ? 'like-button liked' : 'like-button not-liked'}
                    >Like
                    </button>
                    <span>&nbsp;{likeCounts[post._id]}</span>&nbsp; 
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPosts;
