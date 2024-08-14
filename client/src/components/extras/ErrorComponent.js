import React from "react";
import { Box, Typography } from "@mui/material";

const ErrorComponent = ({ error }) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return (
        <Box
            sx={{
                color: 'text.primary',
                backgroundColor: 'error.light',
                padding: 2,
                border: 1,
                borderColor: 'error.main',
                borderRadius: 1,
                marginY: 2,
                width: '50%',
                marginX: 'auto',
            }}
        >
            <Typography>{errorMessage}</Typography>
        </Box>
    );
};

export default ErrorComponent;