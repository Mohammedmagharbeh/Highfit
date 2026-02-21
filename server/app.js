// const express = require("express");
// const bodyParse = require("body-parser");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const jobRoutes = require("../server/routes/jobRoutes");
// const applicationRoutes = require("../server/routes/applicationRoutes");
// const userRoutes = require("../server/routes/userRoutes");
// const fitnessPlanRoutes = require("./routes/fitnessPlanRoutes");
// const nutritionRoutes = require("./routes/nutritionRoutes");
// const chefRoutes = require("./routes/chefRoutes");
// const mealRoutes = require("./routes/mealRoutes");
// const orderRoutes = require("./routes/orderRoutes");

// dotenv.config();
// const app = express();
// connectDB();

// app.use(bodyParse.json());
// app.use(cors());
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// app.use("/api/jobs", jobRoutes);
// app.use("/api/apply", applicationRoutes);
// app.use("/api", userRoutes);
// app.use("/api/plans", fitnessPlanRoutes);
// app.use("/api/nutrition", nutritionRoutes);

// app.use('/api/chef', require('./routes/chefRoutes'));   // راوتس الشيف
// app.use('/api/meals', require('./routes/mealRoutes')); // راوتس الوجبات
// app.use('/api/orders', require('./routes/orderRoutes'));

// module.exports = app;

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); // استخدمنا واحد فقط للوضوح
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// تحميل الإعدادات
dotenv.config();
const app = express();

// الاتصال بقاعدة البيانات
connectDB();

// 1. إعدادات الـ CORS (يجب أن تكون في البداية)
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const jobRoutes = require("../server/routes/jobRoutes");
const applicationRoutes = require("../server/routes/applicationRoutes");
const userRoutes = require("../server/routes/userRoutes");
const fitnessPlanRoutes = require("./routes/fitnessPlanRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");

app.use("/api/jobs", jobRoutes);
app.use("/api/apply", applicationRoutes);
app.use("/api", userRoutes);
app.use("/api/plans", fitnessPlanRoutes);
app.use("/api/nutrition", nutritionRoutes);

app.use('/api/chef', require('./routes/chefRoutes')); 
app.use('/api/meals', require('./routes/mealRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes'));

module.exports = app;
