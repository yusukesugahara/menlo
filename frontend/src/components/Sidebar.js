import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="sidebar">
      <Link to="/" className="create-post-button">Home</Link>
      <Link to="/create" className="create-post-button">新しい投稿を作成</Link>
      <h2 className="title">カテゴリ</h2>
      <ul>
        {categories.map((category) => (
          <li key={category._id} className="menu-item">
            <Link to={`/category/${category.name}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;