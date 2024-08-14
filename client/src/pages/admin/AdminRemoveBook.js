import React, { useState } from "react";
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
} from '@mui/material';

const AdminRemoveBook = () => {
    const [bookId, setBookId] = useState("");
    const [errors, setErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [responseError, setResponseError] = useState(null);

    const validate = () => {
        const errors = {};
        if (!bookId) {
            errors.bookId = "Book ID is required";
        } else if (!/^[A-Z]\d{4}$/.test(bookId)) {
            errors.bookId = "Invalid BookId";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        if (formLoading) return;
        setFormLoading(true);
        setSuccess(null);
        setErrors({});
        setResponseError(null);
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setFormLoading(false);
            return;
        }
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/admin/removeBook/${bookId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                }
            );
            if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error("Network response was not ok");
                });
                throw new Error(errorData.error || "Network response was not ok");
            }
            setBookId("");
            setErrors({});
            const data = await response.json();
            setSuccess(data.message);
        } catch (error) {
            setResponseError(error.message);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
                    Remove Book
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Book ID"
                        type="text"
                        value={bookId}
                        onChange={(e) => setBookId(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.bookId}
                        helperText={errors.bookId}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={formLoading}
                        sx={{
                            backgroundColor: formLoading ? 'grey.500' : 'primary.main',
                            cursor: formLoading ? 'not-allowed' : 'pointer',
                            mt: 2,
                        }}
                    >
                        {formLoading ? 'Loading...' : 'Remove Book'}
                    </Button>
                    {success && <Typography color="success" sx={{ mt: 2 }}>{success}</Typography>}
                    {responseError && <Typography color="error" sx={{ mt: 2 }}>{responseError}</Typography>}
                </form>
            </Paper>
        </Container>
    );
};

export default AdminRemoveBook;