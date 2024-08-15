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
    console.log(errors);
    const validate = () => {
        const errors = {};
        if (!bookId) {
            errors.bookID = "Book ID is required";
        } else if (!/^[A-Z]\d{4}$/.test(bookId.trim())) {
            errors.bookID = "Invalid BookId";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        if (formLoading) return;
        setFormLoading(true);
        setSuccess(null);
        setErrors({});
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setFormLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/admin/removeBook/${bookId.trim()}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error(JSON.stringify({message: "Internal Server Error"}));
                });
                if (errorData.errors) {
					throw new Error(JSON.stringify(errorData.errors));
				} else {
					throw new Error(JSON.stringify({ message: "Internal Server Error" }));
				}
            }
            setErrors({});
            const data = await response.json();
            setSuccess(data.message);
        } catch (error) {
            setErrors(JSON.parse(error.message)); 
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
                        error={!!errors.bookID}
                        helperText={errors.bookID}
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
                    {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
                    {errors.message && <Typography color="error.main" sx={{ mt: 2 }}>{errors.message}</Typography>}
                </form>
            </Paper>
        </Container>
    );
};

export default AdminRemoveBook;