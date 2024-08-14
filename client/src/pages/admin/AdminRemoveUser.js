import React, { useState } from "react";
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
} from '@mui/material';

const AdminRemoveUser = () => {
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const validate = () => {
        const errors = {};
        if (!username) errors.username = "Username is required";
        return errors;
    };

    const handleSubmit = async (e) => {
        if (formLoading) return;
        e.preventDefault();
        setFormLoading(true);
        setSuccess(null);
        setErrors({});
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setFormLoading(false);
            return;
        }
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/admin/removeUser/${username}`,
                {
                    method: "DELETE",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error("Network response was not ok");
                });
                throw new Error(errorData.error || "Network response was not ok");
            }
            const data = await response.json();
            setUsername("");
            setErrors({});
            setSuccess(data.message);
        } catch (error) {
            setErrors({ username: error.message });
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
                    Remove User
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.username}
                        helperText={errors.username}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={formLoading}
                        sx={{
                            mt: 2,
                        }}
                    >
                        {formLoading ? 'Loading...' : 'Remove User'}
                    </Button>
                    {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
                </form>
            </Paper>
        </Container>
    );
};

export default AdminRemoveUser;