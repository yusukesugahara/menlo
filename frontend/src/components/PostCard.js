import React from 'react';
import { Link } from 'react-router-dom';
import { handleLike } from '../utils/likeHandler';
import './PostCard.css';

const PostCard = ({ post, likedPosts, setLikedPosts, setLikeCounts, likeCounts }) => {

  const onLikeClick = () => {
    handleLike(post._id, likedPosts[post._id], setLikedPosts, setLikeCounts);
  };

  return (
    <div className="card" key={post._id}>
      <Link to={`/post/${post._id}`} className="card-link">
        <p className="card-title">{post.title}</p>
      </Link>
      <div className='card-info'>
        <p className="card-info-text">
          {new Date(post.createdAt).toLocaleDateString('ja-JP', {year: 'numeric',month: 'numeric',day: 'numeric',})}
        </p>
        <Link to={`/author/${post.author._id}`} className="card-link">
          {post.author.username}
        </Link>
      </div>                
      <div className="card-info-text">
        {post.keywords && post.keywords.length > 0 ? (
          post.keywords.map((keyword, index) => (
            <Link 
              to={`/posts?keywords=${keyword}`} 
              key={index} 
              className="keyword-link card-link"
            >
              {keyword}&nbsp;
            </Link>
          ))
        ) : 'キーワードなし'}
      </div>
      <div className="button-container">
        <button 
          onClick={onLikeClick}
          className={likedPosts[post._id] ? 'like-button liked' : 'like-button not-liked'}
        >Like
        </button>
        <span>&nbsp;{likeCounts[post._id]}</span>&nbsp;
      </div>
    </div>
  );
};

export default PostCard;
