import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="flex justify-center mb-6">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="p-2 w-full max-w-lg border bg-bg-base-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-accent-secondary"
            />
        </div>
    );
};

export default SearchBar;
