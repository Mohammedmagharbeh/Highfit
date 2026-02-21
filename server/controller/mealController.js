
const Meal = require('../models/Meal');
const { cloudinary } = require('../config/cloudinary'); // تأكد أن المسار لملف الـ config صحيح

// 1. جلب كل الأكلات (للمشتركين وللشيف)
exports.getMeals = async (req, res) => {
    try {
        const meals = await Meal.find().sort({ createdAt: -1 });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ message: "خطأ في جلب الأكلات", error: error.message });
    }
};

// 2. إضافة أكلة جديدة (رفع الصورة لـ Cloudinary ثم الحفظ)
exports.addMeal = async (req, res) => {
    try {
        const { name, description, calories, price, image } = req.body;

        let imageUrl = "https://via.placeholder.com/300"; // رابط افتراضي

        // إذا أرسل الشيف صورة بصيغة Base64 من الفرونت آند
        if (image && image.startsWith('data:image')) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "elite_menu_meals", // اسم المجلد في حسابك بكلاودنري
            });
            imageUrl = uploadResponse.secure_url; // الرابط النهائي من كلاودنري
        }

        const newMeal = new Meal({
            name,        // { ar, en }
            description, // { ar, en }
            calories,
            price,
            image: imageUrl
        });

        await newMeal.save();
        res.status(201).json({ message: "تمت إضافة الأكلة بنجاح ✨", meal: newMeal });
    } catch (error) {
        console.error("Cloudinary Error:", error);
        res.status(400).json({ message: "فشل في إضافة الأكلة", error: error.message });
    }
};

// 3. تعديل أكلة موجودة (مع دعم تحديث الصورة على Cloudinary)
exports.updateMeal = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        // إذا تم إرسال صورة جديدة (Base64) نقوم برفعها
        if (req.body.image && req.body.image.startsWith('data:image')) {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                folder: "elite_menu_meals",
            });
            updateData.image = uploadResponse.secure_url;
        }
        
        const updatedMeal = await Meal.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true } 
        );
        
        if (!updatedMeal) {
            return res.status(404).json({ message: "الأكلة غير موجودة" });
        }
        
        res.status(200).json({ message: "تم تحديث الأكلة بنجاح ✅", updatedMeal });
    } catch (error) {
        res.status(500).json({ message: "خطأ في التحديث", error: error.message });
    }
};

// 4. حذف أكلة
exports.deleteMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMeal = await Meal.findByIdAndDelete(id);
        
        if (!deletedMeal) {
            return res.status(404).json({ message: "الأكلة غير موجودة أصلاً" });
        }
        
        res.status(200).json({ message: "تم حذف الأكلة بنجاح 🗑️" });
    } catch (error) {
        res.status(500).json({ message: "خطأ في الحذف", error: error.message });
    }
};