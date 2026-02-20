import { createSlice } from '@reduxjs/toolkit';

const user = localStorage.getItem('user');
const token = localStorage.getItem('token');

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: user ? JSON.parse(user) : null,
        token: token || null,
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;