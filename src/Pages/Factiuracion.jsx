import React, { useEffect, useState } from 'react';

const targetDate = new Date('2025-10-31T23:59:59');

const Facturacion = () => {
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
    const [loading, setLoading] = useState(true); // <- Estado de carga

    function getTimeRemaining() {
        const total = targetDate - new Date();
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        return { total, days, hours, minutes, seconds };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const updated = getTimeRemaining();
            if (updated.total <= 0) {
                clearInterval(timer);
            }
            setTimeLeft(updated);
        }, 1000);

        // Simula "cargando datos"
        const loadingTimer = setTimeout(() => {
            setLoading(false);
        }, 2000); // 4 segundos

        return () => {
            clearInterval(timer);
            clearTimeout(loadingTimer);
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-base text-center p-4">
                <img src="./img/mario-no.gif" alt="Cargando sistema..." className="w-64 md:w-96 mb-6" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-base text-center mb-20 md:mb-0">
            <div className="flex flex-row items-center justify-center gap-20 w-full">
                <img src="./img/worki.gif" alt="trabajo duro" className="w-48 md:w-56" />
                <img src="./img/work.gif" alt=" trabajo duro" className="w-48 md:w-56" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-900 mb-4">
                🚧Nuestro equipo aún está trabajando en esto🚧
            </h1>
            <p className="text-xl md:text-2xl text-yellow-800 mb-6">
                Pero no te preocupes, nuestros chalanes están trabajando duro* 🛠️
            </p>
            <div className="flex space-x-4 text-2xl font-mono text-yellow-700 mb-8">
                <div><span className="font-bold">{timeLeft.days}</span>d</div>
                <div><span className="font-bold">{timeLeft.hours}</span>h</div>
                <div><span className="font-bold">{timeLeft.minutes}</span>m</div>
                <div><span className="font-bold">{timeLeft.seconds}</span>s</div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <img src="./img/listo.png" alt="obrero" className="w-58 md:w-96" />
            </div>
            <p className="mt-6 text-sm text-yellow-700">
                *No garantizamos que sepan generar documentos legales de SUNAT
            </p>
        </div>
    );
};

export { Facturacion };
