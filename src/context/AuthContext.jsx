import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const base_url = "http://127.0.0.1:8000";

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                try {
                    const response = await axios.get(`${base_url}/api/users/profile/`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${base_url}/api/users/token/`, credentials);
            const { access, refresh, user } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthContext;