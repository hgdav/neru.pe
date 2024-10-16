import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getTasks, addTask, deleteTask } from "../../utils/EventosApiFunctions";
import DetailsModal from '../Modal';
import { MdAddCircle, MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { toast } from 'react-toastify';
import axios from 'axios';

const users = [
    { id: 0, name: "Todos", color: "#000000" },
    { id: 1, name: "Jean Pierre", color: "#FF6384" },
    { id: 2, name: "Alex", color: "#36A2EB" },
    { id: 3, name: "Diana", color: "#FFCE56" },
    { id: 4, name: "David", color: "#4BC0C0" }
];

const userEmails = {
    0: "neruclothing@gmail.com", // Todos
    1: "jean@example.com", // Jean Pierre
    2: "alex@example.com", // Alex
    3: "diana@example.com", // Diana
    4: "aes.hur.v@gmail.com" // David
};


const Calendario = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [selectedUser, setSelectedUser] = useState(users[0].id);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false); // Estado para gestionar la acción de agregar

    // Obtener los días del mes actual
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const today = new Date();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const tasks = await getTasks();
                const mappedEvents = tasks.map((task) => {
                    let eventDate = null;
                    if (task.date) {
                        if (task.date.seconds !== undefined) {
                            eventDate = new Date(task.date.seconds * 1000);
                        } else if (task.date instanceof Date) {
                            eventDate = task.date;
                        } else {
                            eventDate = new Date(task.date);
                        }
                    }
                    return { ...task, date: eventDate };
                });
                setEvents(mappedEvents);
            } catch (error) {
                toast.error('Error al obtener los eventos');
            }
        };
        fetchEvents();
    }, []);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const addEvent = async () => {
        if (newEventTitle && selectedDate) {
            setIsAdding(true);
            const newEvent = { title: newEventTitle, date: selectedDate, userId: selectedUser };

            try {
                const addedEvent = await addTask(newEvent);
                if (addedEvent) {
                    // Envía un correo de notificación
                    await sendEmail(userEmails[selectedUser], newEventTitle, selectedDate);

                    const updatedTasks = await getTasks();
                    const mappedEvents = updatedTasks.map((task) => {
                        let eventDate = null;
                        if (task.date) {
                            if (task.date.seconds !== undefined) {
                                eventDate = new Date(task.date.seconds * 1000);
                            } else if (task.date instanceof Date) {
                                eventDate = task.date;
                            } else {
                                eventDate = new Date(task.date);
                            }
                        }
                        return { ...task, date: eventDate };
                    });
                    setEvents(mappedEvents);
                    setNewEventTitle("");
                    toast.success('Evento agregado exitosamente');
                    closeModal();
                } else {
                    toast.error('Error al agregar el evento');
                }
            } catch (error) {
                toast.error('Error al agregar el evento');
            } finally {
                setIsAdding(false);
            }
        }
    };

    const removeEvent = async (eventId) => {
        try {
            await deleteTask(eventId);
            const updatedTasks = await getTasks();
            const mappedEvents = updatedTasks.map((task) => {
                let eventDate = null;
                if (task.date) {
                    if (task.date.seconds !== undefined) {
                        eventDate = new Date(task.date.seconds * 1000);
                    } else if (task.date instanceof Date) {
                        eventDate = task.date;
                    } else {
                        eventDate = new Date(task.date);
                    }
                }
                return { ...task, date: eventDate };
            });
            setEvents(mappedEvents);
            toast.success('Evento eliminado exitosamente');
        } catch (error) {
            toast.error('Error al eliminar el evento');
        }
    };

    const sendEmail = async (to, title, date) => {
        const emailData = {
            to: to,
            subject: 'Ups! Se te asignó una nueva tarea',
            text: `Se ha agregado un nuevo evento: "${title}" para la fecha ${date.toLocaleString()}.`
        };

        try {
            await axios.post('https://api.resend.com/emails', emailData, {
                headers: {
                    'Authorization': `Bearer re_bhzm82gA_kPbeAqdiEvWtsMCDN9h7A3Hi`, // Reemplaza con tu API key
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            toast.error('Error al enviar la notificación por correo');
        }
    };

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
        setNewEventTitle("");
    };

    const getUserColor = (userId) => {
        const user = users.find((user) => user.id === userId);
        return user ? user.color : "#000000";
    };

    return (
        <div className="bg-main p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                </h1>
                <div className="flex items-center">
                    <button onClick={prevMonth} className="bg-accent-secondary rounded-lg p-2">
                        <MdChevronLeft size={24} />
                    </button>
                    <button onClick={nextMonth} className="bg-accent-secondary rounded-lg p-2 ml-2">
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

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div key={`empty-${i}`} className="h-24 bg-gray-100 rounded-lg"></div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                    const dayEvents = getEventsForDate(date);

                    const isToday = today.getDate() === date.getDate() &&
                        today.getMonth() === date.getMonth() &&
                        today.getFullYear() === date.getFullYear();

                    return (
                        <div
                            key={i}
                            className={`relative h-24 bg-bg-base border rounded-lg p-2 overflow-hidden text-left hover:bg-gray-50 ${isToday ? "border-2 border-accent-primary-dark" : ""}`}
                        >
                            <button className="w-full h-full text-left overflow-hidden" onClick={() => handleDayClick(date)}>
                                <div className="font-bold mb-1">{i + 1}</div>
                                {dayEvents.slice(0, 2).map((event) => (
                                    <div
                                        key={event.id}
                                        className="text-xs p-1 mb-1 rounded overflow-hidden text-ellipsis whitespace-nowrap"
                                        style={{ backgroundColor: getUserColor(event.userId), color: "#fff" }}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </button>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <DetailsModal isOpen={isModalOpen} onClose={closeModal}>
                    <h2 className="text-xl font-bold mb-4">
                        {selectedDate && format(selectedDate, "EEEE, d MMMM yyyy", { locale: es })}
                    </h2>
                    <div className="py-4">
                        {getEventsForDate(selectedDate).map((event) => (
                            <div key={event.id} className="bg-gray-100 p-2 mb-2 rounded-md">
                                <div className="flex justify-between items-center">
                                    <span>{event.title}</span>
                                    <button onClick={() => removeEvent(event.id)}>
                                        <MdClose size={16} />
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Asignado a: {users.find((user) => user.id === event.userId)?.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="py-4 border-t">

                        <textarea className="w-full p-2 border rounded-md mb-4"
                            placeholder="Nueva tarea"
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}>

                        </textarea>

                        <select
                            className="w-full p-2 border rounded-md mb-4"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(parseInt(e.target.value))}
                        >
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={addEvent}
                            className="w-full bg-accent-secondary text-accent-dark p-2 rounded-md"
                            disabled={isAdding} // Deshabilita el botón cuando está agregando
                        >
                            {isAdding ? "Agregando..." : <><MdAddCircle className="inline mr-2" /> Agregar Evento</>} {/* Cambia el texto del botón */}
                        </button>
                    </div>
                </DetailsModal>
            )}
        </div>
    );
};

export default Calendario;
