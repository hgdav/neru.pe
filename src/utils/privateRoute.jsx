import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';
import { Header } from '../Components/Header';
import { Aside } from '../Components/Aside';
import { LoadingIndex } from '../Pages/Loaders/LoadingIndex';

const PrivateRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <LoadingIndex />;
    }

    return user ? (
        <>
            <Header />
            <div className="flex h-100vh">
                <aside className="w-64 bg-gray-800 text-white md:block hidden">
                    <Aside />
                </aside>
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>

        </>
    ) : (
        <Navigate to="/login" />
    );
};

export { PrivateRoute };
