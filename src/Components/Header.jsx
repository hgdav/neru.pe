import React from 'react';
import {
    MdOutlineAssignment,
    MdOutlineStraighten,
    MdHomeFilled,
    MdUpdate
} from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import SparklesText from './SparklesText';

function Header() {
    const location = useLocation();

    // Función mejorada para manejar rutas exactas y subrutas
    const isActive = (path) =>
        location.pathname === path ? '!text-black !bold' : 'text-gray-600';

    return (
        <header className="bg-bg-base py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="logo flex justify-center md:justify-start w-full">
                    <a href="/">
                        <img
                            src="logo.svg"
                            alt="Logo"
                            className="w-8 h-8"
                        />
                    </a>
                </div>

                {/* Menú de escritorio */}
                <nav className="hidden md:flex space-x-6 mr-10 items-center">
                    <Link
                        to="/registro"
                        className={`hover:text-gray-500 ${isActive('/registro')}`}
                    >
                        {location.pathname === '/' ? (
                            <SparklesText text="Registros" sparklesCount={5} />
                        ) : "Registros"}
                    </Link>
                    <Link
                        to="/tallas"
                        className={`hover:text-gray-500 ${isActive('/tallas')}`}
                    >
                        Tallas
                    </Link>
                    <Link
                        to="/inventario"
                        className={`hover:text-gray-500 ${isActive('/inventario')}`}
                    >
                        Inventario
                    </Link>
                </nav>

                {/* Menú móvil */}
                <nav className="md:hidden fixed bottom-0 left-0 w-full bg-bg-base/80 backdrop-blur-md border-t border-contrast/10 z-40">
                    <div className="grid grid-cols-4 py-2">
                        <Link
                            to="/"
                            className={`flex flex-col items-center text-sm hover:text-gray-400 ${isActive('/')}`}
                        >
                            <MdHomeFilled className="text-2xl mb-1" />
                            <span>Inicio</span>
                        </Link>

                        <Link
                            to="/registro"
                            className={`flex flex-col items-center text-sm hover:text-gray-400 ${isActive('/registro')}`}
                        >
                            <MdOutlineAssignment className="text-2xl mb-1" />
                            <span>Registros</span>
                        </Link>

                        <Link
                            to="/tallas"
                            className={`flex flex-col items-center text-sm hover:text-gray-400 ${isActive('/tallas')}`}
                        >
                            <MdOutlineStraighten className="text-2xl mb-1" />
                            <span>Tallas</span>
                        </Link>

                        <Link
                            to="/inventario"
                            className={`flex flex-col items-center text-sm hover:text-gray-400 ${isActive('/inventario')}`}
                        >
                            <MdUpdate className="text-2xl mb-1" />
                            <span>Inventario</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>

    );
}

export { Header };