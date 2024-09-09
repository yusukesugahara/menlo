import axios from 'axios';
import apiUrl from '../config';

export const handleLike = async (postId, liked, setLikedPosts, setLikeCounts) => {
  const token = localStorage.getItem('token');
  
  if (typeof setLikedPosts !== 'function' || typeof setLikeCounts !== 'function') {
    console.error('setLikedPosts or setLikeCounts is not a function');
    return;
  }

  try {
    const endpoint = liked ? 'unlike' : 'like';
    await axios.post(`${apiUrl}/api/posts/${postId}/${endpoint}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setLikedPosts(prevState => ({
      ...prevState,
      [postId]: !liked
    }));

    setLikeCounts(prevCounts => ({
      ...prevCounts,
      [postId]: liked ? prevCounts[postId] - 1 : prevCounts[postId] + 1
    }));
  } catch (error) {
    console.error('Error updating like status', error);
  }
};
