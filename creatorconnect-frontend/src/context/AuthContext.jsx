import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, clearCredentials, selectUser, selectToken } from '../store/slices/authSlice';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const token = useSelector(selectToken);

    const login = async (credentials) => {
        const res = await loginUser(credentials);
        dispatch(setCredentials({
            user: res.data.user,
            token: res.data.token,
        }));
    };

    const logout = () => {
        dispatch(clearCredentials());
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);