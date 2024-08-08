import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = (userStatus = true) => setIsLoggedIn(userStatus);
    const logout = async () => {
        setIsLoggedIn(false);
        await fetch('http://localhost:8000/api/logout', { method: 'POST', credentials: 'include' });
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};