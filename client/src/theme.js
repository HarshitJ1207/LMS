import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1976d2", 
			light: "#42a5f5",
			dark: "#1565c0",
		},
		secondary: {
			main: "#9c27b0",
			light: "#ba68c8",
			dark: "#7b1fa2",
		},
		error: {
			main: "#d32f2f",
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
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
					textTransform: "none", // This prevents automatic uppercase transformation
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
