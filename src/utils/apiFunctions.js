// utils/apiFunctions.js
import { collection, getDocs, query, where, Timestamp, orderBy } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

/**
 * Obtiene los registros de un mes específico de un año dado.
 * @param {number} month - El mes (0-11, donde 0 = Enero).
 * @param {number} year - El año (e.g., 2024).
 * @returns {Promise<Array>} - Una promesa que resuelve en un array de registros.
 */
async function fetchRecords(month, year) {
    try {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

        const startOfMonth = Timestamp.fromDate(firstDayOfMonth);
        const endOfMonth = Timestamp.fromDate(lastDayOfMonth);

        const q = query(
            collection(db, "registro-clientes"),
            where("fecha_envio", ">=", startOfMonth),
            where("fecha_envio", "<=", endOfMonth),
            orderBy("fecha_envio", "desc") // Ordenar por fecha descendente
        );

        const querySnapshot = await getDocs(q);
        const records = [];
        querySnapshot.forEach((doc) => {
            records.push({ id: doc.id, ...doc.data() });
        });
        return records;
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
}

/**
 * Obtiene todos los registros de un año específico.
 * @param {number} year - El año (e.g., 2024).
 * @returns {Promise<Array>} - Una promesa que resuelve en un array de registros.
 */
async function fetchRecordsByYear(year) {
    try {
        const firstDayOfYear = new Date(year, 0, 1); // Enero es 0
        const lastDayOfYear = new Date(year, 11, 31, 23, 59, 59, 999); // Diciembre es 11

        const startOfYear = Timestamp.fromDate(firstDayOfYear);
        const endOfYear = Timestamp.fromDate(lastDayOfYear);

        const q = query(
            collection(db, "registro-clientes"),
            where("fecha_envio", ">=", startOfYear),
            where("fecha_envio", "<=", endOfYear),
            orderBy("fecha_envio", "desc") // Ordenar por fecha descendente
        );

        const querySnapshot = await getDocs(q);
        const records = [];
        querySnapshot.forEach((doc) => {
            records.push({ id: doc.id, ...doc.data() });
        });
        return records;
    } catch (error) {
        console.error("Error fetching records by year:", error);
        throw error;
    }
}

export { fetchRecords, fetchRecordsByYear };
