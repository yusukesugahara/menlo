import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
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
      <Sidebar />
      <div className="main-content">
        <h2 className="title">相談</h2>
        <div className="grid">
          {posts.map(post => (
            <Link to={`/post/${post._id}`} className="card-link" key={post._id}>
              <div className="card">
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
