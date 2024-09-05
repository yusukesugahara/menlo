import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './Home.css';
import apiUrl from '../config'; 

const Home = () => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container">
      <Header />
      <div className='content-wrapper'>
        <Sidebar />
        <div className="main-content">
          <h2 className="title">投稿一覧</h2>
          <div className="grid">
            {posts.map(post => (
              
                <div className="card">
                  <Link to={`/post/${post._id}`} className="card-link" key={post._id}>
                    <p className="card-title">{post.title}</p>
                  </Link>
                  <p className="card-author-name">{post.author.username}</p>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
