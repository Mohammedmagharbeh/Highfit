const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  title: { type: String, required: true }, // مثال: Full Day أو Morning
  type: { type: String, required: true },  // للاستخدام البرمجي
  description: { type: String },
  plans: [{
    duration: { type: String, required: true }, // أسبوع، شهر، سنة
    price: { type: Number, required: true },
    durationEn: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);