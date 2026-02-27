import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Utensils, Flame, ShoppingBag, Plus, Minus, MessageSquare, X, ArrowLeft, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useTranslation } from 'react-i18next';

const UserOrder = () => {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [orderData, setOrderData] = useState({ quantity: 1, notes: '' });
  
  const { addToCart, cart, fetchCart } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isAr = i18n.language === 'ar';

  useEffect(() => {
    fetchMeals();
    if (fetchCart) fetchCart();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/meals`);
      setMeals(res.data);
    } catch (err) {
      toast.error(t("error_fetch_menu"));
    }
  };

  const handleAddToCartClick = async () => {
    const sessionUser = sessionStorage.getItem("user");
    if (!sessionUser) {
      toast.error(t("login_required"));
      return;
    }

    if (!selectedMeal) return;

    const loadingToast = toast.loading(t("adding_to_cart"));
    try {
      await addToCart(selectedMeal._id, orderData.quantity, orderData.notes);
      
      const mealName = selectedMeal.name[i18n.language] || selectedMeal.name.en;
      toast.success(`${t("added")} ${mealName} ${t("to_cart_success")} 🛒`, { id: loadingToast });
      setSelectedMeal(null); 
      setOrderData({ quantity: 1, notes: '' }); 
    } catch (err) {
      toast.error(t("error_adding"), { id: loadingToast });
    }
  };

  const incrementQty = () => setOrderData(prev => ({ ...prev, quantity: prev.quantity + 1 }));
  const decrementQty = () => {
    if (orderData.quantity > 1) {
      setOrderData(prev => ({ ...prev, quantity: prev.quantity - 1 }));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-28" dir={isAr ? "rtl" : "ltr"}>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-6">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className={isAr ? "text-right" : "text-left"}>
            <h1 className="text-2xl font-black italic tracking-tighter text-white">
              ELITE <span className="text-orange-500">MENU</span>
            </h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">{t("premium_exp")}</p>
          </div>
          
          <Link to="/cart" className="relative p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ShoppingBag className="text-orange-500" size={24} />
            {cart?.products?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.products.length}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* قائمة الوجبات */}
      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
        {meals.map((meal) => (
          <div 
            key={meal._id}
            onClick={() => {
              setSelectedMeal(meal);
              setOrderData({ quantity: 1, notes: '' });
            }}
            className="group flex items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] hover:border-orange-500/50 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <div className={`flex-1 ${isAr ? "text-right" : "text-left"}`}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors">
                    {meal.name[i18n.language] || meal.name.en}
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-orange-500/60 bg-orange-500/5 px-2 py-0.5 rounded-full">
                  <Flame size={10} />
                  <span>{meal.calories} {t("cal")}</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs line-clamp-1 italic mb-3">
                {meal.description[i18n.language] || meal.description.en}
              </p>
              <span className="text-xl font-black text-white">{meal.price} <small className="text-[10px] text-gray-400">{t("currency")}</small></span>
            </div>

            <div className="relative w-24 h-24 bg-white/5 rounded-2xl flex-shrink-0 border border-white/5 overflow-hidden">
              {meal.image ? (
                <img src={meal.image} className="w-full h-full object-cover" alt={meal.name[i18n.language]} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10 italic text-[10px]">{t("no_image")}</div>
              )}
              <div className={`absolute bottom-1 ${isAr ? "left-1" : "right-1"} bg-orange-500 text-black p-1 rounded-lg`}>
                <Plus size={16} strokeWidth={4} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* مودال التخصيص */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-end">
          <div className="bg-[#0c0c0c] w-full rounded-t-[3rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500 relative max-h-[85vh] overflow-y-auto">
            
            <button onClick={() => setSelectedMeal(null)} className={`absolute top-6 ${isAr ? "left-6" : "right-6"} text-gray-500 hover:text-white`}>
              <X size={28} />
            </button>

            <div className="mb-8 pt-4 text-center flex flex-col items-center">
               {selectedMeal.image && <img src={selectedMeal.image} className="w-28 h-28 rounded-3xl object-cover mb-4 border border-white/10" alt="" />}
               <h3 className="text-2xl font-black">{selectedMeal.name[i18n.language] || selectedMeal.name.en}</h3>
               <div className="text-gray-400 mt-1">{selectedMeal.price} {t("currency")}</div>
            </div>

            <div className="space-y-6 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="font-bold">{t("quantity")}</span>
                <div className="flex items-center gap-6">
                  <button onClick={decrementQty} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl"><Minus size={18} /></button>
                  <span className="text-2xl font-black text-orange-500">{orderData.quantity}</span>
                  <button onClick={incrementQty} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl"><Plus size={18} /></button>
                </div>
              </div>

              <div className={`relative group ${isAr ? "text-right" : "text-left"}`}>
                <MessageSquare className={`absolute ${isAr ? "right-4" : "left-4"} top-4 text-gray-600 group-focus-within:text-orange-500`} size={18} />
                <textarea 
                  className={`w-full bg-white/5 border border-white/10 p-4 ${isAr ? "pr-12 text-right" : "pl-12 text-left"} rounded-2xl focus:border-orange-500 outline-none text-sm h-24 resize-none`} 
                  placeholder={t("notes_placeholder")} 
                  value={orderData.notes}
                  onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={handleAddToCartClick}
              className="w-full max-w-md mx-auto bg-orange-600 hover:bg-orange-500 text-black font-black py-5 rounded-3xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
            >
              {t("add_to_cart_btn")} • {(selectedMeal.price * orderData.quantity).toFixed(2)} {t("currency")}
            </button>
          </div>
        </div>
      )}

      {/* زر عرض السلة العائم */}
      {cart?.products?.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-40">
           <button 
            onClick={() => navigate('/cart')}
            className="w-full max-w-md mx-auto bg-white text-black font-black py-4 rounded-2xl flex justify-between items-center px-8 shadow-2xl"
           >
             <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-orange-600" />
                <span>{t("view_cart")}</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs">{cart.products.length}</span>
                {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
             </div>
           </button>
        </div>
      )}
    </div>
  );
};

export default UserOrder;// export default UserOrder;