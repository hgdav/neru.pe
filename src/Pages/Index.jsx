import React from 'react';
import Graficos from '../Components/Graficos/Graficos';
import Calendario from '../Components/Calendario/Calendario';

const Index = () => {

    return (
        <div className="min-h-screen p-4 bg-bg-base mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                <div className="bg-bg-base-white shadow rounded-3xl p-4">
                    <div className="w-full max-w-3xl mx-auto">
                        <Calendario />
                    </div>
                </div>

                <div className="bg-bg-base-white shadow rounded-3xl p-4">
                    <div className="w-full max-w-3xl mx-auto">
                        <Graficos />
                    </div>
                </div>

            </div>

            {/*<div className="bg-bg-base-white shadow rounded-3xl p-4">
                <div className="bg-bg-base-white py-4 px-2">
                    <h2 className="text-2xl text-center font-bold mb-4">SCUM TIME</h2>
                    <Tareas />
                </div>
            </div>*/}
        </div>
    );
}

export { Index };
