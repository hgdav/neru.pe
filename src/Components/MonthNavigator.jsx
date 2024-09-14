import React from 'react';

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const MonthNavigator = ({ currentMonth, currentYear, onMonthChange }) => {
    const handlePrevious = () => {
        const newDate = new Date(currentYear, currentMonth - 1);
        onMonthChange(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentYear, currentMonth + 1);
        onMonthChange(newDate);
    };

    return (
        <div className="flex items-center justify-center gap-4 my-4">
            <button
                className="bg-accent-primary text-white rounded-full p-2 hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                onClick={handlePrevious}
            >
                &lt;
            </button>
            <h3 className="text-lg font-bold text-text-primary">
                {months[currentMonth]} {currentYear}
            </h3>
            <button
                className="bg-accent-primary text-white rounded-full p-2 hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                onClick={handleNext}
            >
                &gt;
            </button>
        </div>

    );
};

export default MonthNavigator;
