import React from 'react';
import { ReactSVG } from 'react-svg';
import { Box } from '@mui/material';
import logo from '../assets/logo-no-background.svg';

const Logo = () => {
    return (
        <Box
            sx={{
                maxWidth: '300px', // Adjusted size for a larger logo
                width: '100%',
                height: 'auto',
                margin: '0px auto', // Adjust margin as needed
                display: 'block',
                '& svg': {
                    width: '100%',
                    height: 'auto',
                }
            }}
        >
            <ReactSVG
                src={logo}
                beforeInjection={svg => {
                    svg.setAttribute('viewBox', '0 0 1500 215'); // Adjust viewBox if needed
                }}
            />
        </Box>
    );
};

export default Logo;
