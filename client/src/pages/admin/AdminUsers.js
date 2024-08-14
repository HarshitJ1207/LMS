import React, { useState, useEffect } from "react";
import LoadingComponent from "../../components/extras/LoadingComponent";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../../components/extras/ErrorComponent";
import { useTheme } from "@mui/material/styles";
import {
	Box,
	Select,
	MenuItem,
	TextField,
	Button,
	IconButton,
	Menu,
	Paper,
	Container,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const UserSearchBox = ({ query, setQuery, setLoading }) => {
	const [formState, setFormState] = useState(query);
	const [anchorEl, setAnchorEl] = useState(null);
	const navigate = useNavigate();
	const theme = useTheme();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		setQuery(formState);
	};

	const resetHandler = () => {
		setQuery({ searchType: "username", userType: "any", searchValue: "" });
		setFormState({
			searchType: "username",
			userType: "any",
			searchValue: "",
		});
		setLoading(true);
	};

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleAddUser = () => {
		navigate("/admin/addUser");
		handleMenuClose();
	};

	const handleRemoveUser = () => {
		navigate("/admin/removeUser");
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
				onSubmit={handleSubmit}
				sx={{
					display: "flex",
					flexWrap: "wrap",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Select
					name="searchType"
					value={formState.searchType}
					onChange={handleChange}
					sx={{
						m: 1,
						minWidth: 120,
						color: theme.palette.text.primary,
					}}
				>
					<MenuItem value="username">Username</MenuItem>
					<MenuItem value="email">Email</MenuItem>
					<MenuItem value="contactNumber">Contact Number</MenuItem>
				</Select>
				<Select
					name="userType"
					value={formState.userType}
					onChange={handleChange}
					sx={{
						m: 1,
						minWidth: 120,
						color: theme.palette.text.primary,
					}}
				>
					<MenuItem value="any">Any</MenuItem>
					<MenuItem value="Faculty">Faculty</MenuItem>
					<MenuItem value="Visiting / Guest Faculty">
						Visiting / Guest Faculty
					</MenuItem>
					<MenuItem value="Permanent Staff">
						Staff (Permanent)
					</MenuItem>
					<MenuItem value="contractualStaff">
						Staff (Contractual)
					</MenuItem>
					<MenuItem value="Research Scholars/PhD">
						Research Scholars/Ph.D
					</MenuItem>
					<MenuItem value="PG Student">Student (PG)</MenuItem>
					<MenuItem value="UG Student">Student (UG)</MenuItem>
					<MenuItem value="Young Learner">
						Young Learner Library (YLL)
					</MenuItem>
					<MenuItem value="Admin">Admin</MenuItem>
				</Select>
				<TextField
					name="searchValue"
					label="Search"
					value={formState.searchValue}
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
					onClick={resetHandler}
					variant="contained"
					color="secondary"
					sx={{ m: 1 }}
				>
					Reset
				</Button>
				<div>
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
						<MenuItem onClick={handleAddUser}>Add User</MenuItem>
						<MenuItem onClick={handleRemoveUser}>
							Remove User
						</MenuItem>
					</Menu>
				</div>
			</Box>
		</Paper>
	);
};
// UserTable Component
const UserTable = ({ query, loading, setLoading }) => {
	const navigate = useNavigate();
	const [userList, setUserList] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUserList = async () => {
			try {
				const params = new URLSearchParams(query).toString();
				const url = `${process.env.REACT_APP_API_BASE_URL}/admin/users?${params}`;
				const response = await fetch(url, {
					credentials: "include",
				});
				if (!response.ok) {
					const errorData = await response.json().catch(() => {
						throw new Error("Network response was not ok");
					});
					throw new Error(
						errorData.error || "Network response was not ok"
					);
				}
				const data = await response.json();
				setUserList(data.userList);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};
		fetchUserList();
	}, [query, setLoading]);

	const idClickHandler = (userID) => {
		navigate(`/admin/user/${userID}`);
	};

    if (error) {
        return <ErrorComponent error={error} />;
    }

    if (loading) {
        return <LoadingComponent />;
    }

    if (userList.length === 0) {
        return (
            <Paper elevation={3} sx={{ m: 3, p: 4 }}>
                <Typography variant="h4" align="center" color="text.secondary">
                    No Users Found
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ m: 3, p: 4 }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Username</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Contact Number</TableCell>
                            <TableCell align="center">User Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((user) => (
                            <TableRow key={user.details.userID}>
                                <TableCell
                                    align="center"
                                    onClick={() => idClickHandler(user.details.username)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <Typography
                                        component="button"
                                        underline="hover"
                                        sx={{ cursor: "pointer" }}
                                    >
                                        {user.details.username}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    {user.details.email}
                                </TableCell>
                                <TableCell align="center">
                                    {user.details.contactNumber}
                                </TableCell>
                                <TableCell align="center">
                                    {user.details.userType}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};


const AdminUsers = () => {
	console.log("render");
	const [query, setQuery] = useState({
		searchType: "username",
		userType: "any",
		searchValue: "",
	});
	const [loading, setLoading] = useState(true);
	console.log(query);
	return (
		<Container maxWidth="lg">
			<UserSearchBox
				query={query}
				setQuery={setQuery}
				setLoading={setLoading}
			/>
			<UserTable
				query={query}
				setLoading={setLoading}
				loading={loading}
			/>
		</Container>
	);
};

export default AdminUsers;
