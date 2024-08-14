import React, { useState } from "react";
import { Container } from "@mui/material";
import BookSearchBox from "../../components/BookSearchBox";
import BookTable from "../../components/BookTable";

function Books() {
	const [query, setQuery] = useState({
		page: 1,
		searchType: "title",
		searchValue: "",
		subject: "",
	});
	const [formValues, setFormValues] = useState({
		searchType: "title",
		searchValue: "",
		subject: "",
	});
	const [loading, setLoading] = useState(true);

	return (
		<Container maxWidth="lg">
			<BookSearchBox
				query={query}
				setQuery={setQuery}
				loading={loading}
				setLoading={setLoading}
				formValues={formValues}
				setFormValues={setFormValues}
			/>
			<BookTable
				query={query}
				setQuery={setQuery}
				loading={loading}
				setLoading={setLoading}
				formValues={formValues}
				setFormValues={setFormValues}
			/>
		</Container>
	);
}

export default Books;
