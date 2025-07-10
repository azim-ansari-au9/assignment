const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const prRoutes = require("./prRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use("/", prRoutes);

mongoose
	.connect(process.env.MONGO_URI, {
		// useNewUrlParser: true,
		// useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MongoDB connected");
		app.listen(3000, () => console.log("Server running on port 3000"));
	})
	.catch((err) => console.error(err));
