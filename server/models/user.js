const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, sparse: true, unique: true },
    username: { type: String, sparse: true, unique: true },
    role: { type: String, enum: ["user", "employee", "admin"], default: "user" },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);