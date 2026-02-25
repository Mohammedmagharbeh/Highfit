
// // const mongoose = require('mongoose');

// // const orderSchema = new mongoose.Schema({
// //   user: { 
// //     type: mongoose.Schema.Types.ObjectId, 
// //     ref: 'User', 
// //     required: false 
// //   },
// //   userName: { type: String, required: true },
// //   userPhone: { type: String, required: true },
// //   mealName: { type: String, required: true },
  
// //   quantity: { 
// //     type: Number, 
// //     default: 1, 
// //     required: true 
// //   },
// //   notes: { 
// //     type: String, 
// //     default: "" 
// //   },
  
// //   status: { 
// //     type: String, 
// //     default: 'Pending' 
// //   }
// // }, { timestamps: true });

// // module.exports = mongoose.model('Order', orderSchema);  

// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   // معلومات المستخدم الأساسية
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: false 
//   },
//   userName: { type: String, required: true },
//   userPhone: { type: String, required: true },
  
//   // تفاصيل الوجبة
//   mealName: { type: String, required: true },
//   quantity: { 
//     type: Number, 
//     default: 1, 
//     required: true 
//   },
//   notes: { 
//     type: String, 
//     default: "" 
//   },

//   // --- الإضافات الجديدة لتطابق مشروع المطعم الاحترافي ---

//   // رقم الطلب التسلسلي (ID مميز للزبون)
//   sequenceNumber: { 
//     type: Number, 
//     unique: true 
//   },

//   // نوع الطلب (توصيل أو استلام)
//   orderType: {
//     type: String,
//     enum: ["delivery", "pickup"],
//     required: true,
//     default: "pickup" // القيمة الافتراضية
//   },

//   // تفاصيل العنوان (تظهر فقط إذا كان النوع توصيل)
//   addressDetails: {
//     area: { type: String },      // المنطقة
//     street: { type: String },    // الشارع
//     apartment: { type: String }, // رقم الشقة أو البيت
//   },

//   // حالة الطلب
//   status: { 
//     type: String, 
//     enum: ['Pending', 'Accepted', 'Done', 'Cancelled'],
//     default: 'Pending' 
//   }
// }, { timestamps: true });

// // --- المنطق الخاص بتوليد رقم الطلب (Sequence Number) يبدأ من 3140 ---
// orderSchema.pre("save", async function (next) {
//   const doc = this;

//   // يتم التوليد فقط عند إنشاء طلب جديد
//   if (doc.isNew) {
//     try {
//       // البحث عن آخر طلب مسجل للحصول على أكبر رقم
//       const lastOrder = await mongoose
//         .model("Order")
//         .findOne({}, { sequenceNumber: 1 })
//         .sort({ sequenceNumber: -1 });

//       if (lastOrder && lastOrder.sequenceNumber) {
//         // إذا وجدنا طلب سابق، نزيد الرقم بمقدار 1
//         doc.sequenceNumber = lastOrder.sequenceNumber + 1;
//       } else {
//         // إذا كان هذا أول طلب في النظام، نبدأ من 3140
//         doc.sequenceNumber = 3140;
//       }
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// module.exports = mongoose.model('Order', orderSchema);


// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: false 
//   },
//   userName: { type: String, required: true },
//   userPhone: { type: String, required: true },
  
//   // المصفوفة الجديدة لدعم نظام السلة
//   items: [
//     {
//       mealName: { type: String, required: true },
//       quantity: { type: Number, required: true, default: 1 },
//       price: { type: Number },
//       notes: { type: String, default: "" }
//     }
//   ],

//   totalAmount: { type: Number, required: true },

//   sequenceNumber: { 
//     type: Number, 
//     unique: true 
//   },

//   orderType: {
//     type: String,
//     enum: ["delivery", "pickup"],
//     required: true,
//     default: "pickup"
//   },

//   addressDetails: {
//     area: { type: String },
//     street: { type: String },
//     apartment: { type: String },
//   },

//   status: { 
//     type: String, 
//     enum: ['Pending', 'Accepted', 'Done', 'Cancelled'],
//     default: 'Pending' 
//   },
  
//   notes: { type: String, default: "" }

// }, { timestamps: true });

// // --- تعديل منطق الـ Sequence Number (إزالة next) ---
// orderSchema.pre("save", async function () { 
//   const doc = this;

//   if (doc.isNew) {
//     try {
//       // البحث عن آخر رقم تسلسلي
//       const lastOrder = await mongoose
//         .model("Order")
//         .findOne({}, { sequenceNumber: 1 })
//         .sort({ sequenceNumber: -1 });

//       if (lastOrder && lastOrder.sequenceNumber) {
//         doc.sequenceNumber = lastOrder.sequenceNumber + 1;
//       } else {
//         // البدء من الرقم المطلوب 3140
//         doc.sequenceNumber = 3140;
//       }
//       // لاحظ: لا نحتاج لمناداة next() هنا لأن الدالة async
//     } catch (error) {
//       console.error("Error in sequenceNumber hook:", error);
//       throw error; // رمي الخطأ يوقف عملية الحفظ بشكل صحيح
//     }
//   }
// });

// module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  
  // المصفوفة المحدثة لدعم الصور
  items: [
    {
      mealName: { type: String, required: true },
      mealImage: { type: String, default: "" }, // أضفنا هذا الحقل لحفظ رابط الصورة
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number },
      notes: { type: String, default: "" }
    }
  ],

  totalAmount: { type: Number, required: true },
  deliveryCost: { type: Number, default: 0 }, // أضفنا هذا الحقل لحفظ سعر التوصيل منفصل

  sequenceNumber: { 
    type: Number, 
    unique: true 
  },

  orderType: {
    type: String,
    enum: ["delivery", "pickup"],
    required: true,
    default: "pickup"
  },

  // أضفنا حقل address صريح لاستقبال النص المدمج من الـ Checkout
  address: { type: String }, 

  // أبقينا على addressDetails للمستقبل إذا أردت تفصيلهم
  addressDetails: {
    area: { type: String },
    street: { type: String },
    apartment: { type: String },
  },

  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Done', 'Cancelled'],
    default: 'Pending' 
  },
  
  notes: { type: String, default: "" }

}, { timestamps: true });

// --- منطق الـ Sequence Number ---
orderSchema.pre("save", async function () { 
  const doc = this;
  if (doc.isNew) {
    try {
      const lastOrder = await mongoose
        .model("Order")
        .findOne({}, { sequenceNumber: 1 })
        .sort({ sequenceNumber: -1 });

      if (lastOrder && lastOrder.sequenceNumber) {
        doc.sequenceNumber = lastOrder.sequenceNumber + 1;
      } else {
        doc.sequenceNumber = 3140;
      }
    } catch (error) {
      console.error("Error in sequenceNumber hook:", error);
      throw error;
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);