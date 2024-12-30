import React, { useState } from 'react';


const FilterByStatus = ({ handleFilter }) => {

    const [isClicked, setIsClicked] = useState(false);
    const handleClick = () => {
        setIsClicked(!isClicked);
        handleFilter();
    };

    return (
        <div className="mb-6">
            <button
                onClick={handleClick}
                className={`px-3 py-2 rounded-xl text-sm transition duration-300 ${isClicked ? 'bg-accent-secondary text-accent-secondary-dark' : 'bg-bg-base-white text-text-primary'}`}
            >
                Hoy
            </button>
        </div>
    );
};

export default FilterByStatus;
