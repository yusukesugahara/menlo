import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [prompts, setPrompts] = useState([
    { _id: '1', title: 'ちゃんと答えが返ってくるプロンプトができた' },
    { _id: '2', title: 'ちゃんと答えが返ってくるプロンプトができた' }
  ]);

  return (
    <div className="container">
      {/* サイドバー */}
      <div className="sidebar">
        <h2 className="title">その他</h2>
        <ul>
          <li className="menu-item"><Link to="/create">記事投稿</Link></li>
        </ul>

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

      {/* メインコンテンツ */}
      <div className="main-content">
        <h2 className="title">相談</h2>
        <div className="grid">
          {prompts.map(prompt => (
            <div className="card" key={prompt._id}>
              <p className="card-title">{prompt.title}</p>
              <div className="card-info">
                <div className="card-info-icon"><img src="" alt="icon" /></div>
                <p className="card-info-text">名前 日時</p>
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
