import React, { useState, useEffect } from "react";
import { format, isAfter, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import {
    getCalendarEvents,
    addCalendarEvent,
    deleteCalendarEvent
} from "../../utils/EventosApiFunctions";
import DetailsModal from '../Modal';
import { MdAddCircle, MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

const users = [
    { id: 0, name: "Jean Pierre", color: "#3B82F6", email: "jeanpierrel.hu@gmail.com" },
    { id: 1, name: "Alex", color: "#10B981", email: "alex.recoil@gmail.com" },
    { id: 2, name: "Diana", color: "#EC4899", email: "diana.auristela@gmail.com" },
    { id: 3, name: "David", color: "#8B5CF6", email: "aes.hur.v@gmail.com" }
];

const Calendario = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [selectedUser, setSelectedUser] = useState(users[0].id);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si es móvil
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Cargar eventos
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const calendarEvents = await getCalendarEvents();
                const mappedEvents = calendarEvents.map(event => ({
                    ...event,
                    date: event.date?.seconds ? new Date(event.date.seconds * 1000) : new Date(event.date)
                }));
                setEvents(mappedEvents);
            } catch (error) {
                toast.error('Error al cargar los tickets');
            }
        };
        fetchEvents();
    }, []);

    // Navegación del calendario
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    // Manejar clic en día
    const handleDayClick = (date) => {
        setSelectedDate(date);
        setModalOpen(true);
    };

    // Agregar nuevo evento
    const handleAddEvent = async () => {
        if (!newEventTitle || !selectedDate) {
            toast.error('Complete todos los campos');
            return;
        }

        setIsLoading(true);
        try {
            const newEvent = {
                title: newEventTitle,
                userId: selectedUser,
                type: 'calendar'
            };

            await addCalendarEvent(newEvent);
            const updatedEvents = await getCalendarEvents();
            setEvents(updatedEvents.map(event => ({
                ...event
            })));

            setNewEventTitle("");
            toast.success('Ticket asignado correctamente');
            sendEmailNotification(selectedUser);
            setModalOpen(false);
        } catch (error) {
            toast.error('Error al asignar ticket');
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar evento
    const handleRemoveEvent = async (eventId) => {
        setIsLoading(true);
        try {
            await deleteCalendarEvent(eventId);
            setEvents(events.filter(event => event.id !== eventId));
            toast.success('Ticket eliminado');
        } catch (error) {
            toast.error('Error al eliminar ticket');
        } finally {
            setIsLoading(false);
        }
    };

    // Enviar notificación por email
    const sendEmailNotification = async (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user?.email) return;

        try {
            await emailjs.send(
                'service_gny6l1b',
                'template_5ibgcun',
                {
                    to_email: user.email,
                    message: `Tienes un nuevo ticket asignado para ${format(selectedDate, 'dd/MM/yyyy')}`
                },
                'GPwbrOJ0Wdjhl0wbB'
            );
        } catch (error) {
            console.error("Error al enviar notificación:", error);
        }
    };

    // Obtener eventos futuros agrupados por fecha
    const getUpcomingEvents = () => {
        const today = startOfDay(new Date());
        return events
            .filter(event => isAfter(event.date, today))
            .sort((a, b) => a.date - b.date)
            .reduce((acc, event) => {
                const dateKey = format(event.date, 'yyyy-MM-dd');
                if (!acc[dateKey]) {
                    acc[dateKey] = {
                        date: event.date,
                        events: []
                    };
                }
                acc[dateKey].events.push(event);
                return acc;
            }, {});
    };

    // Vista Mobile - Resumen de tickets futuros
    const MobileSummary = () => {
        const upcomingEvents = getUpcomingEvents();

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold">Tickets Pendientes</h1>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="p-2 bg-accent-secondary text-accent-secondary-dark rounded-lg"
                    >
                        <MdAddCircle size={20} />
                    </button>
                </div>

                {Object.entries(upcomingEvents).map(([dateKey, group]) => (
                    <div key={dateKey} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium">
                                {format(group.date, "eeee d 'de' MMMM", { locale: es })}
                            </h3>
                            <span className="text-sm text-gray-500">
                                {group.events.length} ticket{group.events.length > 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {group.events.map(event => (
                                <div key={event.id} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-sm">{event.title}</p>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {users.find(u => u.id === event.userId)?.name}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveEvent(event.id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <MdClose size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Vista Desktop - Calendario completo
    const DesktopCalendar = () => (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {format(currentDate, "MMMM yyyy", { locale: es })}
                </h1>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded">
                        <MdChevronLeft size={24} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
                        <MdChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center font-medium">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
                    <div key={day} className="p-2">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg" />
                ))}

                {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                    const dayEvents = events.filter(event =>
                        event.date &&
                        event.date.getDate() === date.getDate() &&
                        event.date.getMonth() === date.getMonth() &&
                        event.date.getFullYear() === date.getFullYear()
                    );

                    return (
                        <div
                            key={i}
                            className={`h-24 p-2 border rounded-lg ${date.toDateString() === new Date().toDateString() ? 'border-2 border-black bg-gray-50' : 'bg-white'}`}
                            onClick={() => handleDayClick(date)}
                        >
                            <div className="font-bold mb-1">{i + 1}</div>
                            {dayEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="text-xs p-1 mb-1 rounded truncate"
                                    style={{
                                        backgroundColor: users.find(u => u.id === event.userId)?.color,
                                        color: 'white'
                                    }}
                                >
                                    {event.title}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveEvent(event.id);
                                        }}
                                        className="ml-1 float-right"
                                    >
                                        <MdClose size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </>
    );

    return (
        <div className="p-4 max-w-7xl mx-auto">
            {isMobile ? <MobileSummary /> : <DesktopCalendar />}

            <DetailsModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">
                        {selectedDate ? format(selectedDate, "eeee d 'de' MMMM", { locale: es }) : "Nuevo Ticket"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Descripción del ticket"
                        className="w-full p-2 border rounded"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                    />

                    <select
                        className="w-full p-2 border rounded"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(Number(e.target.value))}
                    >
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleAddEvent}
                            className="px-4 py-2 bg-accent-secondary text-accent-secondary-dark rounded-md flex items-center gap-2 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : 'Agregar Ticket'}
                        </button>
                    </div>
                </div>
            </DetailsModal>
        </div>
    );
};

export default Calendario;