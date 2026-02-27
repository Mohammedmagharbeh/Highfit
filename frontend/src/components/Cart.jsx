
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Cart = () => {
  const { cart, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isAr = i18n.language === 'ar';

  // حساب المجموع الكلي
  const totalPrice = cart?.products?.reduce((acc, item) => {
    return acc + (item.productId.price * item.quantity);
  }, 0) || 0;

  // دالة لتعديل الكمية
  const updateQuantity = async (mealId, currentQty, delta, notes) => {
    try {
      await addToCart(mealId, delta, notes);
    } catch (err) {
      toast.error(t("error_update_qty"));
    }
  };

  if (!cart || cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white/5 p-8 rounded-full mb-6">
          <ShoppingCart size={60} className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t("cart_empty_title")}</h2>
        <p className="text-gray-500 mb-8 text-center">{t("cart_empty_desc")}</p>
        <Link to="/order" className="bg-orange-600 text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2">
          {t("browse_menu")} {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32" dir={isAr ? "rtl" : "ltr"}>
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-md z-10">
        <button onClick={() => navigate('/order')} className="p-2 bg-white/5 rounded-xl text-gray-400">
          {isAr ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
        <h1 className="text-xl font-black">{t("shopping_cart")} ({cart.products.length})</h1>
        <div className="w-10"></div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {cart.products.map((item) => (
          <div key={item.productId._id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] flex items-center gap-4">
            {/* صورة الوجبة */}
            <img 
              src={item.productId.image} 
              alt={item.productId.name[i18n.language] || item.productId.name.en} 
              className="w-20 h-20 rounded-2xl object-cover border border-white/10"
            />

            {/* تفاصيل الوجبة */}
            <div className={`flex-1 ${isAr ? "text-right" : "text-left"}`}>
              <h3 className="font-bold text-lg">{item.productId.name[i18n.language] || item.productId.name.en}</h3>
              <p className="text-orange-500 font-black mb-2">{item.productId.price} <small>{t("currency")}</small></p>
              
              {/* التحكم بالكمية */}
              <div className="flex items-center gap-4 bg-white/5 w-fit px-3 py-1.5 rounded-xl border border-white/5">
                <button 
                  onClick={() => updateQuantity(item.productId._id, item.quantity, -1, item.notes)}
                  className="text-gray-400 hover:text-white"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold min-w-[20px] text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.productId._id, item.quantity, 1, item.notes)}
                  className="text-orange-500 hover:text-orange-400"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* زر الحذف */}
            <button 
              onClick={() => removeFromCart(item.productId._id)}
              className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* ملخص السعر والطلب */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0c0c0c] border-t border-white/10 p-6 rounded-t-[2.5rem] shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-between items-center text-gray-400">
            <span>{t("subtotal")}</span>
            <span className="text-white font-bold">{totalPrice.toFixed(2)} {t("currency")}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-black">
            <span>{t("total_amount")}</span>
            <span className="text-orange-500">{totalPrice.toFixed(2)} {t("currency")}</span>
          </div>
          
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-orange-600 hover:bg-orange-500 text-black font-black py-5 rounded-3xl flex items-center justify-center gap-3 text-lg transition-transform active:scale-95 shadow-lg shadow-orange-600/20"
          >
            {t("checkout_btn")}
            {isAr ? <ArrowLeft size={22} /> : <ArrowRight size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;