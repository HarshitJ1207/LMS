import React, { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const StyledLink = styled(RouterLink)(({ theme }) => ({
    color: theme.palette.common.white,
    textDecoration: "none",
    "&:hover": {
        color: theme.palette.primary.light,
        textDecoration: "underline",
    },
}));

const NavButton = styled(Button)(({ theme }) => ({
    color: theme.palette.common.white,
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
    },
}));

function NavigationBar() {
    const { isLoggedIn } = useContext(AuthContext);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const NavLinks = () => (
        <>
            {isLoggedIn === "Admin" ? (
                <>
                    <NavButton component={StyledLink} to="/admin">Home</NavButton>
                    <NavButton component={StyledLink} to="/admin/Books">Books</NavButton>
                    <NavButton component={StyledLink} to="/admin/Users">Users</NavButton>
                    <NavButton component={StyledLink} to="/admin/BookIssue">Book Issue</NavButton>
                    <NavButton component={StyledLink} to="/admin/BookReturn">Book Return</NavButton>
                </>
            ) : (
                <>
                    <NavButton component={StyledLink} to="/">Home</NavButton>
                    <NavButton component={StyledLink} to="/Books">Books</NavButton>
                    {isLoggedIn && <NavButton component={StyledLink} to="/Me">Me</NavButton>}
                </>
            )}
        </>
    );

    const AuthLinks = () => (
        <>
            {isLoggedIn ? (
                <NavButton component={StyledLink} to="/Signout">Signout</NavButton>
            ) : (
                <>
                    <NavButton component={StyledLink} to="/Signup">Signup</NavButton>
                    <NavButton component={StyledLink} to="/Login">Login</NavButton>
                </>
            )}
        </>
    );

    const drawerContent = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {isLoggedIn === "Admin" ? (
                    <>
                        <ListItem button component={RouterLink} to="/admin">
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="/admin/Books">
                            <ListItemText primary="Books" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="/admin/Users">
                            <ListItemText primary="Users" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="/admin/BookIssue">
                            <ListItemText primary="Book Issue" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="/admin/BookReturn">
                            <ListItemText primary="Book Return" />
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem button component={RouterLink} to="/">
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="/Books">
                            <ListItemText primary="Books" />
                        </ListItem>
                        {isLoggedIn && (
                            <ListItem button component={RouterLink} to="/Me">
                                <ListItemText primary="Me" />
                            </ListItem>
                        )}
                    </>
                )}
                {isLoggedIn ? (
                    <ListItem button component={RouterLink} to="/Signout">
                        <ListItemText primary="Signout" />
                    </ListItem>
                ) : (
                    <>
                        <ListItem button component={RouterLink} to="/Signup">
                            <ListItemText primary="Signup" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="/Login">
                            <ListItemText primary="Login" />
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                {isMobile ? (
                    <>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="left"
                            open={drawerOpen}
                            onClose={toggleDrawer(false)}
                        >
                            {drawerContent}
                        </Drawer>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <NavLinks />
                            </Box>
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <AuthLinks />
                        </Box>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default NavigationBar;