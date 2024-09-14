/**
 * Convierte un Firestore Timestamp en una fecha legible.
 * @param {object} timestamp - El Firestore Timestamp a convertir.
 * @returns {string} - La fecha en formato legible (ejemplo: 14 de septiembre de 2024).
 */
export function formatFirestoreTimestamp(timestamp) {
    if (timestamp && typeof timestamp.toDate === 'function') {
        const date = timestamp.toDate();
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    return 'Fecha no disponible';
}
