import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebaseConfig';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Modal from '../Components/Modal';
import LoadingInventario from './Loaders/LoadingInventario';

const Inventario = () => {
    const [prendas, setPrendas] = useState([]);
    const [filtroTalla, setFiltroTalla] = useState('');
    const [loading, setLoading] = useState(true);
    const [nuevaPrenda, setNuevaPrenda] = useState({
        nombre: '',
        talla: '',
        color: '',
        stock: 0
    });
    const [showAddModal, setShowAddModal] = useState(false);

    // Obtener prendas de Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'prendas'), (snapshot) => {
            const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPrendas(datos);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const prendasFiltradas = prendas.filter(prenda => {
        if (!filtroTalla) return true;
        return prenda.talla === filtroTalla;
    });

    const decrementarStock = async (id, currentStock) => {
        try {
            if (currentStock > 1) {
                await updateDoc(doc(db, 'prendas', id), {
                    stock: currentStock - 1
                });
            } else {
                await deleteDoc(doc(db, 'prendas', id));
            }
        } catch (error) {
            console.error("Error actualizando stock:", error);
        }
    };

    const agregarPrenda = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'prendas'), {
                ...nuevaPrenda,
                talla: nuevaPrenda.talla.trim().toUpperCase(),
                color: nuevaPrenda.color.trim(),
                stock: Number(nuevaPrenda.stock)
            });
            setShowAddModal(false);
            setNuevaPrenda({
                nombre: '',
                talla: '',
                color: '',
                stock: 0
            });
        } catch (error) {
            console.error("Error agregando prenda:", error);
        }
    };

    // Manejar selección de talla
    const manejarFiltroTalla = (talla) => {
        setFiltroTalla(prev => prev === talla ? '' : talla);
    };

    return (
        <div className="container mx-auto px-4 py-8 mb-10 bg-base">
            {loading ? (
                <LoadingInventario />
            ) : (
                <div>
                    <div className='border-b p-2 pb-0 mb-4'>
                        <div className='flex flex-row justify-between items-center mb-6'>
                            <h1 className="text-2xl font-medium">Para Regalo</h1>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="py-2 px-3 sm:px-4 sm:py-3 rounded-xl text-sm bg-primary-button text-white"
                            >
                                Agregar nuevo
                            </button>
                        </div>

                        <div className="flex gap-6 md:gap-6 flex-wrap">
                            <span className={`text-md text-accent-secondary cursor-pointer ${filtroTalla === 'S' ? 'font-medium border-b border-black' : ''}`} onClick={() => manejarFiltroTalla('S')}>S</span>
                            <span className={`text-md text-accent-secondary cursor-pointer ${filtroTalla === 'M' ? 'font-medium border-b border-black' : ''}`} onClick={() => manejarFiltroTalla('M')}>M</span>
                            <span className={`text-md text-accent-secondary cursor-pointer ${filtroTalla === 'L' ? 'font-medium border-b border-black' : ''}`} onClick={() => manejarFiltroTalla('L')}>L</span>
                            <span className={`text-md text-accent-secondary cursor-pointer ${filtroTalla === 'XL' ? 'font-medium border-b border-black' : ''}`} onClick={() => manejarFiltroTalla('XL')}>XL</span>

                        </div>
                    </div>

                    {/* Listado de prendas en filas */}
                    <div className="border bg-base-white rounded-3xl overflow-hidden">
                        {prendasFiltradas.map((prenda) => (
                            <div key={prenda.id} className="bg-bg-base-white border-b last:border-b-0 px-4 py-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-medium">{prenda.nombre}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {prenda.color} <span className="font-bold">{prenda.talla}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold ml-2">{prenda.stock}</span>
                                        <button
                                            onClick={() => decrementarStock(prenda.id, prenda.stock)}
                                            className="ml-4 text-red-500 text-red-700 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 transition-colors"
                                            title="Reducir cantidad"
                                        >
                                            <span className="text-2xl leading-none">−</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Modal de agregar prenda */}
                    <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                        <form onSubmit={agregarPrenda} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre:</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                                    value={nuevaPrenda.nombre}
                                    onChange={(e) => setNuevaPrenda({ ...nuevaPrenda, nombre: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Talla:</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                                        value={nuevaPrenda.talla}
                                        onChange={(e) => setNuevaPrenda({ ...nuevaPrenda, talla: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccionar talla</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Color:</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                                        value={nuevaPrenda.color}
                                        onChange={(e) => setNuevaPrenda({ ...nuevaPrenda, color: e.target.value })}
                                        placeholder="Ej: Rojo, Azul"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Cantidad inicial:</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                                    value={nuevaPrenda.stock}
                                    onChange={(e) => setNuevaPrenda({ ...nuevaPrenda, stock: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-button text-white rounded-lg  transition-colors"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export { Inventario };