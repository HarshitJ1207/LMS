import React from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";

const AdminDashboard = () => {
	return (
		<React.Fragment>
			<Container maxWidth="md">
				{" "}
				{/* Center content with a maximum width */}
				<Typography
					variant="h4"
					component="h1"
					sx={{ fontWeight: 600, mt: 5 }}
				>
					Admin Dashboard
				</Typography>
				<Grid container spacing={2} sx={{ mt: 2 }}>
					{" "}
					{/* Grid layout for dashboard items */}
					<Grid item xs={12} sm={6}>
						<Paper elevation={3} sx={{ p: 2 }}>
							<Typography variant="body1">
								Total Books: 100
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Paper elevation={3} sx={{ p: 2 }}>
							<Typography variant="body1">
								Total Users: 100
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Paper elevation={3} sx={{ p: 2 }}>
							<Typography variant="body1">
								Total Books Issued: 100
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Paper elevation={3} sx={{ p: 2 }}>
							<Typography variant="body1">
								Total Books Returned: 100
							</Typography>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</React.Fragment>
	);
};

export default AdminDashboard;
