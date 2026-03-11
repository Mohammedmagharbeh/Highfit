const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user"); // تأكد من مسار الموديل
const { generateOTP, sendOTP } = require("../../utils/otp");
const validateJWT = require("../middleware/validateJWT");

// ==========================================
// 1. نظام المشتركين (Phone + OTP)
// ==========================================

// طلب رمز التحقق (للمشتركين)
routes.post("/login", async (req, res) => {
  const { phone } = req.body;
  try {
    let user = await User.findOne({ phone });
    if (!user) user = new User({ phone, role: "user" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTP(phone, otp);
    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// التحقق من الرمز وتوليد التوكن
routes.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "الرمز غير صحيح أو انتهى" });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // مثال داخل الـ Login
    const token = jwt.sign(
      { id: user._id, role: user.role }, // تأكد أن كلمة id موجودة هنا
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res
      .status(200)
      .json({
        token,
        user: { _id: user._id, phone: user.phone, role: user.role },
      });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ==========================================
// 2. نظام الموظفين والآدمن (Username + Password)
// ==========================================

// تسجيل دخول الطاقم (Staff Login)
routes.post("/staff-secure-login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    // التأكد من الوجود ومن أن الرتبة ليست "user"
    if (!user || user.role === "user") {
      return res.status(404).json({ msg: "الحساب غير موجود أو غير مصرح له" });
    }

    // مقارنة الباسوورد المشفر
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "كلمة المرور غير صحيحة" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );

    res.status(200).json({
      token,
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ msg: "خطأ في السيرفر" });
  }
});

// إضافة مستخدم جديد (عضو، موظف، أو آدمن)
routes.post("/admin/user/add", validateJWT, async (req, res) => {
  const { phone, role, username, password } = req.body;
  try {
    // التأكد من عدم التكرار
    const existing = await User.findOne({
      $or: [{ phone }, { username: username || "____" }],
    });
    if (existing)
      return res.status(400).json({ message: "البيانات مسجلة مسبقاً" });

    const userData = { phone, role: role || "user" };

    // إذا كان الحساب لموظف، نقوم بتشفير كلمة المرور
    if (role !== "user") {
      if (!username || !password)
        return res.status(400).json({ message: "الاسم والباسوورد مطلوبين" });
      userData.username = username;
      userData.password = await bcrypt.hash(password, 10);
    }

    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json({ message: "تمت إضافة الحساب بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// جلب كل المستخدمين
routes.get("/admin/users", validateJWT, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = routes;
