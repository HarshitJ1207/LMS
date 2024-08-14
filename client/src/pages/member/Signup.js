import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Typography,
    Paper
} from "@mui/material";

const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        email: ''
    });
    const [error, setError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const { username, password, confirmPassword, contactNumber, email } = formData;
        if (username.length < 4 || username.length > 12) {
            return 'Username must be between 4 and 12 characters long';
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/.test(password)) {
            return 'Password must be alphanumeric, contain at least one letter and one number, and be between 4 and 12 characters long';
        }
        if (password !== confirmPassword) {
            return 'Passwords must match';
        }
        if (!/^\d{10}$/.test(contactNumber)) {
            return 'Contact number must be 10 digits';
        }
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            return 'Invalid email address';
        }
        return null;
    };

    const submitHandler = (e) => {
        if(formLoading) return;
        e.preventDefault();
        setError('');
        setFormLoading(true);
        setSuccess(false);
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setFormLoading(false);
            return;
        }
        const postData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        throw new Error('Network response was not ok');
                    });
                    throw new Error(errorData.error || 'Network response was not ok');
                }
                setFormData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                    contactNumber: '',
                    email: ''
                });
                setSuccess('Signup successful');
                navigate('/login');
            } catch (error) {
                setError(error.message);
            } finally {
                setFormLoading(false);
            }
        };
        postData();
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
                    <TextField
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        sx={{ mb: 2 }} 
                    />
                    <TextField
                        name="contactNumber"
                        type="text"
                        label="Contact Number"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        sx={{ mb: 2 }} 
                    />
                    <TextField
                        name="email"
                        type="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        sx={{ mb: 2 }} 
                    />
                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>} 
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={formLoading}
                        sx={{ mb: 2 }} 
                    >
                        {formLoading ? 'Loading...' : 'Signup'}
                    </Button>
                    {success && <Typography color="success">{success}</Typography>} 
                </form>
            </Paper>
        </React.Fragment>
    );
};


function Signup() {
    return ( 
        <React.Fragment>
            <SignupForm/>
        </React.Fragment>
    );
}

export default Signup;