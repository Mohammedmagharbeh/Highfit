
const express = require('express');
const router = express.Router();
const orderCtrl = require('../controller/orderController');

// 1. جلب جميع الطلبات
router.get('/', orderCtrl.getOrders);

// 2. إنشاء طلب جديد
router.post('/', orderCtrl.placeOrder);

// 3. تأكيد الطلب وإرسال رسالة SMS (الرابط الجديد)
// يتم استدعاؤه عند ضغط الشيف على زر Accept
router.post('/confirm-order', orderCtrl.confirmOrder); 

// 4. تحديث حالة الطلب
router.patch('/:id', orderCtrl.updateOrderStatus);

// 5. حذف طلب (عند ضغط تم التجهيز)
router.delete('/:id', orderCtrl.deleteOrder);

module.exports = router;