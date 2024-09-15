import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';
import { Header } from '../Components/Header';

const PrivateRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <p>Cargando...</p>;
    }

    return user ? (
        <>
            <Header />
            {children}
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export { PrivateRoute };