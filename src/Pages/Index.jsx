import React from 'react';
import Tareas from '../Components/Eventos/Tareas';
import Graficos from '../Components/Graficos/Graficos';
import Calendario from '../Components/Calendario/Calendario';
import { MdInsertChartOutlined } from "react-icons/md";
import { Link } from 'react-router-dom';

//import ImportCSVModal from '../Components/ImportCSVModal';
//import { useState } from 'react';

const Index = () => {

    // const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    return (
        <div className="min-h-screen p-4 bg-bg-base">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                <div className="border-gray-300 bg-input-bg shadow rounded-3xl p-4">
                    <div className="w-full max-w-3xl float-right">
                        <Calendario />
                    </div>
                </div>

                <div className="bg-input-bg shadow rounded-3xl p-4">
                    <Link to="/resumen" className="bg-accent-secondary text-accent-secondary-dark rounded-lg p-1 float-right">
                        <MdInsertChartOutlined size={24} />
                    </Link>
                    <div className="w-full max-w-3xl">
                        <Graficos />
                    </div>
                </div>

            </div>

            <div className="bg-input-bg shadow rounded-3xl p-4">
                <div className="bg-input-bg p-4">
                    <h2 className="text-2xl text-center font-bold mb-4">Tareas del equipo</h2>
                    <Tareas />
                </div>
            </div>
            {/* <div className="bg-input-bg shadow rounded-3xl p-4">
                <div className="bg-input-bg p-4">
                    <h2 className="text-2xl text-center font-bold mb-4">Importar desde CSV</h2>
                    <button onClick={() => setIsImportModalOpen(true)}>
                        Importar desde CSV
                    </button>
                    <ImportCSVModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
                </div>
            </div>*/}
        </div>
    );
}

export { Index };
