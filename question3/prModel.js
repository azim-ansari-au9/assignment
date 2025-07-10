const mongoose = require("mongoose");

const prSchema = new mongoose.Schema({
	prNumber: { type: String },
	plant: { type: String },
	amount: { type: Number },
	description: { type: String },
});

module.exports = mongoose.model("PR", prSchema);
