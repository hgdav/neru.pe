import { collection, getDocs, query, where, Timestamp, orderBy } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

async function fetchRecords(month, year) {
    try {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

        const startOfMonth = Timestamp.fromDate(firstDayOfMonth);
        const endOfMonth = Timestamp.fromDate(lastDayOfMonth);

        const q = query(
            collection(db, "registro-clientes"),
            where("fecha", ">=", startOfMonth),
            where("fecha", "<=", endOfMonth),
            orderBy("fecha", "desc") // Ordenar por fecha descendente
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

export { fetchRecords };
