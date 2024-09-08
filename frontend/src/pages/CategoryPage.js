import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import apiUrl from '../config'; 

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/posts?category=${categoryName}`);
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
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [categoryName]);

  const handleLike = async (postId, liked) => {
    const token = localStorage.getItem('token');
  
    try {
      if (liked) {
        await axios.post(`${apiUrl}/api/posts/${postId}/unlike`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikedPosts(prevState => ({
          ...prevState,
          [postId]: false
        }));
        setLikeCounts(prevCounts => ({
          ...prevCounts,
          [postId]: prevCounts[postId] - 1 
        }));
      } else {
        await axios.post(`${apiUrl}/api/posts/${postId}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikedPosts(prevState => ({
          ...prevState,
          [postId]: true
        }));
        setLikeCounts(prevCounts => ({
          ...prevCounts,
          [postId]: prevCounts[postId] + 1 
        }));
      }
    } catch (error) {
      console.error('Error updating like status', error);
    }
  };


  return (
    <div className="container">
      <Header />
      <div className='content-wrapper'>
        <Sidebar />
        <div className="main-content">
          <h2 className="title">{categoryName} の記事一覧</h2>
          <div className="grid">
          {posts.map(post => (
              <PostCard
              key={post._id}
              post={post}
              likedPosts={likedPosts}
              handleLike={handleLike}
              likeCounts={likeCounts}
            />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
