import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    TextField,
    Button,
    Typography,
    Paper
} from "@mui/material";

function LoginForm() {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const submitHandler = async (e) => {
        if(formLoading) return; 
        e.preventDefault();
        setFormLoading(true);
        setError('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username.toLowerCase().trim(),
                    password: formData.password,
                }),
            });
            if(!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error('Network response was not ok');
                });
                throw new Error(errorData.error || 'Network response was not ok');
            }
            const data = await response.json();
            const userType = data.userType;
            localStorage.setItem('token', data.token);
            setError('');
            login(userType);
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setFormLoading(false);
        }
    };
    return (
        <React.Fragment>
            <Paper elevation={3} sx={{ m: 3, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', maxWidth: 600, mx: 'auto', mt: 5 }}> 
                <form onSubmit={submitHandler}>
                    <TextField
                        name="username"
                        type="text"
                        label="Username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        sx={{ mb: 2 }} 
                    />
                    <TextField
                        name="password"
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        sx={{ mb: 2 }} 
                    />
                    {error && <Typography color="error.main" sx={{ mb: 2 }}>{error}</Typography>} 
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={formLoading}
                        sx={{ mb: 2 }} 
                    >
                        {formLoading ? 'Loading...' : 'Login'}
                    </Button>
                </form>
            </Paper>
        </React.Fragment>
    );
}

function Login() {
    return (
        <React.Fragment>
            <LoginForm />
        </React.Fragment>
    );
}

export default Login;