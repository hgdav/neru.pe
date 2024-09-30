import React from 'react';
import { MdFilterAlt } from "react-icons/md";


const FilterByStatus = ({ handleFilter }) => {
    return (
        <div className="mb-6">
            <button
                onClick={handleFilter}
                className="bg-accent-secondary text-accent-secondary-dark px-3 py-3 rounded-md transition duration-300"
            >
                <MdFilterAlt size={12} />
            </button>
        </div>
    );
};

export default FilterByStatus;
