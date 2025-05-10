import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebaseConfig';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Modal from '../Components/Modal'

const Inventario = () => {
    const [prendas, setPrendas] = useState([]);
    const [filtroTalla, setFiltroTalla] = useState('');
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
        });
        return () => unsubscribe();
    }, []);

    // Filtrar prendas por talla
    const prendasFiltradas = prendas.filter(prenda => {
        if (!filtroTalla) return true;
        return prenda.talla === filtroTalla;
    });

    // Decrementar stock
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

    // Agregar nueva prenda
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
        <div className="container mx-auto px-4 py-8 mb-10">
            {/* Header y Botón de agregar */}
            <div className='flex flex-row justify-between items-center mb-8'>
                <h1 className="text-2xl font-bold">Para Regalo</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="py-3 px-3 sm:px-4 rounded-xl text-sm bg-accent-secondary text-accent-secondary-dark transition-colors "
                >
                    Agregar nuevo
                </button>
            </div>

            {/* Filtros de tallas */}
            <div className="mb-8 flex gap-2 flex-wrap">
                {['S', 'M', 'L', 'XL'].map((talla) => (
                    <button
                        key={talla}
                        onClick={() => manejarFiltroTalla(talla)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors 
                            ${filtroTalla === talla
                                ? 'bg-accent-secondary text-white'
                                : 'border border-solid border-black text-accebt-secondary hover:bg-bg-base-white'}`}
                    >
                        {talla}
                    </button>
                ))}
            </div>

            {/* Listado de prendas en filas */}
            <div className="border rounded-xl overflow-hidden">
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
                            className="px-4 py-2 bg-accent-secondary text-white rounded-lg  transition-colors"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export { Inventario };