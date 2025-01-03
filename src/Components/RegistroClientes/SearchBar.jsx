import React from 'react';
import { MdOutlineSearch } from "react-icons/md";


const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="relative mb-6">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar... 2706, Cliente"
                className="p-2 pl-10 w-full max-w-lg bg-bg-base-white rounded-xl shadow-sm focus:outline-none focus:border-accent-secondary"
            />
            <MdOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />

        </div>
    );
};

export default SearchBar;
