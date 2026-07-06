import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  // --- التعديل الجوهري هنا: جلب أي يوزر متاح (عادي أو موظف) ---
  const getSessionUser = () => {
    try {
      // نفحص اليوزر العادي أولاً، ثم الموظف (staffUser)
      const userData =
        Cookies.get("user") || Cookies.get("staffUser");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user from session", error);
      return null;
    }
  };

  // دالة جلب السلة من السيرفر
  const fetchCart = async () => {
    const user = getSessionUser();
    // تأكدنا إنه فيه يوزر وفيه ID
    if (!user?._id) {
      setCart({ products: [] });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/cart/${user._id}`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCart(data || { products: [] });
    } catch (error) {
      console.error("Cart fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // دالة إضافة منتج للسلة
  const addToCart = async (mealId, quantity, notes) => {
    const user = getSessionUser();

    if (!user?._id) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, mealId, quantity, notes }),
      });

      if (!res.ok) throw new Error("Add to cart failed");

      const data = await res.json();
      setCart(data);
      toast.success("تمت الإضافة للسلة 🛒");
    } catch (error) {
      console.error(error);
      toast.error("فشل في الإضافة");
    }
  };

  // دالة حذف منتج من السلة
  const removeFromCart = async (mealId) => {
    const user = getSessionUser();
    if (!user?._id) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, mealId }),
      });
      const data = await res.json();
      setCart(data);
      toast.success("تم الحذف من السلة");
    } catch (error) {
      toast.error("فشل الحذف");
    }
  };

  const clearCart = async () => {
    const user = getSessionUser();
    if (!user?._id) return;

    try {
      await fetch(
        `${import.meta.env.VITE_BASE_URL}/cart/clear/${user._id}`,
        {
          method: "DELETE",
        },
      );
      setCart({ products: [], totalPrice: 0 });
    } catch (error) {
      console.error("Clear cart error", error);
    }
  };

  const total =
    cart?.products?.reduce((acc, item) => {
      const price = item.productId?.price || 0;
      return acc + price * item.quantity;
    }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        total,
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
