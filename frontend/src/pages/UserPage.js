import React, { useState, useEffect } from 'react';
import api from '../utils/api';  // カスタムaxiosインスタンス
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import apiUrl from '../config'; 

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');  // ログインしていない場合はログイン画面へ
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const response = await api.get(`${apiUrl}/api/user-page`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setError('Failed to load posts. Please try again.');
        if (error.response && error.response.status === 401) {
          setError('Token expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');  // ログイン画面にリダイレクト
        }
      }
    };

    fetchUserPosts();
  }, [navigate]);

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
              <Link to={`/post/${post._id}`} className="card-link" key={post._id}>
                <div className="card">
                  <p className="card-title">{post.title}</p>
                  <div className='card-info'>
                    <p className="card-info-text">
                      {/* カテゴリが存在する場合のみ表示 */}
                      {post.category ? post.category.name : 'カテゴリなし'}
                    </p>
                    <p className="card-info-text">
                      {new Date(post.createdAt).toLocaleDateString('ja-JP', {year: 'numeric',month: 'numeric',day: 'numeric',})}
                    </p>
                  </div>                
                  <div className="button-container">
                    <button className="button">Like</button>
                    <span>12</span>&nbsp;
                    <button className="button">Good</button>
                    <span>1</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPosts;
