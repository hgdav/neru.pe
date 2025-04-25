import React, { useEffect, useState, useRef, useCallback } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    const [startY, setStartY] = useState(null);
    const [currentY, setCurrentY] = useState(0);
    const [isSwipingFromHandle, setIsSwipingFromHandle] = useState(false);
    const modalContentRef = useRef(null);

    const triggerClose = useCallback(() => {
        onClose();
        setIsSwipingFromHandle(false);
        setStartY(null);
        setCurrentY(0);
        if (modalContentRef.current) {
            modalContentRef.current.style.transform = '';
            modalContentRef.current.style.transition = '';
        }
    }, [onClose]);

    // --- Funciones de Swipe ---
    const handleTouchStart = useCallback((e) => {
        if (!isOpen) return;
        setStartY(e.touches[0].clientY);
        setCurrentY(0);
        setIsSwipingFromHandle(true);
        if (modalContentRef.current) {
            modalContentRef.current.style.transition = 'none';
        }
    }, [isOpen]);

    const handleTouchMove = useCallback((e) => {
        if (!isSwipingFromHandle || startY === null || !modalContentRef.current) return;

        const touch = e.touches[0];
        const deltaY = touch.clientY - startY;

        if (deltaY >= 0) {
            setCurrentY(deltaY);
            modalContentRef.current.style.transform = `translateY(${deltaY}px)`;
        } else {
            setCurrentY(0);
            modalContentRef.current.style.transform = `translateY(0px)`;
        }
    }, [isSwipingFromHandle, startY]);

    const handleTouchEnd = useCallback(() => {
        if (!isSwipingFromHandle || startY === null || !modalContentRef.current) return;

        const threshold = Math.min(100, window.innerHeight * 0.20);
        if (modalContentRef.current) {
            modalContentRef.current.style.transition = '';
        }

        if (currentY > threshold) {
            triggerClose();
        } else {
            if (modalContentRef.current) {
                modalContentRef.current.style.transform = '';
            }
            // Resetear estados de swipe
            setIsSwipingFromHandle(false);
            setStartY(null);
            setCurrentY(0);
        }

    }, [isSwipingFromHandle, startY, currentY, triggerClose]);

    const handleHandleClick = useCallback(() => {
        if (!isOpen || isSwipingFromHandle) return;
        triggerClose();
    }, [isOpen, isSwipingFromHandle, triggerClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setCurrentY(0);
            if (modalContentRef.current) {
                modalContentRef.current.style.transform = '';
                modalContentRef.current.style.transition = '';
            }
            setIsSwipingFromHandle(false);
            setStartY(null);

        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-end justify-center z-50 sm:items-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
                onClick={() => !isSwipingFromHandle && handleHandleClick()}
            />

            {/* Modal Container */}
            <div
                ref={modalContentRef}
                className={`
                    bg-bg-base-white rounded-t-2xl shadow-xl w-full max-w-3xl
                    transform transition-transform duration-300 ease-out
                    flex flex-col max-h-[90vh]
                    sm:rounded-2xl sm:max-w-lg sm:max-h-[85vh]
                    translate-y-0  /* Estado abierto por defecto */
                    animate-slide-up sm:animate-none /* Animación de entrada */
                `}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag Handle */}
                <div
                    className="sticky top-0 pt-3 pb-2 flex justify-center z-10 bg-bg-base-white cursor-grab sm:hidden flex-shrink-0 rounded-t-2xl"
                    style={{ touchAction: 'none' }}
                    onTouchStart={handleTouchStart}
                    onClick={handleHandleClick}
                    aria-label="Arrastrar o tocar para cerrar"
                >
                    <div className="w-10 h-1.5 bg-gray-300 rounded-full pointer-events-none" />
                </div>

                {/* Contenido Scrollable */}
                <div
                    className="p-6 pt-2 sm:pt-6 text-text-primary overflow-y-auto flex-grow"
                    style={{ touchAction: 'pan-y' }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default React.memo(Modal);