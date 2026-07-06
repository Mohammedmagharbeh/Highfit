const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["customer", "staff"],
      required: true,
      default: "customer",
    },
    username: { type: String, sparse: true, unique: true, required: true },
    role: {
      type: String,
      enum: ["admin", "chef", "trainer_lead", "coach", "user"],
      default: "user",
    },
    phone: { type: String, sparse: true, unique: true },
    isSubscribed: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
    password: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("users", userSchema);
