import React from 'react';

const LoadingInventario = () => {
    return (
        <div className="animate-pulse">
            {/* Header */}
            <div className="border-b p-2 pb-0 mb-4">
                <div className="flex flex-row justify-between items-center mb-6">
                    <div className="h-6 w-36 bg-base-white rounded-xl"></div>
                    <div className="h-10 w-32 bg-base-white rounded-xl"></div>
                </div>

                {/* Filtros talla */}
                <div className="flex gap-4 flex-wrap">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-5 w-10 bg-base-white rounded-xl"></div>
                    ))}
                </div>
            </div>

            {/* Lista de prendas */}
            <div className="border bg-base-white rounded-3xl overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-bg-base-white border-b last:border-b-0 px-4 py-3 flex justify-between items-center"
                    >
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 bg-base-white rounded-xl"></div>
                            <div className="h-3 w-24 bg-base-white rounded-xl"></div>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                            <div className="h-6 w-10 bg-base-white rounded-xl"></div>
                            <div className="w-8 h-8 rounded-full bg-base-white"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default LoadingInventario;


