const express = require("express");
const router = express.Router();
const User = require("../models/user"); // تأكد من المسار الصحيح لمودل اليوزر
const validateJWT = require("../middleware/validateJWT");

const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "manager")) {
    next();
  } else {
    return res.status(403).json({ message: "Access Denied" });
  }
};
// --- المسارات (Routes) ---

// جلب جميع المستخدمين
router.get("/users", validateJWT, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "خطأ في السيرفر أثناء جلب البيانات" });
  }
});

router.post("/user/add", validateJWT, isAdmin, async (req, res) => {
  const { phone, role, username, password } = req.body;

  try {
    // 1. التحقق من الرقم
    if (phone) {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "هذا الرقم مسجل مسبقاً" });
      }
    }

    // 2. التحقق من اسم المستخدم
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res
          .status(400)
          .json({ message: "اسم المستخدم هذا مستخدم بالفعل" });
      }
    }

    // --- الـتـعـديـل هـنـا: تـشـفـيـر الـبـاسـوورد قـبـل الـحـفـظ ---
    const bcrypt = require("bcrypt"); // استدعاء المكتبة
    const salt = await bcrypt.genSalt(10); // توليد الملح
    const hashedPassword = await bcrypt.hash(password, salt); // التشفير الحقيقي
    // --------------------------------------------------------

    // 3. إنشاء المستخدم الجديد (لاحظ استخدمنا hashedPassword)
    const newUser = new User({
      username,
      phone: phone && phone.trim() !== "" ? phone : undefined,
      password: hashedPassword, // *** هون السر، خزن المشفرة مش العادية ***
      role: role || "user",
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    console.error("ADD_USER_ERROR:", err);
    res
      .status(500)
      .json({ message: "فشل في إضافة المستخدم", error: err.message });
  }
});

router.put("/user/:id", validateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "فشل في تحديث الصلاحية" });
  }
});

// حذف مستخدم
router.delete("/user/:id", validateJWT, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "خطأ أثناء الحذف" });
  }
});

module.exports = router;
