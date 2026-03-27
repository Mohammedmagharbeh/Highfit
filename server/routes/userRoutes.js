const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateOTP, sendOTP } = require("../../utils/otp");
const validateJWT = require("../middleware/validateJWT");

// جلب بيانات المستخدم الحالي
routes.get("/me", validateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp");
    if (!user) return res.status(404).json({ msg: "المستخدم غير موجود" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "خطأ في السيرفر" });
  }
});

// طلب OTP مع تخزين/تحديث الاسم
routes.post("/login", async (req, res) => {
  const { phone, username } = req.body;
  try {
    let user = await User.findOne({ phone });

    if (!user) {
      // مستخدم جديد: نخزن الاسم والرقم
      user = new User({ phone, username: username || "Guest", role: "user" });
    } else if (username) {
      // مستخدم قديم: نحدث الاسم في حال قام بتغييره
      user.username = username;
    }

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

// التحقق من OTP وإرجاع بيانات المستخدم (بما فيها الاسم)
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

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        role: user.role,
        username: user.username, // إرجاع الاسم للفرونت اند
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// باقي المسارات (staff login, admin add user, etc.) تبقى كما هي...
routes.post("/staff-secure-login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.role === "user")
      return res.status(404).json({ msg: "غير مصرح له" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "كلمة مرور خاطئة" });

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );
    res.json({
      token,
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ msg: "خطأ سيرفر" });
  }
});

module.exports = routes;
