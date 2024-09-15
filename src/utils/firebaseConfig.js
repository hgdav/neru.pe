// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAx_X0ag3guh8ryxt0F__RhcrWn2taf5xY",
    authDomain: "neru-pe-db-18679.firebaseapp.com",
    projectId: "neru-pe-db-18679",
    storageBucket: "neru-pe-db-18679.appspot.com",
    messagingSenderId: "615454413211",
    appId: "1:615454413211:web:9fb163d5ea2029b4c0513e",
    measurementId: "G-7JKMQ4Y2EM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };