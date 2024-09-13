import React, { useState } from 'react';
import AddRecordModal from './AddRecordModal';

const FloatingButton = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <>
            <button
                onClick={openModal}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: 'var(--accent-color-2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '55px',
                    height: '55px',
                    fontSize: '24px',
                    cursor: 'pointer',
                }}
            >
                +
            </button>
            <AddRecordModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
};

export default FloatingButton;
