import { useContext, useDebugValue } from 'react';
import AuthContext from '../context/AuthContext';

export function useAuth() {
    const { user, login, logout, loading } = useContext(AuthContext);

    useDebugValue(user ? "Logged In" : "Logged Out");

    return { user, login, logout, loading };
}