import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/extras/LoadingComponent";
import ErrorComponent from "../../components/extras/ErrorComponent";
import {
	Container,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
} from "@mui/material";

// BookDetails Component
const BookDetails = ({ book, onRemoveBook }) => {
	return (
		<Paper elevation={3} sx={{ p: 3, mb: 3 }}>
			<Typography
				variant="h5"
				sx={{
					fontWeight: "bold",
					mb: 2,
					borderBottom: "1px solid #ccc",
					pb: 1,
				}}
			>
				Book Detail
			</Typography>
			{book && (
				<div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "1rem",
						}}
					>
						<Typography
							variant="body1"
							sx={{ fontWeight: "bold", width: "8rem" }}
						>
							Title:
						</Typography>
						<Typography variant="body1">
							{book.details.title}
						</Typography>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "1rem",
						}}
					>
						<Typography
							variant="body1"
							sx={{ fontWeight: "bold", width: "8rem" }}
						>
							Author:
						</Typography>
						<Typography variant="body1">
							{book.details.author}
						</Typography>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "1rem",
						}}
					>
						<Typography
							variant="body1"
							sx={{ fontWeight: "bold", width: "8rem" }}
						>
							Subject:
						</Typography>
						<Typography variant="body1">
							{book.details.subject}
						</Typography>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "1rem",
						}}
					>
						<Typography
							variant="body1"
							sx={{ fontWeight: "bold", width: "8rem" }}
						>
							ISBN:
						</Typography>
						<Typography variant="body1">
							{book.details.ISBN}
						</Typography>
					</div>
					<Button
						variant="contained"
						color="error"
						onClick={onRemoveBook}
						sx={{ mt: 2 }}
					>
						Remove Book
					</Button>
				</div>
			)}
		</Paper>
	);
};

// IssueHistory Component
const IssueHistory = ({ issueHistory }) => {
	return (
		<Paper elevation={3} sx={{ p: 3 }}>
			<Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
				Issue History
			</Typography>
			{issueHistory.length > 0 ? (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align="center">User</TableCell>
								<TableCell align="center">Issue Date</TableCell>
								<TableCell align="center">
									Return Date
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{issueHistory.map((issue, index) => (
								<TableRow
									key={index}
									sx={{
										backgroundColor:
											index % 2 === 0
												? "#f5f5f5"
												: "white",
									}}
								>
									<TableCell align="center">
										{issue.userID.details.username}
									</TableCell>
									<TableCell align="center">
										{new Date(
											issue.issueDate
										).toLocaleDateString()}
									</TableCell>
									<TableCell align="center">
										{issue.dateofReturn
											? new Date(
													issue.dateofReturn
											  ).toLocaleDateString()
											: "Not returned yet"}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<Typography variant="body1">No past issues</Typography>
			)}
		</Paper>
	);
};

// Main AdminBookDetail Component
const AdminBookDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [book, setBook] = useState(null);
	const [issueHistory, setIssueHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
				const token = localStorage.getItem("token");
                const url = `${process.env.REACT_APP_API_BASE_URL}/admin/books/${id}`;
                const response = await fetch(url, {
                    headers: {
						Authorization: `Bearer ${token}`,
					},
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        throw new Error("Network response was not ok");
                    });
                    throw new Error(errorData.error || "Network response was not ok");
                }
                const data = await response.json();
                setBook(data.book);
    
                const sortedIssueHistory = data.book.issueHistory.sort((b, a) => new Date(a.issueDate) - new Date(b.issueDate));
    
                if (JSON.stringify(sortedIssueHistory) !== JSON.stringify(issueHistory)) {
                    setIssueHistory(sortedIssueHistory);
                }
                console.log(sortedIssueHistory);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [id, issueHistory]);

	const handleRemoveBook = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${process.env.REACT_APP_API_BASE_URL}/admin/removeBook/${id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				const errorData = await response.json().catch(() => {
					throw new Error("Network response was not ok");
				});
				throw new Error(
					errorData.error || "Network response was not ok"
				);
			}
			navigate("/admin/books");
		} catch (error) {
			setError(error);
		}
	};

	if (loading) {
		return <LoadingComponent />;
	}

	if (error) {
		return <ErrorComponent error={error} />;
	}

	return (
		<React.Fragment>
			<Container maxWidth="md" sx={{ p: 4 }}>
				{book && (
					<BookDetails book={book} onRemoveBook={handleRemoveBook} />
				)}
				<IssueHistory issueHistory={issueHistory} />
			</Container>
		</React.Fragment>
	);
};

export default AdminBookDetail;
