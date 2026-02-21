// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderCtrl = require('../controller/orderController');

// تأكد أن orderCtrl.updateOrderStatus ليست undefined
router.get('/', orderCtrl.getOrders);
router.post('/', orderCtrl.placeOrder);
router.patch('/:id', orderCtrl.updateOrderStatus); // السطر 7 غالباً هنا

module.exports = router;