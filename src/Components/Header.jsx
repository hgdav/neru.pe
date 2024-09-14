import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-bg-base shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="logo">
                    <img
                        src="https://neru.pe/cdn/shop/files/favicon_6271f66c-9e04-4d48-841c-ff68643db8a8.png?v=1688055685"
                        alt="Logo"
                        className="w-6 h-6 ml-4"
                    />
                </div>
                <nav className="flex space-x-6 mr-4">
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
            </div>
        </header>
    );
}

export { Header };
