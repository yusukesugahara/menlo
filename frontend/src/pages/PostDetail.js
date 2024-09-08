import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DeleteButton from '../components/DeleteButton';
import './PostDetail.css';
import apiUrl from '../config'; 

const customStyle = {
  ...dark,
  'code[class*="language-"]': {
    ...dark['code[class*="language-"]'],
    color: '#ffffff',
    background: '#000000',
    textShadow: 'none',
    border: 'none',
  },
  'pre[class*="language-"]': {
    ...dark['pre[class*="language-"]'],
    color: '#ffffff',
    background: '#000000',
    textShadow: 'none',
    border: 'none',
  },
};

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);  
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const response = await axios.get(`${apiUrl}/api/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setLikesCount(response.data.likes.length);
        const userId = localStorage.getItem('userId'); 
        setLiked(response.data.likes.includes(userId)); 

        const postData = response.data;
        setPost(postData);

        if (postData.author === userId) {
          setIsOwner(true); 
        }

      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    try {
      if (liked) {
        const response = await axios.post(`${apiUrl}/api/posts/${id}/unlike`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLiked(false);
        setLikesCount(response.data.likes);
      } else {
        const response = await axios.post(`${apiUrl}/api/posts/${id}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLiked(true);
        setLikesCount(response.data.likes);
      }
    } catch (error) {
      console.error('Error updating like status', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container post-deteil">
      <Header />
      <div className='content-wrapper'>
        <Sidebar />
        <div className="main-content">
          <div className='main-content-inner'>
            <h1 className="post-title">{post.title}</h1>
            <div className="post-content">
              <ReactMarkdown components={{ code: ({node, inline, className, children, ...props}) => (
                <SyntaxHighlighter style={customStyle} language={className ? className.replace('language-', '') : ''} PreTag="div" {...props}>
                  {children}
                </SyntaxHighlighter>
              ) }}>
                {post.content}
              </ReactMarkdown>
            </div>
            <button className={liked ? 'like-button liked' : 'like-button not-liked'}  onClick={handleLike} >Like</button>
            <span>&nbsp;{likesCount}</span>&nbsp;<br/><br/>
            {isOwner && (
              <Link to={`/edit/${post._id}`} className="btn btn-primary edit-button" >編集</Link>
            )}
            <DeleteButton
              postId={id}
              isOwner = {isOwner}
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
