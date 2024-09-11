import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams  } from 'react-router-dom';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import apiUrl from '../config';

const AuthorPosts = () => {
  const { authorId } = useParams(); 
  const [posts, setPosts] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [bio,setBio] = useState('')
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const fetchAuthorPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/author/${authorId}`);
        setPosts(response.data.postWithLikeCount);
        if (response.data.postWithLikeCount.length > 0) {
          setAuthorName(response.data.postWithLikeCount[0].author.username); // 作者の名前をセット
          setBio(response.data.bio)
          const initialLikedPosts = {};
          const initialLikeCounts = {};
  
          response.data.postWithLikeCount.forEach(post => {
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

  return (
    <div className="container">
      <Header />
      <div className='content-wrapper'>
        <Sidebar />
        <div className="main-content">
          <h2 className="title">{authorName} のプロフィール</h2>
          <p>{bio}</p>
          <h2 className="title">{authorName} の記事一覧</h2>
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

export default AuthorPosts;
