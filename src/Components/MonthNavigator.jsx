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
        <div className="month-navigator">
            <button className="nav-button" onClick={handlePrevious}>
                &lt;
            </button>
            <h3>{months[currentMonth]} {currentYear}</h3>
            <button className="nav-button" onClick={handleNext}>
                &gt;
            </button>
        </div>
    );
};

export default MonthNavigator;
