const express = require('express');
const router = express.Router();
const Chef = require('../models/Chef');

// تسجيل شيف جديد (يُستخدم مرة واحدة عند إعداد التطبيق)
router.post('/register', async (req, res) => {
    try {
        const newChef = new Chef(req.body);
        await newChef.save();
        res.status(201).json(newChef);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// تسجيل دخول الشيف
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;
    const chef = await Chef.findOne({ phone, password });
    if (chef) {
        res.json({ message: "تم تسجيل الدخول بنجاح", chef });
    } else {
        res.status(401).json({ message: "البيانات غير صحيحة" });
    }
});

module.exports = router;