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
                className={`px-2 py-2 rounded-xl text-sm py-2 px-2 transition duration-300 ${isClicked ? 'bg-accent-secondary text-accent-secondary-dark' : 'bg-bg-base-white text-text-primary'}`}
            >
                Hoy
            </button>
        </div>
    );
};

export default FilterByStatus;
