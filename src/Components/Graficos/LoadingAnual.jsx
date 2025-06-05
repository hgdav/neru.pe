import React from 'react';

const LoadingAnual = () => {
    return (
        <div className="p-6 space-y-8 bg-base animate-pulse">
            {/* Encabezado */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
                <div className="h-6 w-48 bg-base-white rounded-xl"></div>
                <div className="w-full md:w-64 h-10 bg-base-white rounded-xl"></div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 bg-base-white rounded-xl"></div>
                ))}
            </div>

            {/* Gráficos: Tendencias */}
            <div className="flex flex-col">
                <div className="h-6 w-48 bg-base-white rounded-xl mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 bg-base-white rounded-xl"></div>
                    ))}
                </div>
            </div>

            {/* Gráficos: Consolidado Anual */}
            <div className="flex flex-col">
                <div className="h-6 w-48 bg-base-white rounded-xl mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-64 bg-base-white rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingAnual;

