import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css'

const PostCard = ({ post, likedPosts, handleLike, likeCounts }) => {
  return (
    <div className="card" key={post._id}>
      <Link to={`/post/${post._id}`} className="card-link">
        <p className="card-title">{post.title}</p>
      </Link>
      <Link to={`/author/${post.author._id}`} className="card-link">
        {post.author.username}
      </Link>
      <div className='card-info'>
        <p className="card-info-text">
          {post.category ? (
              <Link to={`/category/${post.category.name}`} className="category-link card-link">
                {post.category.name}
              </Link>
            ) : 'カテゴリなし'}
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
  );
};

export default PostCard;
