import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const TimeComponent = () => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Typography variant="body1" sx={{ mt: 1 }}>
            {currentTime.toLocaleString()}
        </Typography>
    );
};

export default TimeComponent;