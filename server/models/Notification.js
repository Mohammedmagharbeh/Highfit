const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null },
    targetRole: { type: String, default: null }, // e.g., "trainer_lead"
    title: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
