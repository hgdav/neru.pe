import React from 'react';
import Tareas from '../Components/Eventos/Tareas';
import Graficos from '../Components/Graficos/Graficos';

const Index = () => {
    return (
        <div className="min-h-screen p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="border-gray-300 bg-input-bg shadow rounded-3xl p-4">
                    <h2 className="text-2xl text-center font-bold mb-4">Eventos Pendientes</h2>
                    <Tareas />
                </div>

                {/* Segunda mitad para gráficos */}
                <div className="bg-input-bg shadow rounded-3xl p-4">
                    <div className="w-full max-w-3xl">
                        <Graficos />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-3xl p-4 hidden">
                <h2 className="text-2xl font-bold mb-4">Enlaces Externos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {/* Cada enlace es un icono con texto */}
                    <a href="https://admin.shopify.com/store/ad6bac/orders?inContextTimeframe=last_7_days" className="flex flex-col items-center text-gray-700 hover:text-accent-primary">
                        <span className="text-2xl">🔗</span>
                        <span className="text-sm">Shopify</span>
                    </a>
                    <a href="#enlace2" className="flex flex-col items-center text-gray-700 hover:text-accent-primary">
                        <span className="text-2xl">🔗</span>
                        <span className="text-sm">Enlace 2</span>
                    </a>
                    <a href="#enlace3" className="flex flex-col items-center text-gray-700 hover:text-accent-primary">
                        <span className="text-2xl">🔗</span>
                        <span className="text-sm">Enlace 3</span>
                    </a>
                    {/* Agrega más enlaces si es necesario */}
                </div>
            </div>
        </div>
    );
}

export { Index };
