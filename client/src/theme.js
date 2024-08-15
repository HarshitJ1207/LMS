import { createTheme } from "@mui/material/styles";
import "@fontsource/amiri-quran"; // Import the font

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#6575a8", 
            light: "#8b9bd6", 
            dark: "#3e4f7a", 
        },
        secondary: {
            main: "#9c27b0",
            light: "#ba68c8",
            dark: "#7b1fa2",
        },
        error: {
            main: "#d32f2f",
        },
        success: {
            main: "#388e3c",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
        text: {
            primary: "#333333",
            secondary: "#666666",
        },
        grey: {
            100: "#f5f5f5",
            200: "#eeeeee",
            300: "#e0e0e0",
            400: "#bdbdbd",
            500: "#9e9e9e",
            600: "#757575",
            700: "#616161",
            800: "#424242",
            900: "#212121",
        },
    },
    typography: {
        fontFamily: '"Amiri Quran", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
                },
            },
        },
    },
});

export default theme;