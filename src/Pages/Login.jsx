import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import FlickeringGrid from '../Components/FlickeringGrid';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // Nuevo estado
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);  // Inicia el estado de carga
        setError('');        // Limpia errores previos
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('Correo o contraseña incorrectos');
        } finally {
            setIsLoading(false);  // Finaliza el estado de carga
        }
    };

    return (
        <>
            <FlickeringGrid squareSize={10} gridGap={5} color="text-primary" className="z-10 absolute opacity-20 w-full" />
            <div className="flex items-center justify-center min-h-screen bg-base">
                <div className="bg-bg-base shadow-lg rounded-3xl p-8 max-w-md w-full z-10">
                    <div className="space-y-4 mb-4 flex justify-center items-center w-full">
                        <img src="logo.svg" alt="Logo" className="w-12 h-12 object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold mb-6 text-center text-text-primary">Registro de Clientes</h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-gray-700" htmlFor="email">Correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="neru@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-700" htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-accent-secondary focus:border-transparent"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-accent-secondary text-accent-secondary-dark py-2 px-4 rounded-3xl hover:bg-accent-secondary transition duration-300 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    Iniciando sesión...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>
                </div>
            </div >
        </>
    );
};

export { Login };
