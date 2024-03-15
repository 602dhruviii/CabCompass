// CongratulationsModal.js
import React from 'react';
import congimage from '../Assets/congimage.png';
import '../Styles/CongratulationsModal.css'; // Import CSS file for modal styles

const CongratulationsModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <img src={congimage} alt="Congratulations" className="congratulations-image" />
      </div>
    </div>
  );
};

export default CongratulationsModal;
