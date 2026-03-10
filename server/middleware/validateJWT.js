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

const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const validateJWT = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("authorization");

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Authorization header missing" });
    }

    const token = authorizationHeader.split(" ")[1];

    // فك التشفير ومزامنة البيانات
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // البحث عن اليوزر لجلب الـ Role الجديد "admin"
    const user = await userModel.findOne({ phone: payload.phone });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    req.user = user; // هيك req.user.role صار admin مؤكد
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = validateJWT;