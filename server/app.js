

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser"); // استخدمنا واحد فقط للوضوح
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");

// // تحميل الإعدادات
// dotenv.config();
// const app = express();

// // الاتصال بقاعدة البيانات
// connectDB();

// // 1. إعدادات الـ CORS (يجب أن تكون في البداية)
// app.use(cors());

// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// const jobRoutes = require("../server/routes/jobRoutes");
// const applicationRoutes = require("../server/routes/applicationRoutes");
// const userRoutes = require("../server/routes/userRoutes");
// const fitnessPlanRoutes = require("./routes/fitnessPlanRoutes");
// const nutritionRoutes = require("./routes/nutritionRoutes");

// app.use("/api/jobs", jobRoutes);
// app.use("/api/apply", applicationRoutes);
// app.use("/api", userRoutes);
// app.use("/api/plans", fitnessPlanRoutes);
// app.use("/api/nutrition", nutritionRoutes);

// app.use('/api/chef', require('./routes/chefRoutes')); 
// app.use('/api/meals', require('./routes/mealRoutes')); 
// app.use('/api/orders', require('./routes/orderRoutes'));

// module.exports = app;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();

// 1. إنشاء السيرفر
const server = http.createServer(app);

// 2. إعداد الـ Socket.io مع السماح لكل الاتصالات (CORS)
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// 3. تخزين io في app لاستخدامه في الـ Controllers (مهم جداً قبل الـ Routes)
app.set("io", io);

// الاتصال بقاعدة البيانات
connectDB();

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// استيراد الروابط
const jobRoutes = require("../server/routes/jobRoutes");
const applicationRoutes = require("../server/routes/applicationRoutes");
const userRoutes = require("../server/routes/userRoutes");
const fitnessPlanRoutes = require("./routes/fitnessPlanRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const chefRoutes = require('./routes/chefRoutes');
const mealRoutes = require('./routes/mealRoutes');
const orderRoutes = require('./routes/orderRoutes');

// تسجيل الروابط
app.use("/api/jobs", jobRoutes);
app.use("/api/apply", applicationRoutes);
app.use("/api", userRoutes);
app.use("/api/plans", fitnessPlanRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use('/api/chef', chefRoutes); 
app.use('/api/meals', mealRoutes); 
app.use('/api/orders', orderRoutes);

// مراقبة اتصال الشيف
io.on("connection", (socket) => {
});

// تصدير الكائنين (تأكد من تعديل index.js لاستقبالهم)
module.exports = { app, server };