import { useEffect } from 'react';

const DisableSwipeReload = () => {
    useEffect(() => {
        const preventDefault = (e) => {
            if (e.touches && e.touches.length > 1) {
                e.preventDefault();
            }
        };

        window.addEventListener('touchmove', preventDefault, { passive: false });

        return () => {
            window.removeEventListener('touchmove', preventDefault);
        };
    }, []);

    return null;
};

export default DisableSwipeReload;
