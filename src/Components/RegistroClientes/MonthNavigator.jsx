import React from 'react';
import { MdChevronLeft } from "react-icons/md";
import { MdChevronRight } from "react-icons/md";

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
                className="bg-bg-base-white text-accent-secondary rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                onClick={handlePrevious}
            >
                <MdChevronLeft size={24} />
            </button>
            <h3 className="text-lg font-bold text-text-primary">
                {months[currentMonth]} {currentYear}
            </h3>
            <button
                className="bg-bg-base-white text-accent-secondary rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                onClick={handleNext}
            >
                <MdChevronRight size={24} />
            </button>
        </div>

    );
};

export default MonthNavigator;
