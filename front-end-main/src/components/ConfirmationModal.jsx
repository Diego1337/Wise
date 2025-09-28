import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal">
      <div className="confirmation-icon">
        <FaExclamationTriangle />
      </div>
      <h2 className="confirmation-title">Atenção</h2>
      <p className="confirmation-message">{message}</p>
      <div className="confirmation-actions">
        <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
        <button className="btn-confirm-delete" onClick={onConfirm}>Sim, excluir</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;