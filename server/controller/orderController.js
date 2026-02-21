const Order = require('../models/Order');

// 1. إنشاء طلب جديد (للمستخدم المسجل)
exports.placeOrder = async (req, res) => {
    try {
        // استلام الحقول الجديدة من req.body
        const { mealName, userName, userPhone, quantity, notes } = req.body;
        
        if (!mealName) {
            return res.status(400).json({ message: "يرجى اختيار وجبة" });
        }

        const newOrder = new Order({
            user: req.user ? req.user._id : null, // إذا كان الدخول إلزامي اتركها كما هي
            userName: userName,   // يتم تخزينها يدوياً كما أرسلها الفرونت آند
            userPhone: userPhone, // يتم تخزينها يدوياً كما أرسلها الفرونت آند
            mealName: mealName,
            quantity: quantity || 1, // القيمة الافتراضية 1
            notes: notes || ""       // تخزين الملاحظات
        });

        await newOrder.save();
        res.status(201).json({ message: "تم إرسال طلبك بنجاح للشيف 🚀", order: newOrder });
    } catch (error) {
        res.status(400).json({ message: "فشل في عملية الطلب", error: error.message });
    }
};

// 2. جلب جميع الطلبات (معدل ليشمل الحقول الجديدة)
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        // إذا كان الـ user موجود سيعمل populate، إذا لا سيتجاهله ولن ينهار السيرفر
        res.status(200).json(orders);
    } catch (error) {
        console.log("الخطأ هو: ", error.message);
        res.status(500).json({ error: "فشل جلب البيانات" });
    }
};
// exports.placeOrder = async (req, res) => {
//     try {
//         const { mealName } = req.body;
        
//         // التحقق من وجود اسم الوجبة
//         if (!mealName) {
//             return res.status(400).json({ message: "يرجى اختيار وجبة" });
//         }

//         // ملاحظة: req.user تم تعبئته بواسطة الـ validateJWT Middleware
//         const newOrder = new Order({
//             user: req.user._id, // نأخذ الـ ID من التوكن بأمان
//             mealName: mealName
//         });

//         await newOrder.save();
//         res.status(201).json({ message: "تم إرسال طلبك بنجاح للشيف 🚀", order: newOrder });
//     } catch (error) {
//         res.status(400).json({ message: "فشل في عملية الطلب", error: error.message });
//     }
// };

// // 2. جلب جميع الطلبات (خاص بلوحة تحكم الشيف)
// exports.getOrders = async (req, res) => {
//     try {
//         // نستخدم populate لجلب بيانات اليوزر (الاسم ورقم الهاتف) المرتبطة بالطلب
//         const orders = await Order.find()
//             .populate('user', 'name phone') 
//             .sort({ createdAt: -1 }); // ترتيب من الأحدث للأقدم

//         res.status(200).json(orders);
//     } catch (error) {
//         res.status(500).json({ message: "خطأ في جلب الطلبات", error: error.message });
//     }
// };

// 3. تحديث حالة الطلب (مثلاً من Pending إلى Done)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        ).populate('user', 'name phone');

        if (!updatedOrder) {
            return res.status(404).json({ message: "الطلب غير موجود" });
        }

        res.status(200).json({ message: "تم تحديث حالة الطلب", updatedOrder });
    } catch (error) {
        res.status(400).json({ message: "فشل التحديث", error: error.message });
    }
};

// 4. حذف طلب (اختياري للشيف لتنظيف القائمة)
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "الطلب غير موجود" });
        }

        res.status(200).json({ message: "تم حذف الطلب بنجاح" });
    } catch (error) {
        res.status(400).json({ message: "فشل الحذف", error: error.message });
    }
};