
const Cart = require("../models/Cart");

// 1. عرض محتويات السلة للمستخدم
exports.getCart = async (req, res, next) => { // ضفنا next هون
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId }).populate("products.productId");
    
    if (!cart) {
      return res.status(200).json({ products: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب بيانات السلة", error: error.message });
  }
};

// 2. إضافة وجبة للسلة أو زيادة كميتها
// exports.addToCart = async (req, res, next) => { // ضفنا next هون
//   const { userId, mealId, quantity, notes } = req.body;

//   try {
//     let cart = await Cart.findOne({ userId });

//     if (cart) {
//       const itemIndex = cart.products.findIndex(p => p.productId.toString() === mealId);

//       if (itemIndex > -1) {
//         let productItem = cart.products[itemIndex];
//         productItem.quantity += quantity;
//         productItem.notes = notes || productItem.notes;
//         cart.products[itemIndex] = productItem;
//       } else {
//         cart.products.push({ productId: mealId, quantity, notes });
//       }
//       cart = await cart.save();
//     } else {
//       cart = await Cart.create({
//         userId,
//         products: [{ productId: mealId, quantity, notes }]
//       });
//     }

//     const updatedCart = await Cart.findById(cart._id).populate("products.productId");
//     res.status(201).json(updatedCart);
//   } catch (error) {
//     // تعديل بسيط هون عشان نرجع النص الصافي للخطأ
//     res.status(500).json({ message: "خطأ في الإضافة للسلة", error: error.message });
//   }
// };

// حذفنا next من هون تماماً
exports.addToCart = async (req, res) => {
  try {
    const { userId, mealId, quantity, notes } = req.body;

    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.products.findIndex(p => p.productId.toString() === mealId);

      if (itemIndex > -1) {
        let productItem = cart.products[itemIndex];
        productItem.quantity += quantity;
        productItem.notes = notes || productItem.notes;
        cart.products[itemIndex] = productItem;
      } else {
        cart.products.push({ productId: mealId, quantity, notes });
      }
      cart = await cart.save();
    } else {
      cart = await Cart.create({
        userId,
        products: [{ productId: mealId, quantity, notes }]
      });
    }

    const updatedCart = await Cart.findById(cart._id).populate("products.productId");
    return res.status(201).json(updatedCart);

  } catch (error) {
    // هون السر: بنرجع الرد مباشرة وما بننادي next()
    console.error("Cart Error:", error);
    return res.status(500).json({ 
      message: "فشل في عملية الطلب", 
      error: error.message 
    });
  }
};

// 3. حذف وجبة وحدة من السلة
exports.removeFromCart = async (req, res, next) => { // ضفنا next هون
  const { userId, mealId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products = cart.products.filter(p => p.productId.toString() !== mealId);
      cart = await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate("products.productId");
      return res.status(200).json(updatedCart);
    }
    res.status(404).json({ message: "السلة غير موجودة" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في حذف الوجبة", error: error.message });
  }
};

// 4. تفريغ السلة بالكامل
// exports.clearCart = async (req, res, next) => { // ضفنا next هون
//   const { userId } = req.params;
//   try {
//     const cart = await Cart.findOne({ userId });
//     if (cart) {
//       cart.products = [];
//       await cart.save();
//       return res.status(200).json({ message: "تم تفريغ السلة بنجاح", products: [] });
//     }
//     res.status(404).json({ message: "السلة غير موجودة" });
//   } catch (error) {
//     res.status(500).json({ message: "خطأ في تفريغ السلة", error: error.message });
//   }
// };
exports.clearCart = async (req, res, next) => {
  const { userId } = req.params;
  try {
    // استخدمنا findOneAndDelete لأنها أسرع وأضمن للتصفير
    // تأكد إن اسم الموديل "Cart" معرف فوق في أول الملف
    const cart = await Cart.findOne({ userId });
    
    if (cart) {
      cart.products = []; // تصفير المصفوفة
      await cart.save();  // حفظ التغييرات
      return res.status(200).json({ 
        message: "تم تفريغ السلة بنجاح", 
        products: [] 
      });
    }
    
    return res.status(404).json({ message: "السلة غير موجودة" });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    return res.status(500).json({ 
      message: "خطأ في تفريغ السلة", 
      error: error.message 
    });
  }
};