/**
 * Convierte una fecha (Timestamp, Date o cadena) en una fecha legible con día de la semana, día y mes abreviado.
 * @param {object|string} date - La fecha a convertir, puede ser un Timestamp de Firestore, un objeto Date, o una cadena.
 * @returns {string} - La fecha en formato legible (ejemplo: "Lunes 16 Sept").
 */
export function formatFirestoreDateWithDay(date) {
    if (date && typeof date.toDate === 'function') {
        // Si es un Timestamp de Firestore
        date = date.toDate();
    } else if (typeof date === 'string') {
        // Si es una cadena (como "2024-09-16"), conviértela a Date
        date = new Date(date);
    }

    if (date instanceof Date && !isNaN(date)) {
        const options = { weekday: 'long', day: 'numeric', month: 'short' };
        return date.toLocaleDateString('es-ES', options).replace('.', ''); // Quitamos el punto tras el mes abreviado
    }

    return 'Fecha no disponible';
}
