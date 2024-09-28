import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getTasks, addTask, deleteTask } from "../../utils/TareasApiFunctions";
import DetailsModal from '../Modal';
import { MdAddCircle, MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { toast } from 'react-toastify';

const Calendario = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    // Obtener los días del mes actual
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    // Obtener la fecha actual para compararla en el calendario
    const today = new Date();

    // Fetch de eventos desde Firestore (o API)
    useEffect(() => {
        const fetchEvents = async () => {
            const tasks = await getTasks(); // Obtener tareas desde la API
            const mappedEvents = tasks.map((task) => {
                let eventDate = null;

                if (task.date) {
                    if (task.date.seconds !== undefined) {
                        // Timestamp de Firestore
                        eventDate = new Date(task.date.seconds * 1000);
                    } else {
                        // Asumir que es una cadena de fecha válida
                        eventDate = new Date(task.date);
                    }
                }

                return {
                    ...task,
                    date: eventDate,
                };
            });
            setEvents(mappedEvents);
        };

        fetchEvents();
    }, []);

    // Navegación entre meses
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Agregar un nuevo evento
    const addEvent = async () => {
        if (newEventTitle && selectedDate) {
            const newEvent = { title: newEventTitle, date: selectedDate };
            try {
                const addedEvent = await addTask(newEvent);
                if (addedEvent) {
                    setEvents([...events, addedEvent]);
                    setNewEventTitle("");
                    toast.success('Evento agregado exitosamente');
                    closeModal();
                } else {
                    toast.error('Error al agregar el evento');
                }
            } catch (error) {
                console.error('Error al agregar el evento:', error);
                toast.error('Error al agregar el evento');
            }
        }
    };

    // Eliminar un evento
    const removeEvent = async (eventId) => {
        await deleteTask(eventId); // Eliminar evento de la base de datos
        setEvents(events.filter(event => event.id !== eventId)); // Actualizar el estado local
        toast.success('Evento eliminado exitosamente');
    };

    // Obtener eventos para una fecha específica
    const getEventsForDate = (date) => {
        return events.filter(
            (event) =>
                event.date &&
                event.date.getDate() === date.getDate() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear()
        );
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setNewEventTitle(""); // Resetear el campo del nuevo evento
    };

    return (
        <div className="bg-main p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                </h1>
                <div className="flex items-center">
                    <button onClick={prevMonth} className="bg-accent-primary text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-primary">
                        <MdChevronLeft size={24} />
                    </button>
                    <button onClick={nextMonth} className="bg-accent-primary text-white rounded-lg p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-accent-primary">
                        <MdChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div key={day} className="text-center font-bold">
                        {day}
                    </div>
                ))}
            </div>

            {/* Días del mes, ajustable en pantallas móviles */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div key={`empty-${i}`} className="h-24 bg-gray-100 rounded-lg"></div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                    const dayEvents = getEventsForDate(date);

                    // Verifica si el día actual es el mismo que hoy
                    const isToday = today.getDate() === date.getDate() &&
                        today.getMonth() === date.getMonth() &&
                        today.getFullYear() === date.getFullYear();

                    return (
                        <div
                            key={i}
                            className={`relative h-24 bg-white border rounded-lg p-2 overflow-y-auto text-left hover:bg-gray-50 ${isToday ? "border-2 border-blue-500" : ""}`}
                        >
                            <button className="w-full h-full text-left" onClick={() => handleDayClick(date)}>
                                <div className="font-bold mb-1">{i + 1}</div>
                                {dayEvents.slice(0, 2).map((event) => (
                                    <div
                                        key={event.id}
                                        className="text-xs bg-blue-100 p-1 mb-1 rounded overflow-hidden text-ellipsis whitespace-nowrap"
                                        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Modal para ver eventos y agregar un nuevo evento */}
            {isModalOpen && (
                <DetailsModal isOpen={isModalOpen} onClose={closeModal}>
                    <h2 className="text-xl font-bold mb-4">
                        {selectedDate && format(selectedDate, "EEEE, d MMMM yyyy", { locale: es })}
                    </h2>
                    <div className="py-4">
                        <h3 className="text-lg font-semibold mb-2">Eventos del día:</h3>
                        {getEventsForDate(selectedDate).length > 0 ? (
                            getEventsForDate(selectedDate).map((event) => (
                                <div key={event.id} className="bg-blue-100 p-2 rounded mb-2 flex justify-between items-center">
                                    <span>{event.title}</span>
                                    <button
                                        onClick={() => removeEvent(event.id)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        <MdClose size={20} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No hay eventos para este día.</p>
                        )}

                        <div className="mt-4">
                            <input
                                type="text"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Título del evento"
                            />
                            <button onClick={addEvent} className="w-full bg-accent-primary text-white p-2 mt-2 rounded-md flex items-center gap-2 justify-center">
                                <MdAddCircle size={24} />
                                Agregar
                            </button>
                        </div>
                    </div>
                </DetailsModal>
            )}
        </div>
    );
};

export default Calendario;
