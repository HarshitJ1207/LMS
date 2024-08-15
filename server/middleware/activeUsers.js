const dbs = require("../models/databaseStats");
const activeUserCache = new Map();

exports.logUserActivity = async (req, res, next) => {
	if (!req.user) {
		return next();
	}

	const username = req.user.username;
	const now = Date.now();

	// Check if the user activity was logged recently (past 2 minutes)
	if (
		activeUserCache.has(username) &&
		now - activeUserCache.get(username) < 120000
	) {
		return next();
	}
	activeUserCache.set(username, now);

	try {
		const stats = await dbs.findOne({});
		if (!stats) {
			return next();
		}

		stats.activeUsers = stats.activeUsers.filter(({ user, lastActive }) => {
			const isSameUser = user === username;
			const isActive = now - lastActive <= 300000; // 5 minute threshold
			return isActive && !isSameUser;
		});

		stats.activeUsers.push({ user: username, lastActive: now });

		try {
			await stats.save();
			// Update the cache with the new filtered active users array
			activeUserCache.clear();
			stats.activeUsers.forEach(({ user, lastActive }) => {
				activeUserCache.set(user, lastActive);
			});
		} catch (error) {
			if (error.name === "VersionError") {
				console.error(
					"VersionError while saving user activity:",
					error
				);
			} else {
				throw error; // Rethrow other errors
			}
		}
	} catch (error) {
		console.error("Error logging user activity:", error);
	} finally {
		next(); // Ensure the request passes through to the controller
	}
};
