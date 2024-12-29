import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="flex justify-center mb-6">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar... 2706, Cliente"
                className="p-2 w-full max-w-lg bg-bg-base-white rounded-xl shadow-sm focus:outline-none focus:border-accent-secondary"
            />
        </div>
    );
};

export default SearchBar;
