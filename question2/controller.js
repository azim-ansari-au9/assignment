const PurchaseOrder = require("./purchaseModel");
const Invoice = require("./invoiceModel");
const purchaseModel = require("./purchaseModel");
const invoiceModel = require("./invoiceModel");

// get report controller

module.exports = {
    addPurchaseData: async(req, res) => {
        try {
            let purchaseData = await purchaseModel.create(req.body)
            return res.status(201).json({status:"Success", message : "Purchase data created."})
        } catch (error) {
            console.error(err);
			return res.status(500).send("Server error");
        }
    },
    addInvoiceData: async(req, res) => {
        try {
            let invoiceData = await invoiceModel.create(req.body)
            return res.status(201).json({status:"Success", message : "Invoice data created."})
        } catch (error) {
            console.error(err);
			return res.status(500).send("Server error");
        }
    },
	aggregatePurchaseAmount: async (req, res) => {
		try {
            const result = await PurchaseOrder.aggregate([
				{
					$group: {
						_id: "$vendor",
						totalPOAmount: { $sum: "$amount" },
					},
				},
			]);
            return res.status(200).json({status:"Success", data : result})
		} catch (error) {
			console.error(err);
			return res.status(500).send("Server error");
		}
	},
	aggregateInvoicePaid: async (req, res) => {
		try {
            const result = await Invoice.aggregate([
				{
					$group: {
						_id: "$vendor",
						totalInvoiceAmount: { $sum: "$amountPaid" },
					},
				},
			]);
            return res.status(200).json({status:"Success", data : result})
		} catch (error) {
			console.error(err);
			return res.status(500).send("Server error");
		}
	},
	getReport: async (req, res) => {
		try {
			const poAgg = await PurchaseOrder.aggregate([
				{
					$group: {
						_id: "$vendor",
						totalPOAmount: { $sum: "$amount" },
					},
				},
			]);

			const invoiceAgg = await Invoice.aggregate([
				{
					$group: {
						_id: "$vendor",
						totalInvoiceAmount: { $sum: "$amountPaid" },
					},
				},
			]);

			// Merge both aggregations
			const reportMap = {};

			poAgg.forEach((po) => {
				reportMap[po._id] = {
					vendor: po._id,
					totalPOAmount: po.totalPOAmount,
					totalInvoiceAmount: 0,
				};
			});

			invoiceAgg.forEach((inv) => {
				if (reportMap[inv._id]) {
					reportMap[inv._id].totalInvoiceAmount = inv.totalInvoiceAmount;
				} else {
					reportMap[inv._id] = {
						vendor: inv._id,
						totalPOAmount: 0,
						totalInvoiceAmount: inv.totalInvoiceAmount,
					};
				}
			});

			const report = Object.values(reportMap);

			res.json(report);
		} catch (err) {
			console.error(err);
			return res.status(500).send("Server error");
		}
	},
};
