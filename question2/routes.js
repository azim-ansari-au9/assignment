const express = require("express");
const router = express.Router();

const {
	getReport,
	addPurchaseData,
	addInvoiceData,
	aggregatePurchaseAmount,
	aggregateInvoicePaid,
} = require("./controller");

// add purchase data
router.post("/addPurchase", addPurchaseData);
router.post("/addInvoice", addInvoiceData);
router.get("/aggregatePurchaseAmount", aggregatePurchaseAmount);
router.get("/aggregateInvoicePaid", aggregateInvoicePaid);
// GET /api/report
router.get("/report", getReport);

module.exports = router;
