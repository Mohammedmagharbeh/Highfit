const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, sparse: true, unique: true },
    phone: { type: String, sparse: true, unique: true }, // للمشتركين (Users)
    email: { type: String, sparse: true, unique: true }, // للموظفين (Staff)
    password: { type: String }, // للموظفين والآدمن
    role: {
      type: String,
      enum: ["admin", "chef", "trainer_lead", "coach", "user"],
      default: "user",
    },
    // --- الحقل المضاف للتحكم في الظهور للكوتش ---
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    // ---------------------------------------
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("users", userSchema);
