import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Button,
	Box,
} from "@mui/material";
import LoadingComponent from "../components/extras/LoadingComponent";
import ErrorComponent from "./extras/ErrorComponent";

function BookTable({ query, setQuery, loading, setLoading, setFormValues }) {
	const navigate = useNavigate();
	const [bookList, setBookList] = useState([]);
	const { isLoggedIn } = useContext(AuthContext);
	const [error, setError] = useState(null);
	const [maxPage, setMaxPage] = useState(1);

	useEffect(() => {
		setLoading(true);
		setError(null);
		setBookList([]);
		const fetchBooks = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_API_BASE_URL}/books?page=${query.page}&searchType=${query.searchType}&searchValue=${query.searchValue}&subject=${query.subject}`
				);
				if (!response.ok) {
					const errorData = await response.json().catch(() => {
						throw new Error("Network response was not ok");
					});
					throw new Error(
						errorData.error || "Network response was not ok"
					);
				}
				const data = await response.json();
				setBookList(data.bookList);
				setMaxPage(data.maxPage);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		fetchBooks();
	}, [query, setLoading]);

	const idClickHandler = (bookID) => {
		if (isLoggedIn === "Admin") {
			navigate(`/admin/book/${bookID}`);
		}
	};

	if (error) {
		return <ErrorComponent error={error} />;
	}

	if (loading) {
		return <LoadingComponent />;
	}

	if (bookList.length === 0) {
		return (
			<Paper elevation={3} sx={{ m: 3, p: 4 }}>
				<Typography variant="h4" align="center" color="text.secondary">
					No Books Found
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper elevation={3} sx={{ m: 3, p: 4 }}>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow sx = {{backgroundColor: '#f0f0f0'}}>
							<TableCell align="center">ID</TableCell>
							<TableCell align="center">Title</TableCell>
							<TableCell align="center">Author</TableCell>
							<TableCell align="center">Subject</TableCell>
							<TableCell align="center">Availability</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{bookList.map((book, index) => (
							<TableRow 
								key={book.bookID}
								sx={{ backgroundColor: index % 2 === 1 ? '#f0f0f0' : '#ffffff' }}
							>
								<TableCell
									align="center"
									onClick={() => idClickHandler(book.bookID)}
									sx={{
										cursor:
											isLoggedIn === "Admin"
												? "pointer"
												: "default",
									}}
								>
									{book.bookID}
								</TableCell>
								<TableCell align="center">
									{book.details.title}
								</TableCell>
								<TableCell
									align="center"
									onClick={() => {
										setQuery({
											searchType: "author",
											searchValue: book.details.author,
											subject: "",
											page: 1,
										});
										setFormValues({
											searchType: "author",
											searchValue: book.details.author,
											subject: "",
										});
									}}
									sx={{ cursor: "pointer" }}
								>
									{book.details.author}
								</TableCell>
								<TableCell
									align="center"
									onClick={() => {
										setQuery({
											searchType: "title",
											searchValue: "",
											subject: book.details.subject,
											page: 1,
										});
										setFormValues({
											searchType: "title",
											searchValue: "",
											subject: book.details.subject,
										});
										setLoading(true);
									}}
									sx={{ cursor: "pointer" }}
								>
									{book.details.subject}
								</TableCell>
								<TableCell align="center">
									{book.availability
										? "Available"
										: "Unavailable"}
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
}

export default BookTable;
