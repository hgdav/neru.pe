import React, { useState, useEffect } from "react";
import {
    format,
    startOfWeek,
    addDays,
    isSameDay,
    startOfDay
} from "date-fns";
import { es } from "date-fns/locale";
import {
    getCalendarEvents,
    addCalendarEvent,
    deleteCalendarEvent
} from "../../utils/EventosApiFunctions";
import DetailsModal from "../Modal";
import { MdCheck, MdChevronLeft, MdChevronRight, MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import toast from 'react-hot-toast';
import emailjs from "@emailjs/browser";

const users = [
    { id: 0, name: "Jean Pierre", color: "#3B82F6", email: "jeanpierrel.hu@gmail.com" },
    { id: 1, name: "Alex", color: "#10B981", email: "alex.recoil@gmail.com" },
    { id: 2, name: "Diana", color: "#EC4899", email: "diana.auristela@gmail.com" },
    { id: 3, name: "David", color: "#8B5CF6", email: "aes.hur.v@gmail.com" }
];

const Calendario = () => {
    const [selectedWeekStart, setSelectedWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [selectedUser, setSelectedUser] = useState(users[0].id);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modalView, setModalView] = useState('list');
    const [expandedUsers, setExpandedUsers] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const calendarEvents = await getCalendarEvents();
                const mappedEvents = calendarEvents.map((event) => ({
                    ...event,
                    date: event.date?.seconds ? new Date(event.date.seconds * 1000) : new Date(event.date)
                }));
                setEvents(mappedEvents);
            } catch (error) {
                toast.error("Error al cargar los tickets");
            }
        };
        fetchEvents();
    }, []);

    const nextWeek = () => setSelectedWeekStart((prev) => addDays(prev, 7));
    const prevWeek = () => setSelectedWeekStart((prev) => addDays(prev, -7));

    const handleDayClick = (date, eventId = null) => {
        setSelectedDate(date);
        setSelectedEventId(eventId);
        setModalView('list');
        setModalOpen(true);
        setNewEventTitle('');
        setSelectedUser(users[0].id);
    };


    const sendEmailNotification = async (userId) => {
        const user = users.find((u) => u.id === userId);
        if (!user?.email) return;

        try {
            await emailjs.send(
                "service_gny6l1b", // Tu Service ID de EmailJS
                "template_5ibgcun", // Tu Template ID
                {
                    to_email: user.email,
                    message: `Tienes un nuevo ticket asignado para ${format(
                        selectedDate,
                        "dd/MM/yyyy"
                    )}`
                },
                "GPwbrOJ0Wdjhl0wbB" // Tu Public Key
            );
        } catch (error) {
            console.error("Error al enviar notificación:", error);
        }
    };

    const handleAddEvent = async () => {
        if (!newEventTitle || !selectedDate) {
            toast.error("Complete todos los campos");
            return;
        }

        setIsLoading(true);
        try {
            const newEvent = {
                title: newEventTitle,
                userId: selectedUser,
                date: selectedDate,
                type: "calendar"
            };

            await addCalendarEvent(newEvent);
            const updatedEvents = await getCalendarEvents();
            setEvents(updatedEvents.map(event => ({
                ...event,
                date: event.date?.seconds ? new Date(event.date.seconds * 1000) : new Date(event.date)
            })));

            // Enviar notificación por correo
            await sendEmailNotification(selectedUser);

            toast.success("Ticket asignado correctamente");
            setModalOpen(false);
        } catch (error) {
            toast.error("Error al asignar ticket");
        } finally {
            setIsLoading(false);
        }
    };


    const handleRemoveEvent = async (eventId) => {
        setIsLoading(true);
        try {
            await deleteCalendarEvent(eventId);
            setEvents(events.filter((event) => event.id !== eventId));
            toast.success("Ticket eliminado");
        } catch (error) {
            toast.error("Error al eliminar ticket");
        } finally {
            setIsLoading(false);
        }
    };

    const getPendingEvents = () => {
        const today = startOfDay(new Date());
        return events
            .filter((event) => event.date >= today)
            .sort((a, b) => a.date - b.date);
    };

    const daysOfWeek = Array.from({ length: 7 }).map((_, i) => addDays(selectedWeekStart, i));
    const upcomingEvents = getPendingEvents();

    const toggleUser = (userId) => {
        setExpandedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <div className="h-full flex flex-col p-2">
            <div className="flex items-center justify-between gap-2 mb-6">
                <h1 className="text-xl font-medium">Centro de tickets</h1>
                <div className="flex items-center gap-2">
                    <button onClick={prevWeek} className="bg-button text-accent-secondary rounded-lg p-1">
                        <MdChevronLeft size={24} />
                    </button>
                    <button onClick={nextWeek} className="bg-button text-accent-secondary rounded-lg p-1">
                        <MdChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
                {daysOfWeek.map((dayDate) => {
                    const isToday = isSameDay(dayDate, new Date());
                    return (
                        <div
                            key={dayDate.toISOString()}
                            onClick={() => handleDayClick(dayDate, selectedEventId)}
                            className="text-center p-2 rounded-lg cursor-pointer">
                            <div className="text-sm text-gray-600 mb-2">
                                {format(dayDate, "EEE", { locale: es })}
                            </div>
                            <div className="text-lg font-medium">
                                <span className={`${isToday ? "bg-purple-100 rounded-full p-2 md:p-3 text-purple-500" : ""}`}>{format(dayDate, "d")}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-300">Hoy</span>
                    <div className="border-t border-gray-300 w-full"></div>
                </div>

                {upcomingEvents.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay tickets pendientes, toca un día para crear uno.</p>
                ) : (
                    users.map((user) => {
                        const userEvents = upcomingEvents.filter(event => event.userId === user.id);
                        if (userEvents.length === 0) return null;
                        const isExpanded = expandedUsers.includes(user.id);

                        return (
                            <div key={user.id} className="mb-3">
                                <div
                                    className="flex justify-between items-center p-2 bg-button rounded-xl cursor-pointer"
                                    onClick={() => toggleUser(user.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: user.color }}
                                        />
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-gray-500">({userEvents.length})</span>
                                    </div>
                                    {isExpanded ? <MdArrowDropUp size={20} /> : <MdArrowDropDown size={20} />}
                                </div>

                                {isExpanded && userEvents.map((event) => {
                                    const eventDate = event.date ? new Date(event.date) : null;
                                    return (
                                        <div key={event.id} onClick={() => handleDayClick(event.date, event.id)}
                                            className="bg-ticket p-3 rounded-xl mb-2 mt-2 shadow-sm">
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-4 items-center">
                                                    <div>
                                                        <p className="font-medium">
                                                            {event.title.length > 40
                                                                ? `${event.title.slice(0, 40)}…`
                                                                : event.title}
                                                        </p>
                                                        {eventDate && (
                                                            <p className="text-sm text-gray-500">
                                                                {format(eventDate, "eeee d 'de' MMMM", { locale: es })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveEvent(event.id)}
                                                    className="text-gray-500 hover:text-green-500"
                                                >
                                                    <MdCheck size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })
                )}
            </div>

            <DetailsModal isOpen={isModalOpen} onClose={() => { setModalOpen(false); setSelectedEventId(null); }}>
                {(() => {
                    const dayEvents = selectedEventId
                        ? events.filter(event => event.id === selectedEventId)
                        : events.filter((event) => {
                            if (!selectedDate || !event.date) return false;
                            const eventDate = new Date(event.date);
                            return (
                                eventDate.getDate() === selectedDate.getDate() &&
                                eventDate.getMonth() === selectedDate.getMonth() &&
                                eventDate.getFullYear() === selectedDate.getFullYear()
                            );
                        });

                    const formattedDate = selectedDate
                        ? selectedDate.toLocaleDateString('es-ES', { // Ajusta el locale si es necesario
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })
                        : 'Fecha no seleccionada';

                    // --- Vista de Lista ---
                    if (modalView === 'list') {
                        return (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-center mb-4 capitalize">
                                    {formattedDate}
                                </h2>

                                {/* Lista de tickets */}
                                {dayEvents.length > 0 ? (
                                    <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-200"> {/* Más altura y scroll propio */}
                                        {dayEvents.map((event) => {
                                            const userName = users.find((u) => u.id === event.userId)?.name || 'Desconocido';
                                            const ticketDate = event.date ? new Date(event.date) : null;
                                            const ticketTime = ticketDate ? ticketDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '';

                                            return (
                                                <div
                                                    key={event.id}
                                                    className="bg-base-white p-3 rounded shadow-sm flex justify-between items-center border-l-4 border-blue-500" // Mejor estilo visual
                                                >
                                                    <div className="flex-grow mr-2">
                                                        <p className="font-medium text-base mb-1 text-black" style={{ whiteSpace: 'pre-wrap' }}>
                                                            {event.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Asignado a: <strong>{userName}</strong> {ticketTime && `(${ticketTime})`}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveEvent(event.id)}
                                                        className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100 flex-shrink-0"
                                                        aria-label="Marcar como completado"
                                                    >
                                                        <MdCheck size={20} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">No hay tickets para este día.</p>
                                )}

                                {/* Botón para ir al formulario */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={() => setModalView('form')}
                                        className="py-3 px-3 sm:px-4 rounded-xl text-sm bg-primary-button text-white"
                                    >
                                        Crear Nuevo Ticket
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    // --- Vista de Formulario ---
                    if (modalView === 'form') {
                        return (
                            <div className="space-y-4">
                                {/* Botón para volver a la lista */}
                                <div className="flex justify-start mb-3">
                                    <button
                                        onClick={() => setModalView('list')}
                                        className="text-sm text-black hover:underline flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Volver a la lista
                                    </button>
                                </div>

                                <h2 className="text-xl font-bold text-center">
                                    {formattedDate}
                                </h2>

                                {/* Formulario (sin el contenedor extra de bg-gray-100) */}
                                <textarea
                                    placeholder="Objetivo o tarea..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-accent-primary focus:border-accent-primary" // Mejor foco
                                    value={newEventTitle}
                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                    rows={4}
                                />

                                <label htmlFor="assignUserSelect" className="block text-sm font-medium text-gray-700">😈 Asignar a</label>
                                <select
                                    id="assignUserSelect"
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-accent-primary focus:border-accent-primary" // Mejor estilo
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(Number(e.target.value))}
                                >
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex gap-3 justify-end pt-3">
                                    {/* Botón Cancelar ahora cierra el modal completo */}
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-xl"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleAddEvent}
                                        className="py-3 px-3 sm:px-4 rounded-xl flex items-center justify-center text-sm bg-primary-button text-white disabled:opacity-60 hover:bg-opacity-90"
                                        disabled={isLoading || !newEventTitle.trim()}
                                    >
                                        {isLoading ? (
                                            "Creando..."
                                        ) : (
                                            "Crear Ticket"
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    return <p>Error al cargar la vista.</p>;

                })()}
            </DetailsModal>
        </div>
    );
};

export default Calendario;