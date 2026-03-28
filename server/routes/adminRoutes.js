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

// router.post("/user/add", validateJWT, isAdmin, async (req, res) => {
//   const { phone, role, username, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ phone });
//     if (existingUser) {
//       return res.status(400).json({ message: "هذا الرقم مسجل مسبقاً" });
//     }

//     const newUser = new User({
//       username,
//       phone,
//       password,
//       role: role || "user",
//     });

//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(500).json({ message: "فشل في إضافة المستخدم" });
//   }
// });

// تحديث رول المستخدم (من يوزر لموظف أو أدمن)

router.post("/user/add", validateJWT, isAdmin, async (req, res) => {
  const { phone, role, username, password } = req.body;

  try {
    // 1. التحقق من الرقم فقط إذا كان الحساب "user" أو إذا تم إرسال رقم هاتف
    if (phone) {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "هذا الرقم مسجل مسبقاً" });
      }
    }

    // 2. التحقق من اسم المستخدم (Username) لأنه ضروري للموظفين
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "اسم المستخدم هذا مستخدم بالفعل" });
      }
    }

    // 3. إنشاء المستخدم الجديد
    const newUser = new User({
      username,
      // إذا لم يوجد هاتف (مثل حالة الأدمن) نضع undefined ليعمل الـ sparse في المودل
      phone: (phone && phone.trim() !== "") ? phone : undefined, 
      password,
      role: role || "user",
    });

    await newUser.save();
    
    // إرجاع البيانات بدون الباسوورد للأمان
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (err) {
    console.error("ADD_USER_ERROR:", err); // عشان تشوف الخطأ الحقيقي بالـ Terminal
    res.status(500).json({ message: "فشل في إضافة المستخدم", error: err.message });
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
