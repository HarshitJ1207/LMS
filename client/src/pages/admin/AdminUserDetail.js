import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Container,
	Paper,
	Typography,
	Grid,
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { styled } from "@mui/system";
import LoadingComponent from "../../components/extras/LoadingComponent";
import ErrorComponent from "../../components/extras/ErrorComponent";

const StyledPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.grey[200],
	padding: theme.spacing(3),
	marginBottom: theme.spacing(3),
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[3],
}));

const UserDetailsCard = ({ userDetails, onRemoveUser }) => {
	return (
		<StyledPaper>
			<Typography
				variant="h4"
				component="h2"
				gutterBottom
				sx={{ pb: 1, borderBottom: 1, borderColor: "divider" }}
			>
				User Details
			</Typography>
			<Grid container spacing={2}>
				{[
					{ label: "Username:", value: userDetails.details.username },
					{ label: "Email:", value: userDetails.details.email },
					{
						label: "Contact Number:",
						value: userDetails.details.contactNumber,
					},
					{
						label: "User Type:",
						value: userDetails.details.userType,
					},
					{
						label: "Max Books:",
						value: userDetails.bookIssuePrivilege.maxBooks,
					},
					{
						label: "Issue Duration:",
						value: `${userDetails.bookIssuePrivilege.issueDuration} days`,
					},
					{ label: "Overdue Fine:", value: userDetails.overdueFine },
				].map((item, index) => (
					<Grid item xs={12} sm={6} lg={4} key={index}>
						<Box display="flex" alignItems="center">
							<Typography
								variant="subtitle1"
								fontWeight="medium"
								sx={{ width: 160 }}
							>
								{item.label}
							</Typography>
							<Typography variant="body1">
								{item.value}
							</Typography>
						</Box>
					</Grid>
				))}
			</Grid>
			<Button
				variant="contained"
				color="error"
				onClick={onRemoveUser}
				sx={{ mt: 2 }}
			>
				Remove User
			</Button>
		</StyledPaper>
	);
};

const IssueHistoryCard = ({ issues, title }) => {
	return (
		<StyledPaper>
			<Typography variant="h5" gutterBottom>
				{title}
			</Typography>
			{issues.length === 0 ? (
				<Typography>No current issues.</Typography>
			) : (
				<TableContainer component={Paper}>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell align="center">Book ID</TableCell>
								<TableCell align="center">Issue Date</TableCell>
								<TableCell align="center">
									Return Date
								</TableCell>
								<TableCell align="center">
									Days Overdue
								</TableCell>
								<TableCell align="center">Fine</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{issues.map((issue, index) => (
								<TableRow key={index}>
									<TableCell align="center">
										{issue.bookID.bookID}
									</TableCell>
									<TableCell align="center">
										{new Date(
											issue.issueDate
										).toLocaleDateString()}
									</TableCell>
									<TableCell align="center">
										{new Date(
											issue.dateofReturn ||
												issue.returnDate
										).toLocaleDateString()}
									</TableCell>
									<TableCell align="center">
										{issue.daysOverdue}
									</TableCell>
									<TableCell align="center">
										{issue.fine}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</StyledPaper>
	);
};

const AdminUserDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [userDetails, setUserDetails] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				const url = `${process.env.REACT_APP_API_BASE_URL}/admin/users/${id}`;
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
				setUserDetails(data.user);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};
		fetchUserDetails();
	}, [id]);

	const handleRemoveUser = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_BASE_URL}/admin/removeUser/${id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			if (!response.ok) {
				throw new Error("Failed to remove user");
			}
			navigate("/admin/users");
		} catch (error) {
			setError(error);
		}
	};

	if (error) {
		return <ErrorComponent error={error} />;
	}

	if (loading) {
		return <LoadingComponent />;
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<UserDetailsCard
				userDetails={userDetails}
				onRemoveUser={handleRemoveUser}
			/>
			<IssueHistoryCard
				issues={userDetails.currentIssues}
				title={"Current Issues"}
			/>
			<IssueHistoryCard
				issues={userDetails.issueHistory}
				title={"Past Issues"}
			/>
		</Container>
	);
};

export default AdminUserDetail;
