import React, { useState } from 'react';
import { MdMenu, MdClose, MdOutlineAssignment, MdOutlineStraighten, MdOutlinePlace, MdUpdate } from "react-icons/md";
import { Link } from 'react-router-dom';
import SparklesText from './SparklesText';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-bg-base py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="logo">
                    <a href="/">
                        <img
                            src="logo.svg"
                            alt="Logo"
                            className="w-8 h-8 ml-4"
                        />
                    </a>
                </div>
                {/* Hamburguesa en móviles */}
                <MdMenu className="text-contrast md:hidden focus:outline-none mr-4"
                    onClick={toggleMenu} size={32} />

                {/* Menú de navegación */}
                <nav className="hidden md:flex space-x-6 mr-10 items-center">
                    <Link to="/registro" className="text-contrast hover:text-gray-400">
                        <SparklesText text="Registros" sparklesCount={5} />
                    </Link>
                    <Link to="/tallas" className="text-contrast hover:text-gray-400">
                        Tallas
                    </Link>
                    <Link to="/destinos" className="text-contrast hover:text-gray-400">
                        Destinos
                    </Link>
                    <Link to="/inventario" className="text-contrast hover:text-gray-400">
                        Inventario
                    </Link>
                </nav>

                {/* Menú desplegable en móviles */}
                {isMenuOpen && (
                    <div className={`fixed top-0 left-0 w-full h-full bg-bg-base z-50 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        {/* Botón para cerrar */}
                        <button
                            onClick={toggleMenu}
                            className="absolute top-4 right-4 text-3xl text-accent-secondary hover:text-accent-muted focus:outline-none"
                        >
                            <MdClose size={32} />
                        </button>

                        {/* Navegación */}
                        <nav className="flex flex-col items-center justify-center h-full space-y-6">
                            <Link
                                to="/registro"
                                className="w-11/12 flex items-center justify-start px-6 py-4 bg-bg-base-white rounded-lg"
                                onClick={toggleMenu}
                            >
                                <MdOutlineAssignment className="mr-4 text-3xl" /> Registros
                            </Link>

                            {/* Link: Tallas */}
                            <Link
                                to="/tallas"
                                className="w-11/12 flex items-center justify-start px-6 py-4 bg-bg-base-white rounded-lg"
                                onClick={toggleMenu}
                            >
                                <MdOutlineStraighten className="mr-4 text-3xl" /> Tallas
                            </Link>

                            {/* Link: Destinos */}
                            <Link
                                to="/destinos"
                                className="w-11/12 flex items-center justify-start px-6 py-4 bg-bg-base-white rounded-lg"
                                onClick={toggleMenu}
                            >
                                <MdOutlinePlace className="mr-4 text-3xl" /> Destinos
                            </Link>

                            {/* Link: Inventario */}
                            <Link
                                to="/inventario"
                                className="w-11/12 flex items-center justify-start px-6 py-4 bg-bg-base-white rounded-lg"
                                onClick={toggleMenu}
                            >
                                <MdUpdate className="mr-4 text-3xl" /> Recepción Inventario
                            </Link>
                        </nav>
                    </div>

                )}
            </div>
        </header>
    );
}

export { Header };
