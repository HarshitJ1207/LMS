import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logo from '../../components/Logo';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const MemberHomepage = () => {
    const {isLoggedIn} = useContext(AuthContext); // Get isLoggedIn and isAdmin from AuthContext
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn === 'Admin') {
            navigate('/admin'); // Redirect to /admin if the user is an admin
        }
    }, [isLoggedIn, navigate]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Logo and Welcome Banner */}
            <Paper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
                <Logo />
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to the Library!
                </Typography>
                <Typography variant="h6">
                    Explore our vast collection and enjoy your reading journey.
                </Typography>
            </Paper>

            {/* Feature Cards */}
            <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', height: '100%' }}>
                            <LibraryBooksIcon fontSize="large" />
                            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
                                Browse Books
                            </Typography>
                            <Typography>
                                Explore our extensive collection of books across various genres.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', height: '100%' }}>
                            <SearchIcon fontSize="large" />
                            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
                                Search for Books
                            </Typography>
                            <Typography>
                                Use our search tool to find specific titles or authors.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', height: '100%' }}>
                            <AccountCircleIcon fontSize="large" />
                            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
                                Manage Profile
                            </Typography>
                            <Typography>
                                Update your profile and view your issue/return history.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Footer */}
            <Paper sx={{ p: 2, mt: 4, textAlign: 'center' }}>
                <Typography variant="body2">
                    © {new Date().getFullYear()} Library Management System
                </Typography>
                <Typography variant="body2">
                    Contact us at: jain1207harshit@gmail.com
                </Typography>
            </Paper>
        </Container>
    );
};

export default MemberHomepage;