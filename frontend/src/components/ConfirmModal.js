import React from 'react';
import './ConfirmModal.css'

const ConfirmModal = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onConfirm} className="confirm-button confirm-button-delete">削除</button>
        <button onClick={onCancel} className="confirm-button" style={{ marginLeft: '10px' }}>キャンセル</button>
      </div>
    </div>
  );
};

export default ConfirmModal;
