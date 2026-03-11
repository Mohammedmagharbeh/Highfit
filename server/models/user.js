const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, sparse: true, unique: true },
    phone: { type: String, sparse: true, unique: true }, // للمشتركين
    email: { type: String, sparse: true, unique: true }, // للموظفين
    password: { type: String }, // للموظفين والآدمن
    role: {
      type: String,
      enum: ["admin", "chef", "trainer_lead", "coach", "user"], // ضيف trainer_lead هون      default: "user"
    },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("users", userSchema);
