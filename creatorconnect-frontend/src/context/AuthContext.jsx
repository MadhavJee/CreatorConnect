import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// API calls
const loginUser = async (credentials) => {
    const res = await axios.post('http://localhost:5000/auth/login', credentials, {
        withCredentials: true
    });
    return res.data;
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!user || !token) throw new Error('No user found');
    return JSON.parse(user);
};

const logoutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, []);

    const login = async (credentials) => {
        try {
            const data = await loginUser(credentials);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            logoutUser();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};