import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null; // No renderizar el modal si no está abierto
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <div className="modal-body">
                    {children} {/* Aquí pasamos los detalles del cliente */}
                </div>
            </div>
        </div>
    );
};

export default Modal;
