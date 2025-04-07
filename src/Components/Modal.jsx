import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-end justify-center z-50 sm:items-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`
                bg-bg-base-white rounded-t-2xl shadow-xl w-full max-w-3xl
                transform transition-all duration-300 ease-out
                max-h-[90vh] overflow-y-auto
                sm:rounded-2xl sm:max-w-lg sm:max-h-[80vh]
                ${isOpen ? 'translate-y-0' : 'translate-y-full'}
            `}>
                {/* Drag Handle */}
                <div className="sticky top-0 pt-3 pb-1 flex justify-center z-10 bg-bg-base-white">
                    <button
                        onClick={onClose}
                        className="w-10 h-1.5 bg-gray-300 rounded-full cursor-pointer focus:outline-none"
                        aria-label="Cerrar modal"
                    />
                </div>


                {/* Content */}
                <div className="p-6 pt-2 text-text-primary">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default React.memo(Modal);