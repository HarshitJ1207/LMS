import React, { useEffect } from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import LoadingComponent from "../../components/extras/LoadingComponent";
import ErrorComponent from "../../components/extras/ErrorComponent";
import TimeComponent from "../../components/extras/TimeComponent";

const AdminDashboard = () => {
    const [dbStats, setDbStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [showAll, setShowAll] = React.useState(false);

    const activitiesToShow = (loading || !dbStats.recentActivities) ? [] : (showAll ? dbStats.recentActivities : dbStats.recentActivities.slice(-10));
    const activeUsers = (loading || !dbStats.recentActivities) ? [] : dbStats.activeUsers.map(user => user.user);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const url = `${process.env.REACT_APP_API_BASE_URL}/admin/dashboard`;
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
                setDbStats(data);
                console.log(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (error) {
        return <ErrorComponent error={error} />;
    }

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <Container maxWidth="md">
            {/* Center content with a maximum width */}
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mt: 5 }}>
                Welcome, Admin!
            </Typography>
            <TimeComponent />

            <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* Statistics */}
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="body1">Total Books: {dbStats.totalBooks}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="body1">Total Users: {dbStats.totalUsers}</Typography>
                    </Paper>
                </Grid>

                {/* Active Users */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Active Users
                        </Typography>
                        {activeUsers.length > 0 ? (
                            activeUsers.map((user, index) => (
                                <Typography
                                    variant="body1"
                                    key={index}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff',
                                        p: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    {user}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="body1">No active users at the moment.</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Recent Activities */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Recent Activities
                        </Typography>
                        {activitiesToShow.slice().reverse().map((activity, index) => (
                            <Typography
                                variant="body1"
                                key={index}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff',
                                    p: 1,
                                    borderRadius: 1,
                                }}
                            >
                                {activity}
                            </Typography>
                        ))}
                        {dbStats.recentActivities.length > 10 && (
                            <Button onClick={() => setShowAll(!showAll)} sx={{ mt: 2 }}>
                                {showAll ? 'Show Less' : 'Show More'}
                            </Button>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboard;
