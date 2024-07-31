import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="create-post-button">Home</Link>
      <Link to="/create" className="create-post-button">新しい投稿を作成</Link>
      <h2 className="title">相談</h2>
      <ul>
        <li className="menu-item"><Link to="#">人生相談</Link></li>
        <li className="menu-item"><Link to="#">転職相談</Link></li>
      </ul>

      <h2 className="title">アイディア出し</h2>
      <ul>
        <li className="menu-item"><Link to="#">企画</Link></li>
      </ul>

      <h2 className="title">プログラミング</h2>
      <ul>
        <li className="menu-item"><Link to="#">VBA開発</Link></li>
        <li className="menu-item"><Link to="#">ホームページ制作</Link></li>
        <li className="menu-item"><Link to="#">Python</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
