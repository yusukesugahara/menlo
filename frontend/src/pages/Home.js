import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <Link to="/create" className="create-post-button">新しい投稿を作成</Link>
        <h2 className="title">相談</h2>
        <ul>
          <li className="menu-item"><a href="#">人生相談</a></li>
          <li className="menu-item"><a href="#">転職相談</a></li>
        </ul>

        <h2 className="title">アイディア出し</h2>
        <ul>
          <li className="menu-item"><a href="#">企画</a></li>
        </ul>

        <h2 className="title">プログラミング</h2>
        <ul>
          <li className="menu-item"><a href="#">VBA開発</a></li>
          <li className="menu-item"><a href="#">ホームページ制作</a></li>
          <li className="menu-item"><a href="#">Python</a></li>
        </ul>
      </div>

      <div className="main-content">
        <h2 className="title">相談</h2>
        <div className="grid">
          {posts.map(post => (
            <div className="card" key={post._id}>
              <p className="card-title">{post.title}</p>
              <div className='card-info'>
                <p className="card-info-text">作成日: {new Date(post.createdAt).toLocaleString()}</p>
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
  );
};

export default Home;
