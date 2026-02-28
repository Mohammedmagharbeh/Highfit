const mongoose = require('mongoose');

const SubOrderSchema = new mongoose.Schema({
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  customerDetails: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    nationalId: { type: String, required: true }, // أضف هذا السطر
    age: { type: Number } // أضف هذا السطر إذا حابب تخزن العمر كمان
  },
  planDetails: {
    title: String,
    duration: String,
    price: Number
  },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubOrder', SubOrderSchema);