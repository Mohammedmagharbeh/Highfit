

// const Order = require('../models/Order');
// const { sendOrderConfirm } = require('../../utils/otp'); // استيراد فنكشن الإرسال الخاص بـ HIGH FIT

// // 1. إنشاء طلب جديد (للمستخدم المسجل)
// exports.placeOrder = async (req, res) => {
//     try {
//         const { mealName, userName, userPhone, quantity, notes } = req.body;
        
//         if (!mealName) {
//             return res.status(400).json({ message: "يرجى اختيار وجبة" });
//         }

//         const newOrder = new Order({
//             user: req.user ? req.user._id : null,
//             userName,
//             userPhone,
//             mealName,
//             quantity: quantity || 1,
//             notes: notes || ""
//         });

//         await newOrder.save();

//         // --- إضافة كود السوكت هنا ---
//         const io = req.app.get("io");
//         if (io) {
//             io.emit("newOrderArrived", newOrder); // إرسال الطلب فوراً للشيف
//         }

//         res.status(201).json({ message: "تم إرسال طلبك بنجاح للشيف 🚀", order: newOrder });
//     } catch (error) {
//         res.status(400).json({ message: "فشل في عملية الطلب", error: error.message });
//     }
// };

// // 2. فنكشن تأكيد الطلب وإرسال SMS (هذا اللي بنربطه مع زر Accept)
// exports.confirmOrder = async (req, res) => {
//     try {
//         const { phone, mealName } = req.body;

//         if (!phone) {
//             return res.status(400).json({ message: "رقم الهاتف مطلوب لإرسال التأكيد" });
//         }

//         // إرسال رسالة SMS للزبون عبر HIGH FIT API
//         await sendOrderConfirm(phone, mealName);

//         res.status(200).json({ message: "تم إرسال رسالة التأكيد للزبون بنجاح ✅" });
//     } catch (error) {
//         res.status(500).json({ message: "فشل إرسال رسالة التأكيد", error: error.message });
//     }
// };

// // 3. جلب جميع الطلبات
// exports.getOrders = async (req, res) => {
//     try {
//         const orders = await Order.find().sort({ createdAt: -1 });
//         res.status(200).json(orders);
//     } catch (error) {
//         res.status(500).json({ error: "فشل جلب البيانات" });
//     }
// };

// // 4. تحديث حالة الطلب
// exports.updateOrderStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         const updatedOrder = await Order.findByIdAndUpdate(
//             id, 
//             { status }, 
//             { new: true }
//         );

//         if (!updatedOrder) {
//             return res.status(404).json({ message: "الطلب غير موجود" });
//         }

//         res.status(200).json({ message: "تم تحديث حالة الطلب", updatedOrder });
//     } catch (error) {
//         res.status(400).json({ message: "فشل التحديث", error: error.message });
//     }
// };

// // 5. حذف طلب (عند ضغط تم التجهيز)
// exports.deleteOrder = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedOrder = await Order.findByIdAndDelete(id);

//         if (!deletedOrder) {
//             return res.status(404).json({ message: "الطلب غير موجود" });
//         }

//         res.status(200).json({ message: "تم حذف الطلب بنجاح" });
//     } catch (error) {
//         res.status(400).json({ message: "فشل الحذف", error: error.message });
//     }
// };

const Order = require('../models/Order');
const { sendOrderConfirm } = require('../../utils/otp'); 

// 1. إنشاء طلب جديد (يدعم قائمة وجبات من السلة)
exports.placeOrder = async (req, res) => {
    try {
        // بنستقبل items (مصفوفة الوجبات) بدل mealName
        const { items, userName, userPhone, address, totalAmount, notes } = req.body;
        
        // التأكد إن الطلب مش فاضي
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "السلة فارغة، يرجى إضافة وجبات" });
        }

        const newOrder = new Order({
            user: req.user ? req.user._id : null,
            userName,
            userPhone,
            address: address || "استلام من الفرع",
            items, // هون بنخزن كل الوجبات (الاسم، الكمية، السعر)
            totalAmount,
            notes: notes || "",
            status: "Pending" // الحالة الافتراضية
        });

        await newOrder.save();

        // إرسال تنبيه عبر السوكت للشيف
        const io = req.app.get("io");
        if (io) {
            io.emit("newOrderArrived", newOrder); 
        }

        res.status(201).json({ message: "تم إرسال طلبك بنجاح للشيف 🚀", order: newOrder });
    } catch (error) {
        // ملاحظة: شلنا كلمة next عشان نتفادى خطأ "next is not a function"
        res.status(400).json({ message: "فشل في عملية الطلب", error: error.message });
    }
};

// 2. تأكيد الطلب وإرسال SMS
// exports.confirmOrder = async (req, res) => {
//     try {
//         const { phone, items } = req.body;

//         if (!phone) {
//             return res.status(400).json({ message: "رقم الهاتف مطلوب لإرسال التأكيد" });
//         }

//         // تحويل أسماء الوجبات لنص واحد عشان الرسالة
//         const mealNames = items.map(i => i.mealName).join(', ');

//         await sendOrderConfirm(phone, mealNames);

//         res.status(200).json({ message: "تم إرسال رسالة التأكيد للزبون بنجاح ✅" });
//     } catch (error) {
//         res.status(500).json({ message: "فشل إرسال رسالة التأكيد", error: error.message });
//     }
// };

// 2. تأكيد الطلب وإرسال SMS (النسخة المعدلة)
exports.confirmOrder = async (req, res) => {
    try {
        // بنستقبل mealName (النص الجاهز) بدل items
        const { phone, mealName } = req.body;

        if (!phone) {
            return res.status(400).json({ message: "رقم الهاتف مطلوب لإرسال التأكيد" });
        }

        if (!mealName) {
            return res.status(400).json({ message: "أسماء الوجبات مطلوبة للرسالة" });
        }

        // إرسال الرسالة باستخدام النص القادم من الفرونت آند
        await sendOrderConfirm(phone, mealName);

        res.status(200).json({ message: "تم إرسال رسالة التأكيد للزبون بنجاح ✅" });
    } catch (error) {
        console.error("SMS Error:", error);
        res.status(500).json({ message: "فشل إرسال رسالة التأكيد", error: error.message });
    }
};

// 3. جلب جميع الطلبات (للشيف)
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "فشل جلب البيانات" });
    }
};

// باقي الفنكشنز (التحديث والحذف) بتضل زي ما هي لأنها بتعتمد على الـ ID
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: "الطلب غير موجود" });
        res.status(200).json({ message: "تم تحديث حالة الطلب", updatedOrder });
    } catch (error) {
        res.status(400).json({ message: "فشل التحديث", error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) return res.status(404).json({ message: "الطلب غير موجود" });
        res.status(200).json({ message: "تم حذف الطلب بنجاح" });
    } catch (error) {
        res.status(400).json({ message: "فشل الحذف", error: error.message });
    }
};