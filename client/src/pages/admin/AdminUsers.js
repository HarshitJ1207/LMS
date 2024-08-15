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

const UserSearchBox = ({ query, setQuery, setLoading, formValues, setFormValues }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const navigate = useNavigate();
	const theme = useTheme();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const onSubmit = (e) => {
		e.preventDefault();
		setQuery({...formValues, page: 1});
		setLoading(true);
	};

	const resetHandler = () => {
		setFormValues({
			searchType: "username",
			userType: "any",
			searchValue: "",
		});
		setQuery({
			page: 1,
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
					<MenuItem value="username">Username</MenuItem>
					<MenuItem value="email">Email</MenuItem>
					<MenuItem value="contactNumber">Contact Number</MenuItem>
				</Select>
				<Select
					name="userType"
					value={formValues.userType}
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
					<MenuItem value="Contractual Staff">
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
const UserTable = ({ query, setQuery, loading, setLoading, setFormValues }) => {
	const navigate = useNavigate();
	const [userList, setUserList] = useState([]);
	const [error, setError] = useState(null);
	const [maxPage, setMaxPage] = useState(1);

	useEffect(() => {
		const fetchUserList = async () => {
			setLoading(true);
			setError(null);
			setUserList([]);
			try {
				const params = new URLSearchParams(query).toString();
				const url = `${process.env.REACT_APP_API_BASE_URL}/admin/users?${params}`;
				const response = await fetch(url, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
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
				setMaxPage(data.maxPage);
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
						<TableRow sx={{ backgroundColor: "#f0f0f0" }}>
							<TableCell align="center">Username</TableCell>
							<TableCell align="center">Name</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">Contact Number</TableCell>
							<TableCell align="center">User Type</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{userList.map((user, index) => (
							<TableRow
								key={user.username}
								sx={{
									backgroundColor:
										index % 2 === 1 ? "#f0f0f0" : "#ffffff",
								}}
							>
								<TableCell
									align="center"
									onClick={() =>
										idClickHandler(user.username)
									}
									sx={{ cursor: "pointer" }}
								>
									{user.username}
								</TableCell>
								<TableCell align="center">
									{user.details.firstName}{" "}
									{user.details.lastName}
								</TableCell>
								<TableCell align="center">
									{user.details.email}
								</TableCell>
								<TableCell align="center">
									{user.details.contactNumber}
								</TableCell>
								<TableCell
									align="center"
									onClick={() => {
										setFormValues({
											searchType: "username",
											userType: user.details.userType,
											searchValue: '',
										});
										setQuery({
											page: 1,
											searchType: "username",
											userType: user.details.userType,
											searchValue: '',
										});
										setLoading(true);
									}}
									sx={{ cursor: "pointer" }}
								>
									{user.details.userType}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
				<Button
					onClick={() =>
						setQuery((query) => ({
							...query,
							page: query.page - 1,
						}))
					}
					disabled={query.page === 1}
					sx={{ m: 1 }}
					variant="contained"
				>
					Previous
				</Button>
				<Button
					onClick={() =>
						setQuery((query) => ({
							...query,
							page: query.page + 1,
						}))
					}
					disabled={query.page === maxPage}
					sx={{ m: 1 }}
					variant="contained"
				>
					Next
				</Button>
			</Box>
		</Paper>
	);
};


const AdminUsers = () => {
	console.log("render");
	const [query, setQuery] = useState({
		page: 1,
		searchType: "username",
		userType: "any",
		searchValue: "",
	});
	const [formValues, setFormValues] = useState({
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
				formValues={formValues}
				setFormValues={setFormValues}
			/>
			<UserTable
				query={query}
				setQuery={setQuery}
				setLoading={setLoading}
				loading={loading}
				formValues={formValues}
				setFormValues={setFormValues}
			/>
		</Container>
	);
};

export default AdminUsers;
