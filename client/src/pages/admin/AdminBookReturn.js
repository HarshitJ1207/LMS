import React, { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Box,
} from '@mui/material';

const AdminBookReturn = () => {
    const [bookID, setBookID] = useState('');
    const [issueData, setIssueData] = useState(null);
    const [error, setError] = useState();
    const [success, setSuccess] = useState(null);
    const [formLoading , setFormLoading] = useState(false);
    const handleSubmit = async (e) => {
        if(formLoading) return;
        setFormLoading(true);
        setSuccess(null);
        setError(null);
        e.preventDefault();
        if(!issueData){
            try {
                const token = localStorage.getItem('token');
                const url = `${process.env.REACT_APP_API_BASE_URL}/admin/issueData?bookID=${bookID.trim()}`;
                const response = await fetch(url, {
                    method: 'GET',
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
                setIssueData(data);
            } catch (err) {
                setError(err);
            }
            finally{
                setFormLoading(false);
            }
        }
        else{
            setIssueData(null);
            try {
                const token = localStorage.getItem('token');
                const url = `${process.env.REACT_APP_API_BASE_URL}/admin/bookReturn`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ bookID: bookID.trim() }),
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        throw new Error('Network response was not ok');
                    });
                    throw new Error(errorData.error || 'Network response was not ok');
                }
                const data = await response.json();
                setSuccess(data.message);
            } catch (err) {
                setError(err);
            }
            finally{
                setFormLoading(false);
            }
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
                    Return Book
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Book ID"
                        type="text"
                        value={bookID}
                        onChange={(e) => {setBookID(e.target.value); setIssueData(null);}}
                        fullWidth
                        margin="normal"
                        required
                        error = {error ? true : false}
                        helperText={error ? error.message : ''}
                    />

                    {issueData && (
                        <Box sx={{ backgroundColor: 'primary.dark', color: 'white', p: 2, borderRadius: '4px', mb: 2, textAlign: 'center' }}>
                            <Typography>User: {issueData.user}</Typography>
                            <Typography>Fine: {issueData.fine}</Typography>
                        </Box>
                    )}

                    {success && <Typography color="success.main" >{success}</Typography>}

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
                        {issueData ? 'Return Book' : 'Search Book'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AdminBookReturn;