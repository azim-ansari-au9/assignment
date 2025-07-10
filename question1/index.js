const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

// Load rules from JSON
const rules = JSON.parse(fs.readFileSync("rules.json", "utf-8"));

// Helper to calculate deliveryDays
function calculateDeliveryDays(deliveryDate) {
	const today = new Date();
	const delivery = new Date(deliveryDate);
	const diffTime = delivery - today;
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// POST /processPR
app.post("/processPR", (req, res) => {
	let pr = req.body;
	// Add derived property(delivery date)
	pr.deliveryDays = calculateDeliveryDays(pr.deliveryDate);
	for (const rule of rules.approvalRules) {
		try {
			const isTrue = eval(rule.condition);
			if (isTrue) {
				if (rule.action === "autoApprove") {
					pr.status = rule.setStatus;
				} else if (rule.action === "setUrgency") {
					pr.urgency = rule.urgency;
				}
			}
		} catch (err) {
			console.error(
				`Error evaluating rule condition: ${rule.condition}`,
				err.message
			);
		}
	}

	return res.status(200).json({ status: "Successful", processedPR: pr });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
