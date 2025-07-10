const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
	vendor: { 
        type: String 
    },
	poNumber: { 
        type: String 
    },
	amount: { 
        type: Number 
    },
	date: { 
        type: Date 
    },
});

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
