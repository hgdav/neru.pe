import React from 'react';
import {
    MdOutlineAssignment,
    MdOutlineStraighten,
    MdHomeFilled,
    MdUpdate
} from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path ? '!text-black !bold' : '!text-unused';

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-bg-base/80 backdrop-blur-md border-t border-contrast/10 z-40">
            <div className="grid grid-cols-4 py-2">
                <Link
                    to="/"
                    className={`flex flex-col items-center text-sm ${isActive('/')}`}
                >
                    <MdHomeFilled className="text-2xl mb-1" />
                    <span>Inicio</span>
                </Link>

                <Link
                    to="/registro"
                    className={`flex flex-col items-center text-sm ${isActive('/registro')}`}
                >
                    <MdOutlineAssignment className="text-2xl mb-1" />
                    <span>Registros</span>
                </Link>

                <Link
                    to="/tallas"
                    className={`flex flex-col items-center text-sm ${isActive('/tallas')}`}
                >
                    <MdOutlineStraighten className="text-2xl mb-1" />
                    <span>Tallas</span>
                </Link>

                <Link
                    to="/inventario"
                    className={`flex flex-col items-center text-sm ${isActive('/inventario')}`}
                >
                    <MdUpdate className="text-2xl mb-1" />
                    <span>Inventario</span>
                </Link>
            </div>
        </nav>
    );
}

export { Header };