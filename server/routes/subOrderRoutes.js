

const router = require('express').Router();
const SubOrder = require('../models/SubOrder');
const auth = require('../middleware/validateJWT');

// 1. طلب اشتراك جديد (للمستخدم)
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { subscriptionId, planDetails, customerDetails } = req.body;

    if (!subscriptionId || !planDetails || !customerDetails) {
      return res.status(400).json({ msg: "يرجى إرسال كافة تفاصيل الاشتراك" });
    }

    const newOrder = new SubOrder({
      user: req.user.id, 
      subscriptionId,
      customerDetails,
      planDetails,
      status: 'pending' 
    });

    await newOrder.save();
    res.status(201).json({ msg: "تم إرسال طلب الاشتراك بنجاح!" });
  } catch (err) {
    res.status(500).json({ msg: "فشل في عملية الاشتراك" });
  }
});

// 2. جلب كافة الطلبات (للأدمن)
router.get('/admin/all', async (req, res) => {
  try {
    const orders = await SubOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "خطأ داخلي في السيرفر" });
  }
});

// 3. قبول الطلب وتغيير حالته (المزامنة)
// استخدمنا PATCH هنا لتحديث جزئي وهو الأفضل برمجياً
// تحديث حالة الطلب إلى active (قبول)
router.patch('/:id/accept', auth, async (req, res) => {
  try {
    const order = await SubOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "الطلب غير موجود" });

    order.status = 'active'; // تحديث الحالة في قاعدة البيانات
    await order.save();

    res.json({ msg: "تم قبول الطلب بنجاح", order });
  } catch (err) {
    res.status(500).json({ msg: "خطأ في تحديث البيانات" });
  }
});
module.exports = router;