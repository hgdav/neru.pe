import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-bg-base rounded-3xl shadow-lg max-w-3xl w-full p-6 pb-10 relative max-h-screen overflow-y-auto sm:max-w-lg ">
                <button
                    className="absolute top-4 right-4 text-accent-secondary hover:text-red-500 text-2xl font-bold focus:outline-none"
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
