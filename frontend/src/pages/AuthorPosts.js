import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link  } from 'react-router-dom';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import apiUrl from '../config';

const AuthorPosts = () => {
  const { authorId } = useParams(); 
  const [posts, setPosts] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const fetchAuthorPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/author/${authorId}`);
        setPosts(response.data);
        if (response.data.length > 0) {
          setAuthorName(response.data[0].author.username); // 作者の名前をセット
          const initialLikedPosts = {};
          const initialLikeCounts = {};
  
          response.data.forEach(post => {
            initialLikedPosts[post._id] = post.likes.includes(localStorage.getItem('userId'));
            initialLikeCounts[post._id] = post.likes.length;
          });
  
          setLikedPosts(initialLikedPosts);
          setLikeCounts(initialLikeCounts);


        }
      } catch (error) {
        console.error('Error fetching author posts:', error);
      }
    };

    fetchAuthorPosts();
  }, [authorId]);


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
          <h2 className="title">{authorName} の記事一覧</h2>
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

export default AuthorPosts;
