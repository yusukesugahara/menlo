import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal'; // モーダルをインポート
import apiUrl from '../config'; 

const DeleteButton = ({ postId, isOwner, setError }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダル表示制御

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to delete a post.');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`${apiUrl}/api/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Post deleted');
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Error deleting post. You may not have permission.');
      if (error.response && error.response.status === 401) {
        setError('Token expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  // モーダルの表示制御
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!isOwner) return null;

  return (
    <>
      <button 
        onClick={openModal}  // 修正された正しいonClickハンドラ
        className="btn btn-primary delete-button"
      >
        削除する
      </button>

      {/* モーダルの表示 */}
      {isModalOpen && (
        <ConfirmModal 
          onConfirm={handleDelete}  // 削除を確定するハンドラ
          onCancel={closeModal}     // モーダルを閉じるハンドラ
          message="本当に削除してよろしいですか？"
        />
      )}
    </>
  );
};

export default DeleteButton;
