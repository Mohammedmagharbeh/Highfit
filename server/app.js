const express = require("express");
const bodyParse = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const jobRoutes = require("../server/routes/jobRoutes");
const applicationRoutes = require("../server/routes/applicationRoutes");
const userRoutes = require("../server/routes/userRoutes");
const fitnessPlanRoutes = require("./routes/fitnessPlanRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");

dotenv.config();
const app = express();
connectDB();

app.use(bodyParse.json());
app.use(cors());
app.use("/api/jobs", jobRoutes);
app.use("/api/apply", applicationRoutes);
app.use("/api", userRoutes);
app.use("/api/plans", fitnessPlanRoutes);
app.use("/api/nutrition", nutritionRoutes);

module.exports = app;
