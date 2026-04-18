const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validateJWT = require("../middleware/validateJWT");

const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "manager")) {
    next();
  } else {
    return res.status(403).json({ message: "Access Denied" });
  }
};

router.get("/users", validateJWT, isAdmin, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type === "customer") filter.userType = "customer";
    else if (req.query.type === "staff") filter.userType = "staff";

    const users = await User.find(filter)
      .select("-password -otp -otpExpires")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "خطأ في السيرفر أثناء جلب البيانات" });
  }
});

router.post("/user/add", validateJWT, isAdmin, async (req, res) => {
  const { phone, role, username, password } = req.body;

  try {
    if (!username || !username.trim()) {
      return res.status(400).json({ message: "اسم المستخدم مطلوب" });
    }

    const existingUsername = await User.findOne({
      username: username.trim(),
    });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "اسم المستخدم هذا مستخدم بالفعل" });
    }

    const finalRole = role || "user";
    const isCustomerRole = finalRole === "user";

    if (isCustomerRole) {
      if (!phone || !phone.trim()) {
        return res.status(400).json({ message: "رقم الهاتف مطلوب للمشتركين" });
      }

      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "962" + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith("962")) {
        formattedPhone = "962" + formattedPhone;
      }

      const existingPhone = await User.findOne({ phone: formattedPhone });
      if (existingPhone) {
        return res.status(400).json({ message: "هذا الرقم مسجل مسبقاً" });
      }

      const newCustomer = new User({
        userType: "customer",
        username: username.trim(),
        phone: formattedPhone,
        role: "user",
      });

      await newCustomer.save();

      const response = newCustomer.toObject();
      delete response.otp;
      delete response.otpExpires;
      return res.status(201).json(response);
    }

    const staffRoles = ["admin", "chef", "trainer_lead", "coach"];
    if (!staffRoles.includes(finalRole)) {
      return res.status(400).json({ message: "دور غير صالح" });
    }

    if (!password || password.trim().length < 4) {
      return res
        .status(400)
        .json({
          message: "كلمة المرور مطلوبة ويجب أن تكون 4 أحرف على الأقل للموظفين",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    const newStaff = new User({
      userType: "staff",
      username: username.trim(),
      password: hashedPassword,
      role: finalRole,
    });

    await newStaff.save();

    const response = newStaff.toObject();
    delete response.password;
    return res.status(201).json(response);
  } catch (err) {
    console.error("ADD_USER_ERROR:", err);
    res
      .status(500)
      .json({ message: "فشل في إضافة المستخدم", error: err.message });
  }
});

router.put("/user/:id", validateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { role, isActive } = req.body;

  try {
    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "لا توجد بيانات للتحديث" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password -otp -otpExpires");

    if (!updatedUser) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "فشل في تحديث بيانات المستخدم" });
  }
});

router.delete("/user/:id", validateJWT, isAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }
    res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "خطأ أثناء الحذف" });
  }
});

router.put("/user/:id/password", validateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword || newPassword.length < 4) {
      return res
        .status(400)
        .json({ message: "كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل" });
    }

    const user = await User.findById(id);
    if (!user || user.userType !== "staff") {
      return res.status(404).json({ message: "الموظف غير موجود" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "خطأ في تغيير كلمة المرور" });
  }
});

module.exports = router;
