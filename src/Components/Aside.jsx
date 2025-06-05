import React from 'react';
import {
    MdOutlineAssignment,
    MdOutlineStraighten,
    MdHomeFilled,
    MdUpdate,
    MdDescription
} from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';

const Aside = () => {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path ? '!text-black !bold  bg-aside-selected' : '!text-unused';

    return (
        <div className='flex flex-col h-screen'>
            <aside className="w-64 h-screen bg-base border-r border-gray-200 fixed left-0 top-0 py-5 flex flex-col justify-between">
                <nav className="w-full">
                    <img src="/img/logo-dark.png" alt="Logo" className="size-[140px] h-auto" />
                    <ul className="list-none p-0 m-0 mt-4">
                        <li className="w-[90%] mx-auto">
                            <Link to="/" className={`flex items-center px-6 py-4 rounded-xl ${isActive('/')}`}>
                                <MdHomeFilled size={24} className="text-center mr-3" />
                                <span>Inicio</span>
                            </Link>
                        </li>
                        <li className="w-[90%] mx-auto mt-2">
                            <Link to="/registro" className={`flex items-center px-6 py-4 rounded-xl ${isActive('/registro')}`}>
                                <MdOutlineAssignment size={24} className="text-center mr-3" />
                                <span>Registros</span>
                            </Link>
                        </li>
                        <li className="w-[90%] mx-auto mt-2">
                            <Link to="/tallas" className={`flex items-center px-6 py-4 rounded-xl ${isActive('/tallas')}`}>
                                <MdOutlineStraighten size={24} className="text-center mr-3" />
                                <span>Tallas</span>
                            </Link>
                        </li>
                        <li className="w-[90%] mx-auto mt-2">
                            <Link to="/inventario" className={`flex items-center px-6 py-4 rounded-xl ${isActive('/inventario')}`}>
                                <MdUpdate size={24} className="text-center mr-3" />
                                <span>Inventario</span>
                            </Link>
                        </li>
                        <li className="w-[90%] mx-auto mt-2">
                            <Link to="/facturacion" className={`flex items-center px-6 py-4 rounded-xl ${isActive('/facturacion')}`}>
                                <MdDescription size={24} className="text-center mr-3" />
                                <span>Facturacion</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="px-6 pt-4">
                    <span className='text-unused text-xs'>v.2 Expressive</span>
                </div>
            </aside>
        </div>

    );
};

export { Aside };