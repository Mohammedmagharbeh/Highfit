// // const mongoose = require('mongoose');

// // const SubOrderSchema = new mongoose.Schema({
// //   subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
// //   customerDetails: {
// //     fullName: { type: String, required: true },
// //     phone: { type: String, required: true },
// //     nationalId: { type: String, required: true }, // أضف هذا السطر
// //     age: { type: Number } // أضف هذا السطر إذا حابب تخزن العمر كمان
// //   },
// //   planDetails: {
// //     title: String,
// //     duration: String,
// //     price: Number
// //   },
// //   status: { type: String, default: 'pending' },
// //   createdAt: { type: Date, default: Date.now }
// // });

// // module.exports = mongoose.model('SubOrder', SubOrderSchema);

// const mongoose = require('mongoose');

// const SubOrderSchema = new mongoose.Schema({
//   subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
//   customerDetails: {
//     fullName: { type: String, required: true },
//     phone: { type: String, required: true },
//     nationalId: { type: String, required: true },
//     age: { type: Number }
//   },
//   planDetails: {
//     // تم تعديله ليقبل كائن (Object) للعنوان والمدة لدعم تعدد اللغات
//     title: { 
//       ar: String, 
//       en: String 
//     },
//     duration: { 
//       ar: String, 
//       en: String 
//     },
//     price: Number
//   },
//   status: { type: String, default: 'pending' },
//   // هذا هو الحقل الأهم الذي أضفناه الآن
//   expiryDate: { type: Date }, 
//   createdAt: { type: Date, default: Date.now }
// }, { timestamps: true }); // إضافة timestamps لتتبع التحديثات تلقائياً

// module.exports = mongoose.model('SubOrder', SubOrderSchema);

const mongoose = require('mongoose');

const SubOrderSchema = new mongoose.Schema({
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  customerDetails: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    nationalId: { type: String, required: true }, // سيتم تخزين تاريخ الميلاد هنا YYYY-MM-DD
    age: { type: Number, required: true }
  },
  planDetails: {
    title: { 
      ar: { type: String, required: true }, 
      en: { type: String, required: true } 
    },
    duration: { 
      ar: { type: String, required: true }, 
      en: { type: String, required: true } 
    },
    price: { type: Number, required: true }
  },
  status: { type: String, default: 'pending' },
  expiryDate: { type: Date }, 
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SubOrder', SubOrderSchema);