import React, { useState, useEffect } from 'react';
import { getTasks, deleteTask } from '../../utils/EventosApiFunctions';
import { toast } from 'react-toastify';
import { MdClose } from 'react-icons/md';
import { format } from 'date-fns'; // Asegúrate de tener esta importación

const users = [
    { id: 1, name: "Jean Pierre" },
    { id: 2, name: "Alex" },
    { id: 3, name: "Diana" },
    { id: 4, name: "David" }
];

const Tareas = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const fetchedEvents = await getTasks();
                if (fetchedEvents) {
                    setEvents(fetchedEvents);
                }
            } catch (error) {
                toast.error('Error al cargar las tareas');
            }
        };
        fetchEvents();
    }, []);

    const removeEvent = async (eventId) => {
        try {
            await deleteTask(eventId);
            const updatedTasks = await getTasks();
            if (updatedTasks) {
                setEvents(updatedTasks);
                toast.success('Tarea eliminada exitosamente');
            }
        } catch (error) {
            toast.error('Error al eliminar la tarea');
        }
    };

    return (
        <div className="min-h-screen bg-bg-base py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="space-y-4">
                            <h3 className="text-lg font-semibold text-center">{user.name}</h3>
                            <div className="bg-bg-base shadow overflow-hidden rounded-3xl">
                                <ul className="divide-y divide-gray-200">
                                    {events
                                        .filter(event => event.userId === user.id)
                                        .map(event => {
                                            const eventDate = event.date ? format(new Date(event.date.seconds * 1000), 'dd. MMM') : 'Fecha no disponible';
                                            return (
                                                <li key={event.id} className="group px-4 py-4 sm:px-6 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ease-in-out">
                                                    <div className="flex flex-col">
                                                        <p className={`text-sm font-medium text-gray-900`}>
                                                            {event.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{eventDate}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeEvent(event.id)}
                                                        className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity duration-200"
                                                    >
                                                        <MdClose size={20} />
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    {events.filter(event => event.userId === user.id).length === 0 && (
                                        <li className="px-4 py-4 sm:px-6 text-sm text-center text-gray-500">
                                            No hay eventos asignados.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tareas;
