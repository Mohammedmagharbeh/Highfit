const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTP } = require("../../utils/otp");
const User = require("../models/user");
const validateJWT = require("../middleware/validateJWT"); // تأكد من المسار الصحيح للميدل وير

// 1. إرسال الرمز (Login)
routes.post("/login", async (req, res) => {
  const { phone } = req.body;
  try {
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
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

// 2. التحقق من الرمز
routes.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone });
    
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "الرمز غير صحيح أو انتهت صلاحيته" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, phone: user.phone }, // أضفت الـ phone للتوكن عشان الميدل وير يلاقيه
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.status(200).json({ token, user: { _id: user._id, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 3. مسار جلب بياناتي الشخصية (ضروري جداً لـ UserContext)
routes.get("/me", validateJWT, async (req, res) => {
  try {
    // الميدل وير validateJWT قام بالفعل بالبحث عن المستخدم ووضعه في req.user
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching user data" });
  }
});

module.exports = routes;