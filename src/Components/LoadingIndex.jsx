import React from 'react';

const LoadingIndex = () => {
    return (
        <div className="min-h-screen p-4 bg-bg-base mt-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Sección Calendario */}
                <div className="border-gray-300 bg-bg-base-white shadow rounded-3xl p-4 min-h-[800px]">
                    <div className="w-full max-w-3xl float-right animate-pulse">

                    </div>
                </div>

                {/* Sección Gráficos */}
                <div className="bg-bg-base-white shadow rounded-3xl p-4 min-h-[800px]">

                    <div className="w-full max-w-3xl animate-pulse">

                    </div>
                </div>
            </div>
        </div>
    );
};

export { LoadingIndex };