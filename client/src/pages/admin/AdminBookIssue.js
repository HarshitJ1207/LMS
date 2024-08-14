import React, { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Box,
} from '@mui/material';

const AdminBookIssue = () => {
    const [username, setUsername] = useState('');
    const [bookID, setBookID] = useState('');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const handleBlur = async () => {
        setUserData(null);
        setError('');
        setSuccess(null);
        if (username) {
            try {
                const token = localStorage.getItem('token');
                const url = `${process.env.REACT_APP_API_BASE_URL}/admin/users/${username}`;
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        throw new Error('Network response was not ok');
                    });
                    throw new Error(errorData.error || 'Network response was not ok');
                }
                const data = await response.json();
                setUserData(data.user);
                setError('');
            } catch (err) {
                setUserData(null);
                setError(err.message);
            }
        } else {
            setUserData(null);
        }
    }

    const handleSubmit = async (e) => {
        if (formLoading) return;
        e.preventDefault();
        setFormLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = `${process.env.REACT_APP_API_BASE_URL}/admin/bookIssue`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username, bookID })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error('Network response was not ok');
                });
                throw new Error(errorData.error || 'Network response was not ok');
            }
            const data = await response.json();
            setError(null);
            setSuccess(data.message);
            handleBlur();
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
                    Issue Book
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={handleBlur}
                        fullWidth
                        margin="normal"
                        required
                    />

                    {userData && (
                        <Box sx={{ backgroundColor: 'primary.dark', color: 'white', p: 2, borderRadius: '4px', mb: 2, textAlign: 'center' }}>
                            <Typography>Pending Fine: {userData.overdueFine}</Typography>
                            <Typography>Books Issued: {userData.currentIssues.length}</Typography>
                        </Box>
                    )}

                    <TextField
                        label="Book ID"
                        type="text"
                        value={bookID}
                        onChange={(e) => setBookID(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />

                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                    {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={formLoading}
                        sx={{
                            backgroundColor: formLoading ? 'grey.500' : 'primary.main',
                            cursor: formLoading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {formLoading ? "Issuing..." : "Issue Book"}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AdminBookIssue;