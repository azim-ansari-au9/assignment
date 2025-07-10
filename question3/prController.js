const PR = require("./prModel");
const redisClient = require("./redis");
const fs = require("fs");
const path = require("path");

exports.getPRs = async (req, res) => {
	try {
		const userId = req.query.userId;

		// Check Redis Cache
		let permissions = await redisClient.get(userId);

		if (!permissions) {
			// Read from config file
			const configPath = path.join(__dirname, "./permissions.json");
			const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

			permissions = config.dataPermissions;

			// Cache it in Redis for 10 minutes
			await redisClient.set(userId, JSON.stringify(permissions), {
				EX: 600,
			});
		} else {
			permissions = JSON.parse(permissions);
		}

		const { allowedPlants, maxAmount } = permissions;

		// MongoDB filter
		const prs = await PR.find({
			plant: { $in: allowedPlants },
			amount: { $lte: maxAmount },
		});
		return res
			.status(200)
			.json({ success: true, message: "Data fetched.", data: prs });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};
