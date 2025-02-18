import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseConfig'
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import Modal from '../Components/Modal'

function Inventario() {
    // Estados principales
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [paso, setPaso] = useState(1)
    const [shipments, setShipments] = useState([])

    // Paso 1 - Datos del envío
    const [tipoPrenda, setTipoPrenda] = useState('')
    const [fecha, setFecha] = useState('')
    const [costoEnvio, setCostoEnvio] = useState('')

    // Paso 2 - Items del envío
    const [color, setColor] = useState('')
    const [talla, setTalla] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [items, setItems] = useState([])

    // Fecha para filtrar resultados
    const [filtroFecha, setFiltroFecha] = useState('')

    useEffect(() => {
        const q = query(collection(db, "inventario"), orderBy("fechaLlegada", "desc"))

        const unsub = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    id: doc.id,
                    ...data,
                    fechaLlegada: data.fechaLlegada?.toDate(),
                    items: data.items || []
                }
            })
            setShipments(docs)
        })

        return () => unsub()
    }, [])

    const handleAddItem = () => {
        if (!color || !talla || !cantidad) {
            alert('Completa todos los campos del item')
            return
        }

        setItems(prev => [...prev, {
            color,
            talla,
            cantidad: parseInt(cantidad)
        }])

        setColor('')
        setTalla('')
        setCantidad('')
    }

    const handleSaveShipment = async () => {
        if (items.length === 0) {
            alert('Agrega al menos un item')
            return
        }

        const nuevoEnvio = {
            tipoPrenda,
            fechaLlegada: new Date(fecha),
            costoEnvio: parseFloat(costoEnvio),
            items
        }

        try {
            await addDoc(collection(db, "inventario"), nuevoEnvio)
            resetForm()
            alert('Envío registrado exitosamente!')
        } catch (error) {
            console.error('Error guardando envío:', error)
            alert('Error al guardar el envío')
        }
    }

    const resetForm = () => {
        setIsModalOpen(false)
        setPaso(1)
        setTipoPrenda('')
        setFecha('')
        setCostoEnvio('')
        setColor('')
        setTalla('')
        setCantidad('')
        setItems([])
    }

    const formatDate = (date) =>
        date?.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) || ''

    const isSameDay = (dateA, dateB) => {
        if (!dateA || !dateB) return false
        return (
            dateA.getDate() === dateB.getDate() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getFullYear() === dateB.getFullYear()
        )
    }

    const renderTable = () => {
        const ultimaFecha = shipments.length > 0 ? shipments[0].fechaLlegada : null
        let fechaFiltro = filtroFecha ? new Date(filtroFecha + 'T00:00:00') : ultimaFecha

        const shipmentsFiltrados = shipments.filter(shipment =>
            isSameDay(shipment.fechaLlegada, fechaFiltro)
        )

        return (
            <div className="overflow-x-auto mb-8">
                <div className="mb-4 flex flex-col md:flex-row gap-2 items-start md:items-center">
                    <label className="text-sm font-medium mr-2">Filtrar por fecha:</label>
                    <input
                        type="date"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {filtroFecha && (
                        <button
                            onClick={() => setFiltroFecha('')}
                            className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                            Limpiar filtro
                        </button>
                    )}
                </div>

                <table className="min-w-full hidden md:table">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Fecha</th>
                            <th className="px-4 py-3 text-left">Prenda</th>
                            <th className="px-4 py-3 text-left">Items</th>
                            <th className="px-4 py-3 text-left">Costo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {shipmentsFiltrados.map(shipment => (
                            <tr key={shipment.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 align-top">
                                    {formatDate(shipment.fechaLlegada)}
                                </td>
                                <td className="px-4 py-3 align-top">
                                    {shipment.tipoPrenda}
                                </td>
                                <td className="px-4 py-3">
                                    {shipment.items.map((item, i) => (
                                        <div key={i} className="mb-1 last:mb-0">
                                            {item.color} - {item.talla} = {item.cantidad}
                                        </div>
                                    ))}
                                </td>
                                <td className="px-4 py-3">
                                    S/ {shipment.costoEnvio?.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="md:hidden space-y-4">
                    {shipmentsFiltrados.map(shipment => (
                        <div key={shipment.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">{shipment.tipoPrenda}</span>
                                <span className="text-gray-600">{formatDate(shipment.fechaLlegada)}</span>
                            </div>
                            <div className="text-sm mb-2">
                                Costo: S/ {shipment.costoEnvio?.toFixed(2)}
                            </div>
                            <div className="space-y-2">
                                {shipment.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                                        <span>{item.color} - {item.talla}</span>
                                        <span>x{item.cantidad}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {shipmentsFiltrados.length === 0 && (
                    <p className="text-center text-gray-600 mt-4">
                        No se encontraron envíos para la fecha seleccionada.
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 lg:p-8">
            <div className="mb-6 text-right">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Registrar Nuevo Envío
                </button>
            </div>

            {renderTable()}

            <Modal isOpen={isModalOpen} onClose={resetForm}>
                <div className="bg-white rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">
                        {paso === 1 ? '1. Datos del Envío' : '2. Detalles de Prendas'}
                    </h2>

                    {paso === 1 ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tipo de Prenda</label>
                                <select
                                    value={tipoPrenda}
                                    onChange={(e) => setTipoPrenda(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Polo Shirt">Polo Shirt</option>
                                    <option value="Neru T-Shirt">Neru T-Shirt</option>
                                    <option value="Jacquard T-Shirt">Jacquard T-Shirt</option>
                                    <option value="Crew Neck T-Shirt">Crew Neck T-Shirt</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Fecha de Llegada</label>
                                <input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Costo de Envío</label>
                                <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                                    <span className="px-3 py-2 bg-gray-100 border-r">S/</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={costoEnvio}
                                        onChange={(e) => setCostoEnvio(e.target.value)}
                                        className="w-full p-2 outline-none rounded-r-lg"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setPaso(2)}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                disabled={!tipoPrenda || !fecha || !costoEnvio}
                            >
                                Continuar
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Color</label>
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Ej. Negro"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Talla</label>
                                    <select
                                        value={talla}
                                        onChange={(e) => setTalla(e.target.value)}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {items.length > 0 && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h3 className="text-sm font-medium mb-2">Items agregados:</h3>
                                    {items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm mb-1 last:mb-0">
                                            <span>{item.color} - {item.talla}</span>
                                            <span>x{item.cantidad}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Agregar Item
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveShipment}
                                    className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Guardar Envío
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="w-full text-red-600 hover:text-red-700 text-sm"
                            >
                                Cancelar y empezar de nuevo
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export { Inventario }