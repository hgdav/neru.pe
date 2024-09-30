import React from 'react';
import Tareas from '../Components/Eventos/Tareas';
import Graficos from '../Components/Graficos/Graficos';
import Calendario from '../Components/Calendario/Calendario';

const Index = () => {
    return (
        <div className="min-h-screen p-4 bg-bg-base">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                <div className="border-gray-300 bg-input-bg shadow rounded-3xl p-4">
                    <Calendario />
                </div>

                <div className="bg-input-bg shadow rounded-3xl p-4">
                    <div className="w-full max-w-3xl">
                        <Graficos />
                    </div>
                </div>

            </div>

            <div className="bg-input-bg shadow rounded-3xl p-4">
                <div className="bg-input-bg p-4">
                    <h2 className="text-2xl text-center font-bold mb-4">Cambios, observaciones, quejas, sugerencias, propuestas</h2>
                    <Tareas />
                </div>
            </div>
        </div>
    );
}

export { Index };
