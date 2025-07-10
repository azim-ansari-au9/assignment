const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
	vendor: {
		type: String,
	},
	invoiceNumber: {
		type: String,
	},
	amountPaid: {
		type: Number,
	},
	date: {
		type: Date,
	},
});

module.exports = mongoose.model("Invoice", invoiceSchema);
