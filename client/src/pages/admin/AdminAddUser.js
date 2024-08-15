import React, { useState } from "react";
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    MenuItem,
} from '@mui/material';

const AdminAddUser = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [userType, setUserType] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    console.log(errors);
    const userTypes = [
        "Faculty",
        "Admin",
        "Visiting / Guest Faculty",
        "Permanent Staff",
        "Contractual Staff",
        "Research Scholars/PhD",
        "PG Student", 
        "UG Student",
        "Young Learner",
    ];

    const validate = () => {
		const errors = {};
        if(!firstName.trim()){
            errors.firstName = "First name is required";
        }
        if(!lastName.trim()){
            errors.lastName = "Last name is required";
        }
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) {
			errors.email = "Email is required";
		} else if (!emailRegex.test(email.trim().toLowerCase())) {
			errors.email = "Email is not valid";
		}
		const contactNumberRegex = /^\d{10}$/;
		if (!contactNumber) {
			errors.contactNumber = "Contact number is required";
		} else if (!contactNumberRegex.test(contactNumber.trim())) {
			errors.contactNumber = "Contact number must be a 10-digit number";
		}
		if (!userType) {
			errors.userType = "User type is required";
		}
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{4,12}$/;
		if (!password) {
			errors.password = "Password is required";
		} else if (!passwordRegex.test(password)) {
			errors.password =
				"Password must contain at least one letter, one number, and be between 4 and 12 characters long";
		}
        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
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
                `${process.env.REACT_APP_API_BASE_URL}/admin/addUser`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        email: email.toLowerCase().trim(),
                        contactNumber: contactNumber.trim(),
                        userType,
                        password,
                        confirmPassword,
                    }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error(JSON.stringify({message: "Network response was not ok"}));
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
                    Add User
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="First Name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                    />
                    <TextField
                        label="Last Name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        label="Contact Number"
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.contactNumber}
                        helperText={errors.contactNumber}
                    />
                    <TextField
                        label="User Type"
                        select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.userType}
                        helperText={errors.userType}
                    >
                        <MenuItem value="">Select User Type</MenuItem>
                        {userTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
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
                        {formLoading ? 'Adding User...' : 'Add User'}
                    </Button>
                    {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
                    {errors.message && <Typography color="error.main" sx={{ mt: 2 }}>{errors.message}</Typography>}
                </form>
            </Paper>
        </Container>
    );
};

export default AdminAddUser;