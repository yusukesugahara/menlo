import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import apiUrl from '../config';

const KeywordPosts = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const keyword = query.get('keywords');

  useEffect(() => {
    const fetchPostsByKeyword = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/posts?keywords=${keyword}`);
        setPosts(response.data);

        const initialLikedPosts = {};
        const initialLikeCounts = {};

        response.data.forEach(post => {
          initialLikedPosts[post._id] = post.likes.includes(localStorage.getItem('userId'));
          initialLikeCounts[post._id] = post.likes.length;
        });

        setLikedPosts(initialLikedPosts);
        setLikeCounts(initialLikeCounts);
      } catch (error) {
        console.error('Error fetching posts by keyword:', error);
      }
    };

    if (keyword) {
      fetchPostsByKeyword();
    }
  }, [keyword]);


  return (
    <div className="container">
      <Header />
      <div className='content-wrapper'>
        <Sidebar />
        <div className="main-content">
          <h2 className="title">{keyword} の投稿一覧</h2>
          <div className="grid">
          {posts.map(post => (
              <PostCard
              key={post._id}
              post={post}
              likedPosts={likedPosts}
              setLikedPosts={setLikedPosts} 
              setLikeCounts={setLikeCounts} 
              likeCounts={likeCounts}
            />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordPosts;
