import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
            <App />
        </AuthProvider>
    </ThemeProvider>
);