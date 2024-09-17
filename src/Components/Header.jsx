import React, { useState } from 'react';
import { MdMenu } from "react-icons/md";
import { Link } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };

    return (
        <header className="bg-bg-base py-4 shadow rounded-3xl">
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
                    <Link to="/registro" className="text-contrast hover:text-accent-warm">
                        Registro
                    </Link>
                    <Link to="/tallas" className="text-contrast hover:text-accent-warm">
                        Tallas
                    </Link>
                    <Link to="/destinos" className="text-contrast hover:text-accent-warm">
                        Destinos
                    </Link>

                    {/* Menú desplegable para "Próximas Funcionalidades" */}
                    <div className="relative">
                        <button
                            onClick={toggleSubMenu}
                            className="text-contrast hover:text-accent-warm focus:outline-none"
                        >
                            Feature Flags
                        </button>
                        {isSubMenuOpen && (
                            <div className="absolute top-full mt-2 bg-bg-base border border-accent-muted shadow-lg rounded-lg py-2 w-32">
                                <Link to="/colores" className="block px-4 py-2 text-contrast hover:text-accent-warm">
                                    Colores
                                </Link>
                                <Link to="/packs" className="block px-4 py-2 text-contrast hover:text-accent-warm">
                                    Packs
                                </Link>
                                <Link to="/" className="block px-4 py-2 text-gray-400 hover:bg-accent-muted">
                                    Facturación electrónica
                                </Link>
                                <Link to="/" className="block px-4 py-2 text-gray-400 hover:bg-accent-muted">
                                    Shopify API
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Menú desplegable en móviles */}
                {isMenuOpen && (
                    <div className="absolute top-16 left-0 w-full bg-bg-base md:hidden shadow-lg z-50 rounded-3xl">
                        <nav className="flex flex-col items-center py-4 space-y-4">
                            <Link
                                to="/registro"
                                className="text-contrast hover:text-accent-warm text-2xl px-4 py-2"
                                onClick={toggleMenu}
                            >
                                Registro
                            </Link>
                            <Link
                                to="/tallas"
                                className="text-contrast hover:text-accent-warm text-2xl"
                                onClick={toggleMenu}
                            >
                                Tallas
                            </Link>
                            <Link
                                to="/destinos"
                                className="text-contrast hover:text-accent-warm text-2xl"
                                onClick={toggleMenu}
                            >
                                Destinos
                            </Link>

                            {/* Menú desplegable móvil para "Próximas Funcionalidades" */}
                            <div className="relative w-full text-center">
                                <button
                                    onClick={toggleSubMenu}
                                    className="text-contrast hover:text-accent-warm focus:outline-none text-2xl"
                                >
                                    Feature Flags
                                </button>
                                {isSubMenuOpen && (
                                    <div className="bg-bg-base border border-accent-muted shadow-lg rounded-lg py-2 w-full mt-2">
                                        <Link
                                            to="/colores"
                                            className="block px-4 py-2 text-contrast hover:text-accent-warm"
                                            onClick={toggleMenu}
                                        >
                                            Colores
                                        </Link>
                                        <Link
                                            to="/packs"
                                            className="block px-4 py-2 text-contrast hover:text-accent-warm"
                                            onClick={toggleMenu}
                                        >
                                            Packs
                                        </Link>
                                        <Link to="/" className="block px-4 py-2 text-contrast hover:bg-accent-muted" onClick={toggleMenu}>
                                            Facturación electrónica
                                        </Link>
                                        <Link to="/" className="block px-4 py-2 text-contrast hover:bg-accent-muted" onClick={toggleMenu}>
                                            Shopify API
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

export { Header };
