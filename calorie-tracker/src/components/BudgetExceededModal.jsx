import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import './BudgetExceededModal.css';

function BudgetExceededModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button 
          type="button" 
          className="close-btn" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        <div className="modal-header">
          <AlertCircle className="warning-icon" size={32} />
          <h3>Daily Budget Exceeded!</h3>
        </div>
        <p className="modal-message">
          You've exceeded your daily calorie target by <strong>{Math.round(data.over)} kcal</strong>.
        </p>
        <div className="modal-stats">
          <div className="stat">
            <span>Current</span>
            <strong>{Math.round(data.current)} kcal</strong>
          </div>
          <div className="stat">
            <span>Target</span>
            <strong>{Math.round(data.target)} kcal</strong>
          </div>
          <div className="stat over">
            <span>Over</span>
            <strong>{Math.round(data.over)} kcal</strong>
          </div>
        </div>
        <button type="button" className="got-it-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}

export default BudgetExceededModal;
