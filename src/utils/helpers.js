export function formatFirestoreDateWithDay(date) {
    if (date && typeof date.toDate === 'function') {
        // Si es un Timestamp de Firestore
        date = date.toDate();
    } else if (typeof date === 'string') {
        // Si es una cadena (como "2024-09-16"), descomponerla
        const [year, month, day] = date.split('-').map(Number);
        date = new Date(year, month - 1, day);
    } else if (date instanceof Date) {
        // Ya es un objeto Date, no hacemos nada
    } else {
        // Si no es un formato reconocido, devolvemos un mensaje de error
        return 'Fecha no disponible';
    }

    if (date instanceof Date && !isNaN(date)) {
        const options = { weekday: 'long', day: 'numeric', month: 'short' };
        const formattedDate = date
            .toLocaleDateString('es-ES', options)
            .replace('.', '');
        return formattedDate;
    }

    return 'Fecha no disponible';
}
