import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
    Box,
    Select,
    MenuItem,
    TextField,
    Button,
    IconButton,
    Menu,
    Paper,
    useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function BookSearchBox({
    query,
    setQuery,
    setLoading,
    formValues,
    setFormValues,
}) {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setQuery({ ...formValues, page: 1 });
        setLoading(true);
    };

    const handleReset = () => {
        setFormValues({
            searchType: "title",
            subject: "",
            searchValue: "",
        });
        setQuery({
            page: 1,
            searchType: "title",
            searchValue: "",
            subject: "",
        });
        setLoading(true);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddBook = () => {
        navigate("/admin/addBook");
        handleMenuClose();
    };

    const handleRemoveBook = () => {
        navigate("/admin/removeBook");
        handleMenuClose();
    };

    return (
        <Paper
            elevation={3}
            sx={{
                m: 3,
                p: 4,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }}
        >
            <Box
                component="form"
                onSubmit={onSubmit}
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Select
                    name="searchType"
                    value={formValues.searchType}
                    onChange={handleChange}
                    sx={{
                        m: 1,
                        minWidth: 120,
                        color: theme.palette.text.primary,
                    }}
                >
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="ISBN">ISBN</MenuItem>
                </Select>
                <TextField
                    name="subject"
                    placeholder="Subject"
                    value={formValues.subject}
                    onChange={handleChange}
                    sx={{
                        m: 1,
						width: "25ch",
						color: theme.palette.text.primary,
                    }}
                />
                <TextField
                    name="searchValue"
                    placeholder="Search Value"
                    value={formValues.searchValue}
                    onChange={handleChange}
                    sx={{
						m: 1,
						width: "25ch",
						color: theme.palette.text.primary,
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ m: 1 }}
                >
                    Search
                </Button>
                <Button
                    onClick={handleReset}
                    variant="contained"
                    color="secondary"
                    sx={{ m: 1 }}
                >
                    Reset
                </Button>
                {isLoggedIn === "Admin" && (
                    <>
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{ ml: 2, color: theme.palette.text.primary }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleAddBook}>
                                Add Book
                            </MenuItem>
                            <MenuItem onClick={handleRemoveBook}>
                                Remove Book
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Box>
        </Paper>
    );
}

export default BookSearchBox;