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
                className="fixed bottom-5 right-5 bg-accent-secondary text-accent-secondary-dark rounded-full w-14 h-14 text-2xl shadow-lg transition-colors duration-300 ease-in-out"
            >
                +
            </button>
            <AddRecordModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
};

export default FloatingButton;
