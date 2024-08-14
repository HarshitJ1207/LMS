import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5", // Hardcoded color
});

const StyledCircularProgress = styled(CircularProgress)({
    marginBottom: "16px", // Hardcoded spacing
});

const LoadingPage = () => {
    return (
        <StyledBox>
            <StyledCircularProgress size={64} />
            <Typography variant="h4" color="textSecondary" fontWeight="medium">
                Loading...
            </Typography>
        </StyledBox>
    );
};

export default LoadingPage;