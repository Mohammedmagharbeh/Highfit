// const jwt = require("jsonwebtoken");
// const userModel = require("../models/user");

// const validateJWT = async (req, res, next) => {
//   const authorizationHeader = req.get("authorization");

//   if (!authorizationHeader) {
//     res.status(403).send("Authorization header was not provided");
//     return;
//   }

//   const token = authorizationHeader.split(" ")[1];

//   if (!token) {
//     res.status(403).send("Bearer token not found");
//     return;
//   }

//   jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
//     if (err || !payload) {
//       res.status(403).send("Invalid token");
//       return;
//     }

//     const user = await userModel.findOne({ phone: payload.phone });
//     if (!user) {
//       res.status(403).send("User not found");
//       return;
//     }

//     req.user = user;
//     next();
//   });
// };

// module.exports = validateJWT;

// const jwt = require("jsonwebtoken");
// const userModel = require("../models/user");

// const validateJWT = async (req, res, next) => {
//   try {
//     const authorizationHeader = req.get("authorization");

//     if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
//       return res.status(403).json({ message: "Authorization header missing" });
//     }

//     const token = authorizationHeader.split(" ")[1];

//     // فك التشفير ومزامنة البيانات
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
    
//     // البحث عن اليوزر لجلب الـ Role الجديد "admin"
//     const user = await userModel.findOne({ phone: payload.phone });

//     if (!user) {
//       return res.status(403).json({ message: "User not found" });
//     }

//     req.user = user; // هيك req.user.role صار admin مؤكد
//     next();
//   } catch (err) {
//     console.error("JWT Auth Error:", err.message);
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = validateJWT;


// const jwt = require("jsonwebtoken");
// const userModel = require("../models/user");

// const validateJWT = async (req, res, next) => {
//   try {
//     const authorizationHeader = req.get("authorization");
//     if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
//       return res.status(403).json({ message: "Authorization header missing" });
//     }

//     const token = authorizationHeader.split(" ")[1];
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
    
//     // --- تعديل ذكي هنا ---
//     // إذا كان الـ id هو 123 (الآدمن المؤقت)، نتخطى البحث في القاعدة
//     if (payload.id === "123") {
//       req.user = { _id: "123", role: "admin", username: "mohammad_admin" };
//       return next();
//     }

//     // للمستخدمين الحقيقيين، نبحث بالـ ID
//     const user = await userModel.findById(payload.id);
//     if (!user) {
//       return res.status(403).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("JWT Auth Error:", err.message);
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = validateJWT;


const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const validateJWT = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Authorization header missing" });
    }

    const token = authorizationHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // تأكد إن الـ payload فيها id
    if (!payload.id) {
       return res.status(403).json({ message: "Token payload missing user ID" });
    }

    // الحالة الخاصة بالآدمن (123)
    if (payload.id === "123") {
      // بنحط المعرف بالصيغتين عشان ما يضرب أي Controller مستقبلاً
      req.user = { id: "123", _id: "123", role: "admin", username: "mohammad_admin" };
      return next();
    }

    // للمستخدمين الحقيقيين
    const user = await userModel.findById(payload.id);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    // إضافة الـ id العادي والـ user كامل للطلب
    req.user = user;
    req.user.id = user._id.toString(); // ضمان وجود id بدون أندرسكور
    
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = validateJWT;