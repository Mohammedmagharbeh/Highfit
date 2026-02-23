
const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");
const validateJWT  = require('../middleware/validateJWT');

// جلب السلة (GET /api/cart/:userId)
// تستخدم لعرض المنتجات في صفحة السلة
router.get("/:userId", cartController.getCart);
// مثال لما يجب أن يكون عليه الكود في الباك إند (Node.js/Express)
router.get('/', validateJWT, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  res.status(200).json(cart);
});
// إضافة وجبة للسلة (POST /api/cart/add)
// تستخدم عند الضغط على "إضافة للسلة" من صفحة المنيو
router.post("/add", cartController.addToCart);

// حذف وجبة واحدة من السلة (DELETE /api/cart/remove)
// تستخدم عند الضغط على زر "حذف" (أيقونة السلة) بجانب الوجبة
router.delete("/remove", cartController.removeFromCart);

// تفريغ السلة بالكامل (DELETE /api/cart/clear/:userId)
// تستخدم بعد إتمام عملية الدفع (Checkout) لتصفير السلة
router.delete("/clear/:userId", cartController.clearCart);

module.exports = router;