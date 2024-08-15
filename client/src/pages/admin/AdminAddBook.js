import React, { useState } from "react";
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
} from '@mui/material';

const AdminAddBook = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [subject, setSubject] = useState("");
    const [isbn, setIsbn] = useState("");
    const [errors, setErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    console.log(errors);    

    const validate = () => {
        const errors = {};
        if (title.trim().length > 100)
            errors.title = "Title must be less than 100 characters";
        if (author.trim().length > 100)
            errors.author = "Author must be less than 100 characters";
        if (subject.trim().length > 100)
            errors.subject = "Subject must be less than 100 characters";
        if (!/^\d{13}$/.test(isbn.trim()))
            errors.ISBN = "ISBN must be a 13-digit number";
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
                `${process.env.REACT_APP_API_BASE_URL}/admin/addBook`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: title.trim(),
                        author: author.trim(),
                        subject: subject.trim(),
                        ISBN: isbn.trim(),
                    }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error(JSON.stringify({message: "Internal Server Error"}));
                });
                throw new Error(JSON.stringify(errorData.errors));
            }
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
                    Add Book
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                    <TextField
                        label="Author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.author}
                        helperText={errors.author}
                    />
                    <TextField
                        label="Subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.subject}
                        helperText={errors.subject}
                    />
                    <TextField
                        label="ISBN"
                        type="text"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.ISBN}
                        helperText={errors.ISBN}
                    />
                    {errors.message && <Typography color="error.main" sx={{ mt: 2 }}>{errors.message}</Typography>}
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
                        {formLoading ? 'Loading...' : 'Add Book'}
                    </Button>
                    {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
                </form>
            </Paper>
        </Container>
    );
};

export default AdminAddBook;