const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

connectDB();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const fitnessPlanRoutes = require("./routes/fitnessPlanRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const chefRoutes = require("./routes/chefRoutes");
const mealRoutes = require("./routes/mealRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const locationRoutes = require("./routes/locationsRoutes");
const subRoutes = require("./routes/subRoutes");
const SubOrderRoutes = require("./routes/subOrderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userProgramRoutes = require("./routes/userProgramRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/jobs", jobRoutes);
app.use("/api/apply", applicationRoutes);
app.use("/api", userRoutes);
app.use("/api/plans", fitnessPlanRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/chef", chefRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/subscriptions", subRoutes);
app.use("/api/sub-orders", SubOrderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user-programs", userProgramRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);

io.on("connection", (socket) => {});

module.exports = { app, server };
