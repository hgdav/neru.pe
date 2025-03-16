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
import { MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

// Usuarios con su color y correo
const users = [
    { id: 0, name: "Jean Pierre", color: "#3B82F6", email: "jeanpierrel.hu@gmail.com" },
    { id: 1, name: "Alex", color: "#10B981", email: "alex.recoil@gmail.com" },
    { id: 2, name: "Diana", color: "#EC4899", email: "diana.auristela@gmail.com" },
    { id: 3, name: "David", color: "#8B5CF6", email: "aes.hur.v@gmail.com" }
];

const Calendario = () => {
    // Para la vista Desktop (mes actual)
    const [currentDate, setCurrentDate] = useState(new Date());

    // Para la vista Mobile (semana actual)
    const [selectedWeekStart, setSelectedWeekStart] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 }) // 1 = lunes
    );

    // Día seleccionado (al tocar un día se abre el modal)
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Lista de eventos/tickets
    const [events, setEvents] = useState([]);

    // Campos para nuevo ticket
    const [newEventTitle, setNewEventTitle] = useState("");
    const [selectedUser, setSelectedUser] = useState(users[0].id);

    // Modal para crear ticket
    const [isModalOpen, setModalOpen] = useState(false);

    // Para bloquear botones cuando se está guardando
    const [isLoading, setIsLoading] = useState(false);

    // Detectar si es móvil
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Cargar eventos al inicio
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const calendarEvents = await getCalendarEvents();
                const mappedEvents = calendarEvents.map((event) => ({
                    ...event,
                    // Ajuste si viene como timestamp de Firestore
                    date: event.date?.seconds
                        ? new Date(event.date.seconds * 1000)
                        : new Date(event.date)
                }));
                setEvents(mappedEvents);
            } catch (error) {
                toast.error("Error al cargar los tickets");
            }
        };
        fetchEvents();
    }, []);

    // Navegar meses (Desktop)
    const prevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };
    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    // Navegar semanas (Mobile)
    const nextWeek = () => {
        setSelectedWeekStart((prev) => addDays(prev, 7));
    };
    const prevWeek = () => {
        setSelectedWeekStart((prev) => addDays(prev, -7));
    };

    // Al tocar un día en cualquier vista
    const handleDayClick = (date) => {
        setSelectedDate(date);
        setModalOpen(true);
    };

    // Guardar nuevo ticket
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

            // Recargar eventos
            const updatedEvents = await getCalendarEvents();
            const mappedEvents = updatedEvents.map((event) => ({
                ...event,
                date: event.date?.seconds
                    ? new Date(event.date.seconds * 1000)
                    : new Date(event.date)
            }));
            setEvents(mappedEvents);

            setNewEventTitle("");
            toast.success("Ticket asignado correctamente");
            sendEmailNotification(selectedUser);
            setModalOpen(false);
        } catch (error) {
            toast.error("Error al asignar ticket");
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar ticket
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

    // Enviar notificación por correo
    const sendEmailNotification = async (userId) => {
        const user = users.find((u) => u.id === userId);
        if (!user?.email) return;

        try {
            await emailjs.send(
                "service_gny6l1b",
                "template_5ibgcun",
                {
                    to_email: user.email,
                    message: `Tienes un nuevo ticket asignado para ${format(
                        selectedDate,
                        "dd/MM/yyyy"
                    )}`
                },
                "GPwbrOJ0Wdjhl0wbB"
            );
        } catch (error) {
            console.error("Error al enviar notificación:", error);
        }
    };

    // Componente: Calendario Mensual (Desktop)
    const DesktopCalendar = () => {
        const daysInMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        ).getDate();

        const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        ).getDay();

        return (
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
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                        <div key={day} className="p-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {/* Espacios vacíos antes del primer día del mes */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-24 bg-bg-base-white rounded-lg" />
                    ))}

                    {/* Días del mes */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const date = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            i + 1
                        );
                        const dayEvents = events.filter(
                            (event) =>
                                event.date &&
                                event.date.getDate() === date.getDate() &&
                                event.date.getMonth() === date.getMonth() &&
                                event.date.getFullYear() === date.getFullYear()
                        );

                        const isToday = date.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={i}
                                className={`h-24 p-2 border rounded-lg ${isToday ? "border-2 border-black bg-gray-50" : "bg-white"
                                    }`}
                                onClick={() => handleDayClick(date)}
                            >
                                <div className="font-bold mb-1">{i + 1}</div>
                                {dayEvents.map((event) => {
                                    const userColor =
                                        users.find((u) => u.id === event.userId)?.color || "#333";
                                    return (
                                        <div
                                            key={event.id}
                                            className="text-xs p-1 mb-1 rounded truncate"
                                            style={{
                                                backgroundColor: userColor,
                                                color: "white"
                                            }}
                                        >
                                            {event.title}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    // Componente: Calendario Semanal (Mobile) + lista de pendientes desde hoy
    const MobileWeekCalendar = () => {
        const daysOfWeek = Array.from({ length: 7 }).map((_, i) =>
            addDays(selectedWeekStart, i)
        );

        // Función para obtener todos los tickets pendientes desde hoy en adelante
        const getPendingEvents = () => {
            const today = startOfDay(new Date());
            return events
                .filter((event) => event.date >= today)
                .sort((a, b) => a.date - b.date);
        };

        const upcomingEvents = getPendingEvents();

        return (
            <div className="space-y-4">
                {/* Encabezado: navegación semanal */}
                <div className="flex items-center justify-between">
                    <button onClick={prevWeek} className="bg-bg-base-white text-accent-secondary rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-accent-primary">
                        <MdChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold">
                        {format(selectedWeekStart, "d MMM", { locale: es })} -{" "}
                        {format(addDays(selectedWeekStart, 6), "d MMM yyyy", { locale: es })}
                    </h1>
                    <button onClick={nextWeek} className="bg-bg-base-white text-accent-secondary rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-accent-primary">
                        <MdChevronRight size={24} />
                    </button>
                </div>

                {/* Calendario semanal para elegir día y asignar ticket */}
                <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((dayDate) => {
                        const isToday = isSameDay(dayDate, new Date());
                        const isSelected = isSameDay(dayDate, selectedDate);

                        return (
                            <div
                                key={dayDate.toISOString()}
                                onClick={() => handleDayClick(dayDate)}
                                className={`
                  flex flex-col items-center py-1 px-4 rounded cursor-pointer
                  ${isToday ? "bg-bg-base-white" : ""}
                  ${isSelected
                                        ? "border-2 border-gray-800"
                                        : "border border-gray-200"
                                    }
                `}
                            >
                                <span className="text-sm font-medium">
                                    {format(dayDate, "EEE", { locale: es })}
                                </span>
                                <span className="text-lg font-bold">
                                    {format(dayDate, "d", { locale: es })}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Lista de todos los pendientes futuros */}
                <div className="space-y-2">
                    {upcomingEvents.length === 0 ? (
                        <p className="text-gray-500">No hay tickets pendientes.</p>
                    ) : (
                        upcomingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-bg-base-white p-3 rounded-lg flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-medium text-sm">{event.title}</p>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {format(event.date, "eeee d 'de' MMMM", { locale: es })} -{" "}
                                        {users.find((u) => u.id === event.userId)?.name}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveEvent(event.id)}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <MdClose size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 max-w-7xl mx-auto">
            {isMobile ? <MobileWeekCalendar /> : <DesktopCalendar />}

            <DetailsModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                {(() => {
                    // 1. Filtrar los eventos para el día seleccionado
                    const dayEvents = events.filter((event) => {
                        if (!selectedDate || !event.date) return false;
                        return (
                            event.date.getDate() === selectedDate.getDate() &&
                            event.date.getMonth() === selectedDate.getMonth() &&
                            event.date.getFullYear() === selectedDate.getFullYear()
                        );
                    });

                    return (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">
                                {selectedDate
                                    ? format(selectedDate, "eeee d 'de' MMMM", { locale: es })
                                    : "Nuevo Ticket"}
                            </h2>

                            {/* 2. Lista de tickets ya existentes para ese día */}
                            {dayEvents.length > 0 && (
                                <div className="space-y-2 max-h-32 overflow-auto">
                                    <p className="font-semibold text-sm">Tickets del día:</p>
                                    {dayEvents.map((event) => {
                                        const userName = users.find((u) => u.id === event.userId)?.name || "Desconocido";
                                        return (
                                            <div
                                                key={event.id}
                                                className="bg-gray-50 p-2 rounded flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="font-medium text-sm">{event.title}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Asignado a {userName}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveEvent(event.id)}
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <MdClose size={16} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Formulario para agregar un nuevo ticket */}
                            <input
                                type="text"
                                placeholder="Nuevo ticket..."
                                className="w-full p-2 border rounded"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                            />

                            <select
                                className="w-full p-2 border rounded"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(Number(e.target.value))}
                            >
                                {users.map((user) => (
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
                                    {isLoading ? "Guardando..." : "Agregar Ticket"}
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </DetailsModal>

        </div>
    );
};

export default Calendario;
