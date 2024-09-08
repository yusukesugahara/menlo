import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import apiUrl from '../config'; 

const Sidebar = () => {
  const [keywordStats, setKeywordStats] = useState([]);

  useEffect(() => {
    const fetchKeywordStats = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/keywords/statistics`);
        setKeywordStats(response.data);
      } catch (error) {
        console.error('Error fetching keyword statistics:', error);
      }
    };

    fetchKeywordStats();
  }, []);

  return (
    <div className="sidebar">
      <Link to="/" className="create-post-button">Home</Link>
      <Link to="/create" className="create-post-button">新しい投稿を作成</Link>
      <h2 className="title">人気のキーワード</h2>
      <ul>
        {keywordStats.length > 0 ? (
          keywordStats.map((keyword) => (
            <li key={keyword._id} className="menu-item">
              <Link to={`/posts?keywords=${keyword._id}`}>
                {keyword._id} ({keyword.count})
              </Link>
            </li>
          ))
        ) : (
          <p>キーワードが見つかりません。</p>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
