import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null; // No renderizar el modal si no está abierto
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-bg-base rounded-3xl shadow-lg max-w-lg w-full mx-4 p-6 relative max-h-screen overflow-y-auto">
                <button
                    className="absolute top-2 right-3 text-accent-secondary-dark hover:text-red-500 text-2xl font-bold focus:outline-none"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="modal-body text-text-primary">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
