import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PageNotFound = () => {
    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                textAlign="center"
            >
                <Typography variant="h1" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1">
                    The page you are looking for does not exist.
                </Typography>
            </Box>
        </Container>
    );
};

export default PageNotFound;