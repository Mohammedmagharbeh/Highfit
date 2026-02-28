
const router = require('express').Router();
const subController = require('../controller/subController');
const auth = require('../middleware/validateJWT'); 

// --- 1. إدارة الباقات (العناوين والأسعار) ---

// جلب كل الباقات (للمشاهدة في صفحة Plans)
router.get('/', subController.getAllSubs);

// إضافة باقة جديدة (للأدمن)
router.post('/add', auth, subController.addSubscription);

// تعديل باقة (للأدمن)
router.put('/:id', auth, subController.updateSub);

// حذف باقة (للأدمن)
router.delete('/:id', auth, subController.deleteSub);


// --- 2. إدارة طلبات اشتراك اللاعبين (جديد) ---

// إرسال طلب اشتراك جديد (اللي فيه الرقم الوطني والعمر)
// الرابط المستهدف: axios.post('http://localhost:5000/api/sub-orders/subscribe')
router.post('/subscribe', auth, subController.subscribe);

// جلب كل الطلبات الواردة (للأدمن فقط ليظهر الرقم الوطني بالجدول)
// الرابط المستهدف: axios.get('http://localhost:5000/api/sub-orders/admin/all')
router.get('/admin/all', auth, subController.getAllOrders);

// تفعيل اشتراك لاعب (تحويله من pending إلى active)
router.put('/activate/:id', auth, subController.activateOrder);


module.exports = router;