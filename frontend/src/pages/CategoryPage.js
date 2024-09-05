import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar';
import apiUrl from '../config'; 

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/posts?category=${categoryName}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [categoryName]);

  return (
    <div className="container">
      <Header />
      <div className='content-wrapper'>
        <Sidebar />
        <div className="main-content">
          <h2 className="title">{categoryName} の記事一覧</h2>
          <div className="grid">
            {posts.map(post => (
              <Link to={`/post/${post._id}`} className="card-link" key={post._id}>
                <div className="card">
                  <p className="card-title">{post.title}</p>
                  <div className='card-info'>
                    <p className="card-info-text">
                      {/* カテゴリが存在する場合のみ表示 */}
                      カテゴリ: {post.category ? post.category.name : 'カテゴリなし'}
                    </p>
                    <p className="card-info-text">
                      作成日: {new Date(post.createdAt).toLocaleString()}
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

export default CategoryPage;
