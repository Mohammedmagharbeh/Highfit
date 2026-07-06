const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateOTP, sendOTP } = require("../../utils/otp");
const validateJWT = require("../middleware/validateJWT");

routes.get("/me", validateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpires",
    );
    if (!user) return res.status(404).json({ msg: "المستخدم غير موجود" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "خطأ في السيرفر" });
  }
});

routes.post("/check-phone", async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (user) {
      return res.json({ exists: true, isActive: user.isActive });
    }
    return res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

routes.post("/login", async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(403).json({
        msg: "هذا الرقم غير مسجل. يرجى التواصل مع الإدارة.",
        msgEn: "Phone not registered. Please contact the admin.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        msg: "حسابك موقوف. يرجى التواصل مع الإدارة.",
        msgEn: "Your account is suspended. Please contact the admin.",
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    
    if (!user.userType) {
      user.userType = user.role === "user" ? "customer" : "staff";
    }
    
    await user.save();

    await sendOTP(phone, otp);
    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

routes.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ msg: "المستخدم غير موجود" });
    }

    if (!user.isActive) {
      return res.status(403).json({ msg: "الحساب موقوف" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "الرمز غير صحيح أو انتهت صلاحيته" });
    }

    user.otp = null;
    user.otpExpires = null;

    if (!user.userType) {
      user.userType = user.role === "user" ? "customer" : "staff";
    }

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
        userType: "customer",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        role: user.role,
        username: user.username,
        userType: "customer",
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

routes.post("/staff-secure-login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, userType: "staff" });

    if (!user) {
      return res
        .status(404)
        .json({ msg: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        msg: "حسابك موقوف. يرجى التواصل مع الإدارة.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
        userType: "staff",
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        userType: "staff",
      },
    });
  } catch (e) {
    res.status(500).json({ msg: "خطأ في السيرفر" });
  }
});

module.exports = routes;
