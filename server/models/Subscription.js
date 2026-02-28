// const mongoose = require('mongoose');

// const SubscriptionSchema = new mongoose.Schema({
//   title: { type: String, required: true }, // مثال: Full Day أو Morning
//   type: { type: String, required: true },  // للاستخدام البرمجي
//   description: { type: String },
//   plans: [{
//     duration: { type: String, required: true }, // أسبوع، شهر، سنة
//     price: { type: Number, required: true },
//     durationEn: String
//   }]
// }, { timestamps: true });

// module.exports = mongoose.model('Subscription', SubscriptionSchema);

const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  title: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  description: {
    ar: String,
    en: String
  },
  plans: [{
    duration: {
      ar: { type: String, required: true },
      en: { type: String, required: true }
    },
    price: { type: Number, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);