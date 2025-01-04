import React, { useState } from 'react';
import { MdMenu } from "react-icons/md";
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

                </nav>

                {/* Menú desplegable en móviles */}
                {isMenuOpen && (
                    <div className={`fixed top-0 left-0 w-full h-full bg-bg-base z-50 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        {/* Botón para cerrar */}
                        <button
                            onClick={toggleMenu}
                            className="absolute top-4 right-4 text-3xl text-accent-secondary hover:text-accent-muted focus:outline-none"
                        >
                            ✕
                        </button>

                        {/* Navegación */}
                        <nav className="flex flex-col items-center justify-center h-full space-y-6">
                            {/* Link: Registro */}
                            <Link
                                to="/registro"
                                className="w-10/12 text-center px-6 py-4 bg-accent-muted/10 text-contrast hover:bg-accent-muted/30 rounded-lg shadow-md text-2xl transition-all duration-200"
                                onClick={toggleMenu}
                            >
                                Registros
                            </Link>

                            {/* Link: Tallas */}
                            <Link
                                to="/tallas"
                                className="w-10/12 text-center px-6 py-4 bg-accent-muted/10 text-contrast hover:bg-accent-muted/30 rounded-lg shadow-md text-2xl transition-all duration-200"
                                onClick={toggleMenu}
                            >
                                Tallas
                            </Link>

                            {/* Link: Destinos */}
                            <Link
                                to="/destinos"
                                className="w-10/12 text-center px-6 py-4 bg-accent-muted/10 text-contrast hover:bg-accent-muted/30 rounded-lg shadow-md text-2xl transition-all duration-200"
                                onClick={toggleMenu}
                            >
                                Destinos
                            </Link>
                        </nav>
                    </div>

                )}
            </div>
        </header>
    );
}

export { Header };
