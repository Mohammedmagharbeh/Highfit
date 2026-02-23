const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" }, // لاحظ هنا ref: Meal
      quantity: { type: Number, default: 1 },
      notes: { type: String, default: "" }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);