import React, { useState } from 'react';
import { MdMenu } from "react-icons/md";
import { Link } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-bg-base py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="logo">
                    <img
                        src="https://neru.pe/cdn/shop/files/favicon_6271f66c-9e04-4d48-841c-ff68643db8a8.png?v=1688055685"
                        alt="Logo"
                        className="w-8 h-8 ml-4"
                    />
                </div>
                {/* Hamburguesa en móviles */}
                <MdMenu className="text-contrast md:hidden focus:outline-none mr-4"
                    onClick={toggleMenu} size={32} />


                {/* Menú de navegación */}
                <nav className="hidden md:flex space-x-6 mr-4">
                    <Link to="/tallas" className="text-contrast hover:text-accent-warm">
                        Tallas
                    </Link>
                    <Link to="/destinos" className="text-contrast hover:text-accent-warm">
                        Destinos
                    </Link>
                    <Link to="/colores" className="text-contrast hover:text-accent-warm">
                        Colores
                    </Link>
                    <Link to="/packs" className="text-contrast hover:text-accent-warm">
                        Packs
                    </Link>
                    <Link to="/registro" className="text-contrast hover:text-accent-warm">
                        Registro
                    </Link>
                </nav>

                {/* Menú desplegable en móviles */}
                {isMenuOpen && (
                    <div className="absolute top-16 left-0 w-full bg-bg-base md:hidden shadow-lg z-50">
                        <nav className="flex flex-col items-center py-4 space-y-4">
                            <Link
                                to="/tallas"
                                className="text-contrast hover:text-accent-warm"
                                onClick={toggleMenu}
                            >
                                Tallas
                            </Link>
                            <Link
                                to="/destinos"
                                className="text-contrast hover:text-accent-warm"
                                onClick={toggleMenu}
                            >
                                Destinos
                            </Link>
                            <Link
                                to="/colores"
                                className="text-contrast hover:text-accent-warm"
                                onClick={toggleMenu}
                            >
                                Colores
                            </Link>
                            <Link
                                to="/packs"
                                className="text-contrast hover:text-accent-warm"
                                onClick={toggleMenu}
                            >
                                Packs
                            </Link>
                            <Link
                                to="/registro"
                                className="text-contrast hover:text-accent-warm"
                                onClick={toggleMenu}
                            >
                                Registro
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

export { Header };
