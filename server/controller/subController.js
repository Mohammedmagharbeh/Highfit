

const SubOrder = require('../models/SubOrder');
const Subscription = require('../models/Subscription');
const mongoose = require('mongoose');

// ==========================================
// أولاً: وظائف طلبات اللاعبين (التي تستقبل الرقم الوطني)
// ==========================================

// 1. إرسال طلب اشتراك جديد (من صفحة Plans)
exports.subscribe = async (req, res) => {
    try {
        const { subscriptionId, customerDetails, planDetails } = req.body;

        // إنشاء طلب جديد وتخزين الرقم الوطني والعمر
        const newOrder = new SubOrder({
            subscriptionId,
            customerDetails: {
                fullName: customerDetails.fullName,
                phone: customerDetails.phone,
                nationalId: customerDetails.nationalId, // تخزين الرقم الوطني
                age: customerDetails.age              // تخزين العمر المحسوب
            },
            planDetails: {
                title: planDetails.title,
                duration: planDetails.duration,
                price: planDetails.price
            }
        });

        await newOrder.save();
        res.status(201).json({ msg: "تم إرسال طلب الاشتراك بنجاح", order: newOrder });
    } catch (err) {
        console.error("Error in subscribe:", err);
        res.status(500).json({ msg: "خطأ في معالجة طلب الاشتراك" });
    }
};

// 2. جلب كل الطلبات (ليظهر الرقم الوطني في صفحة الأدمن)
exports.getAllOrders = async (req, res) => {
    try {
        // جلب الطلبات وترتيبها من الأحدث للأقدم
        const orders = await SubOrder.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: "خطأ في جلب طلبات اللاعبين" });
    }
};

// 3. تفعيل الطلب (تغيير الحالة من pending إلى active)
exports.activateOrder = async (req, res) => {
    try {
        const order = await SubOrder.findByIdAndUpdate(
            req.params.id,
            { status: 'active' },
            { new: true }
        );
        if (!order) return res.status(404).json({ msg: "الطلب غير موجود" });
        res.json({ msg: "تم تفعيل الاشتراك بنجاح", order });
    } catch (err) {
        res.status(500).json({ msg: "خطأ في تفعيل الطلب" });
    }
};


// ==========================================
// ثانياً: وظائف إدارة الباقات (التي كانت عندك سابقاً)
// ==========================================

// 4. جلب كل الباقات المتوفرة
exports.getAllSubs = async (req, res) => {
    try {
        const subs = await Subscription.find();
        res.json(subs);
    } catch (err) {
        res.status(500).json({ msg: "خطأ في جلب الباقات" });
    }
};

// 5. إضافة باقة تمارين جديدة
exports.addSubscription = async (req, res) => {
    try {
        const { title, type, description, plans } = req.body;
        const newSub = new Subscription({ title, type, description, plans });
        await newSub.save();
        res.status(201).json(newSub);
    } catch (err) {
        res.status(500).json({ msg: "خطأ في إضافة الباقة" });
    }
};

// 6. تعديل باقة موجودة
exports.updateSub = async (req, res) => {
    try {
        const { title, type, description, plans } = req.body;
        const updatedSub = await Subscription.findByIdAndUpdate(
            req.params.id,
            { title, type, description, plans },
            { new: true }
        );
        if (!updatedSub) return res.status(404).json({ msg: "الباقة غير موجودة" });
        res.json(updatedSub);
    } catch (err) {
        res.status(500).json({ msg: "خطأ في التعديل" });
    }
};

// 7. حذف باقة
exports.deleteSub = async (req, res) => {
    try {
        const sub = await Subscription.findByIdAndDelete(req.params.id);
        if (!sub) return res.status(404).json({ msg: "الباقة غير موجودة" });
        res.json({ msg: "تم الحذف بنجاح" });
    } catch (err) {
        res.status(500).json({ msg: "خطأ في الحذف" });
    }
};