const express = require("express");
const bodyParse = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const jobRoutes = require("../server/routes/jobRoutes");
const applicationRoutes = require("../server/routes/applicationRoutes");
const userRoutes = require("../server/routes/userRoutes");

dotenv.config();
const app = express();
connectDB();

app.use(bodyParse.json());
app.use(cors());
app.use("/api/jobs", jobRoutes);
app.use("/api/apply", applicationRoutes);
app.use("/api", userRoutes);


module.exports = app;
