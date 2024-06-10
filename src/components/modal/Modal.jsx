import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    {children}
                </div>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="button">OK</button>
                    <button onClick={onClose} className="button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
