import React from 'react';

const LoadingIndex = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 sm:px-4 py-2 px-2 animate-pulse">

            {/* ASIDE SKELETON */}
            <aside className="hidden lg:block bg-base-white rounded p-6 space-y-4 h-fit sticky top-4">
                <div className="h-4 w-24 bg-base-white rounded-xl"></div>
                <div className="space-y-3 pt-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-[140px] w-full bg-base-white rounded-3xl"></div>
                    ))}
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <div className="space-y-6">
                {/* Calendario en mobile */}
                <div className="lg:hidden mb-4 bg-base-white rounded-3xl p-4 h-[340px]"></div>

                {/* Encabezado */}
                <div className="flex items-center justify-between pb-4 border-b-0 md:border-b border-gray-200 bg-base-white p-6 rounded-t-3xl">
                    <div className="flex flex-col text-left space-y-2">
                        <div className="h-6 w-40 bg-base-white rounded-xl"></div>
                        <div className="hidden md:block h-4 w-28 bg-base-white rounded-xl"></div>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <div className="w-40 h-10 bg-base-white rounded-xl"></div>
                        <div className="w-10 h-10 bg-base-white rounded-lg"></div>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="space-y-6 bg-base-white p-4 rounded-b-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="border rounded-xl p-6 space-y-3">
                                <div className="h-4 w-24 bg-base-white rounded-xl"></div>
                                <div className="h-6 w-28 bg-base-white rounded-xl"></div>
                                <div className="h-5 w-10 bg-base-white rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Segunda sección: Distritos + Calendario */}
                <div className="mt-2 grid grid-cols-1 gap-6 bg-base p-1 rounded-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[29%_70%] gap-4">
                        {/* Top distritos */}
                        <div className="p-6 bg-base-white rounded-3xl space-y-4">
                            <div className="h-6 w-40 bg-base-white rounded-xl"></div>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center p-3 border-b">
                                    <div className="h-4 w-32 bg-base-white rounded-xl"></div>
                                    <div className="h-6 w-14 bg-base-white rounded-full"></div>
                                </div>
                            ))}
                        </div>

                        {/* Calendario en desktop */}
                        <div className="hidden lg:block bg-base-white rounded-3xl">
                            <div className="h-[400px] p-4 bg-base-white rounded-3xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export { LoadingIndex };