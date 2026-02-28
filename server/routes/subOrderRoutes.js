
// module.exports = router;

const router = require('express').Router();
const SubOrder = require('../models/SubOrder');
const auth = require('../middleware/validateJWT');

// 1. طلب اشتراك جديد (للمستخدم)
router.post('/subscribe', auth, async (req, res) => {
  try {
    // التعديل هنا: أضفنا customerDetails لاستقبال الاسم والثلاثي والرقم من الفرونت إند
    const { subscriptionId, planDetails, customerDetails } = req.body;

    if (!subscriptionId || !planDetails || !customerDetails) {
      return res.status(400).json({ msg: "يرجى إرسال كافة تفاصيل الاشتراك بما فيها الاسم والرقم" });
    }

    const newOrder = new SubOrder({
      user: req.user.id, 
      subscriptionId,
      customerDetails, // تخزين الاسم الثلاثي ورقم الهاتف هنا
      planDetails,
      status: 'pending' 
    });

    await newOrder.save();
    res.status(201).json({ msg: "تم إرسال طلب الاشتراك بنجاح!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "فشل في عملية الاشتراك" });
  }
});

// 2. جلب كافة الطلبات (للأدمن)
router.get('/admin/all', async (req, res) => {
  try {
    // جلب الطلبات، وإذا كنت تريد بيانات اليوزر الأساسية (إيميله مثلاً) استخدم populate
    const orders = await SubOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("ERROR IN SERVER:", err);
    res.status(500).json({ msg: "خطأ داخلي في السيرفر", error: err.message });
  }
});

// 3. تفعيل الاشتراك
router.put('/activate/:id', auth, async (req, res) => {
  try {
    const order = await SubOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "الطلب غير موجود" });

    order.status = 'active';
    await order.save();

    res.json({ msg: "تم تفعيل الاشتراك بنجاح!" });
  } catch (err) {
    res.status(500).json({ msg: "فشل في تفعيل الاشتراك" });
  }
});

module.exports = router;