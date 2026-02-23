// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Utensils, Flame, ShoppingBag, User, Phone, ArrowLeft, X, Plus, Minus, MessageSquare } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

// const UserOrder = () => {
//   const [meals, setMeals] = useState([]);
//   const [selectedMeal, setSelectedMeal] = useState(null);
//   const [userData, setUserData] = useState({ name: '', phone: '', quantity: 1, notes: '' });

//   useEffect(() => {
//     fetchMeals();
//   }, []);

//   const fetchMeals = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/meals`);
//       setMeals(res.data);
//     } catch (err) {
//       toast.error("فشل في تحميل المنيو");
//     }
//   };

//   const handleOrder = async () => {
//     if (!userData.name || !userData.phone) return toast.error("أدخل بياناتك أولاً");
    
//     const loadingToast = toast.loading('جاري طلب وجبتك...');
//     try {
//       await axios.post(`${import.meta.env.VITE_BASE_URL}/orders`, {
//         userName: userData.name,
//         userPhone: userData.phone,
//         mealName: selectedMeal.name.ar,
//         quantity: userData.quantity,
//         notes: userData.notes
//       });
      
//       toast.success(`تم طلب ${userData.quantity} ${selectedMeal.name.ar}! 🍽️`, { id: loadingToast });
//       setSelectedMeal(null);
//       setUserData({ name: '', phone: '', quantity: 1, notes: '' });
//     } catch (err) {
//       toast.error("حدث خطأ", { id: loadingToast });
//     }
//   };

//   const incrementQty = () => setUserData(prev => ({ ...prev, quantity: prev.quantity + 1 }));
//   const decrementQty = () => {
//     if (userData.quantity > 1) {
//       setUserData(prev => ({ ...prev, quantity: prev.quantity - 1 }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050505] text-white font-sans pb-20" dir="rtl">
//       <Toaster position="top-center" />

//       {/* Header */}
//       <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-6">
//         <div className="max-w-2xl mx-auto flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-black italic tracking-tighter">ELITE <span className="text-orange-500">MENU</span></h1>
//             <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Premium Experience</p>
//           </div>
//           <Utensils className="text-orange-500" size={24} />
//         </div>
//       </header>

//       {/* قائمة الوجبات */}
//       <div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
//         {meals.map((meal) => (
//           <div 
//             key={meal._id}
//             onClick={() => {
//               setSelectedMeal(meal);
//               setUserData(prev => ({ ...prev, quantity: 1, notes: '' }));
//             }}
//             className="group flex items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] hover:border-orange-500/50 transition-all cursor-pointer active:scale-95"
//           >
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-1">
//                 <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors">{meal.name.ar}</h3>
//                 <div className="flex items-center gap-1 text-[10px] text-orange-500/60 bg-orange-500/5 px-2 py-0.5 rounded-full">
//                   <Flame size={10} />
//                   <span>{meal.calories} cal</span>
//                 </div>
//               </div>
//               <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3 italic">
//                 {meal.description.ar}
//               </p>
//               <span className="text-xl font-black text-white">{meal.price} <small className="text-[10px] text-gray-500">JOD</small></span>
//             </div>

//             {/* عرض صورة الوجبة المرفوعة من الشيف */}
//             <div className="relative w-24 h-24 bg-white/5 rounded-2xl flex-shrink-0 border border-white/5 overflow-hidden flex items-center justify-center">
//               {meal.image ? (
//                 <img src={meal.image} className="w-full h-full object-cover" alt={meal.name.ar} />
//               ) : (
//                 <ShoppingBag className="text-white/10" size={30} />
//               )}
//               <div className="absolute -bottom-2 -left-2 bg-orange-500 text-black p-1.5 rounded-xl shadow-lg">
//                 <Plus size={18} strokeWidth={4} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Bottom Sheet المطور */}
//       {selectedMeal && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-end">
//           <div className="bg-[#0c0c0c] w-full rounded-t-[3rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500 relative max-h-[90vh] overflow-y-auto">
            
//             <button 
//               onClick={() => setSelectedMeal(null)}
//               className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
//             >
//               <X size={30} />
//             </button>

//             <div className="mb-8 pt-4 text-center flex flex-col items-center">
//                {/* عرض صورة الوجبة داخل الـ Bottom Sheet */}
//                {selectedMeal.image && (
//                  <img src={selectedMeal.image} className="w-32 h-32 rounded-3xl object-cover mb-4 border border-white/10 shadow-2xl" alt="" />
//                )}
//                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2">تخصيص الطلب</p>
//                <h3 className="text-3xl font-black">{selectedMeal.name.ar}</h3>
//                <div className="text-gray-400 mt-1">سعر الوجبة: {selectedMeal.price} JOD</div>
//             </div>

//             <div className="space-y-6 mb-8 max-w-md mx-auto">
              
//               {/* واجهة التحكم في الكمية */}
//               <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
//                 <span className="font-bold">الكمية</span>
//                 <div className="flex items-center gap-6">
//                   <button onClick={decrementQty} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-red-500/20 transition-colors">
//                     <Minus size={20} />
//                   </button>
//                   <span className="text-2xl font-black text-orange-500">{userData.quantity}</span>
//                   <button onClick={incrementQty} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-green-500/20 transition-colors">
//                     <Plus size={20} />
//                   </button>
//                 </div>
//               </div>

//               {/* مدخلات المستخدم - الحقول التي طلبت عدم لمسها */}
//               <div className="space-y-3">
//                 <div className="relative group">
//                   <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500" size={18} />
//                   <input 
//                     className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none text-sm" 
//                     placeholder="اسمك الكامل" 
//                     value={userData.name}
//                     onChange={(e) => setUserData({...userData, name: e.target.value})}
//                   />
//                 </div>
//                 <div className="relative group">
//                   <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500" size={18} />
//                   <input 
//                     className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none text-sm font-mono" 
//                     placeholder="رقم الهاتف" 
//                     type="tel"
//                     value={userData.phone}
//                     onChange={(e) => setUserData({...userData, phone: e.target.value})}
//                   />
//                 </div>
//                 <div className="relative group">
//                   <MessageSquare className="absolute right-4 top-4 text-gray-600 group-focus-within:text-orange-500" size={18} />
//                   <textarea 
//                     className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none text-sm h-24 resize-none" 
//                     placeholder="ملاحظات إضافية (اختياري)..." 
//                     value={userData.notes}
//                     onChange={(e) => setUserData({...userData, notes: e.target.value})}
//                   />
//                 </div>
//               </div>

//               {/* المجموع النهائي */}
//               <div className="flex justify-between items-center px-2 py-2">
//                 <span className="text-gray-500 font-bold">المجموع الإجمالي:</span>
//                 <span className="text-2xl font-black text-white">
//                   {(selectedMeal.price * userData.quantity).toFixed(2)} <small className="text-sm">JOD</small>
//                 </span>
//               </div>
//             </div>

//             <button 
//               onClick={handleOrder}
//               className="w-full max-w-md mx-auto bg-orange-600 hover:bg-orange-500 text-black font-black py-5 rounded-3xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg shadow-xl shadow-orange-600/10"
//             >
//               تأكيد وطلب الآن
//               <ArrowLeft size={24} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserOrder;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Utensils, Flame, ShoppingBag, Plus, Minus, MessageSquare, X, ArrowLeft } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';
// import { useNavigate, Link } from 'react-router-dom';
// import { useCart } from '../context/CartContext'; // تأكد من صحة المسار

// const UserOrder = () => {
//   const [meals, setMeals] = useState([]);
//   const [selectedMeal, setSelectedMeal] = useState(null);
//   const [orderData, setOrderData] = useState({ quantity: 1, notes: '' });
  
//   const { addToCart, cart } = useCart();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchMeals();
//   }, []);

//   const fetchMeals = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/meals`);
//       setMeals(res.data);
//     } catch (err) {
//       toast.error("فشل في تحميل المنيو");
//     }
//   };

//   // وظيفة الإضافة للسلة
//   const handleAddToCartClick = async () => {
//     const loadingToast = toast.loading('جاري الإضافة للسلة...');
//     try {
//       // نرسل البيانات للـ Context وهو يتكفل بالباقي
//       await addToCart(selectedMeal._id, orderData.quantity, orderData.notes);
      
//       toast.success(`تمت إضافة ${selectedMeal.name.ar} للسلة! 🛒`, { id: loadingToast });
//       setSelectedMeal(null); // إغلاق المودال
//       setOrderData({ quantity: 1, notes: '' }); // ريست للبيانات
//     } catch (err) {
//       toast.error("حدث خطأ أثناء الإضافة", { id: loadingToast });
//     }
//   };

//   const incrementQty = () => setOrderData(prev => ({ ...prev, quantity: prev.quantity + 1 }));
//   const decrementQty = () => {
//     if (orderData.quantity > 1) {
//       setOrderData(prev => ({ ...prev, quantity: prev.quantity - 1 }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050505] text-white font-sans pb-28" dir="rtl">
//       <Toaster position="top-center" />

//       {/* Header */}
//       <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-6">
//         <div className="max-w-2xl mx-auto flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-black italic tracking-tighter text-white">
//               ELITE <span className="text-orange-500">MENU</span>
//             </h1>
//             <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Premium Experience</p>
//           </div>
          
//           {/* أيقونة السلة في الهيدر */}
//           <Link to="/cart" className="relative p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
//             <ShoppingBag className="text-orange-500" size={24} />
//             {cart?.products?.length > 0 && (
//               <span className="absolute -top-1 -right-1 bg-orange-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
//                 {cart.products.length}
//               </span>
//             )}
//           </Link>
//         </div>
//       </header>

//       {/* قائمة الوجبات */}
//       <div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
//         {meals.map((meal) => (
//           <div 
//             key={meal._id}
//             onClick={() => {
//               setSelectedMeal(meal);
//               setOrderData({ quantity: 1, notes: '' });
//             }}
//             className="group flex items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] hover:border-orange-500/50 transition-all cursor-pointer active:scale-95 shadow-sm"
//           >
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-1">
//                 <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors">{meal.name.ar}</h3>
//                 <div className="flex items-center gap-1 text-[10px] text-orange-500/60 bg-orange-500/5 px-2 py-0.5 rounded-full">
//                   <Flame size={10} />
//                   <span>{meal.calories} cal</span>
//                 </div>
//               </div>
//               <p className="text-gray-500 text-xs line-clamp-1 italic mb-3">
//                 {meal.description.ar}
//               </p>
//               <span className="text-xl font-black text-white">{meal.price} <small className="text-[10px] text-gray-400">JOD</small></span>
//             </div>

//             <div className="relative w-24 h-24 bg-white/5 rounded-2xl flex-shrink-0 border border-white/5 overflow-hidden">
//               {meal.image ? (
//                 <img src={meal.image} className="w-full h-full object-cover" alt={meal.name.ar} />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-white/10 italic text-[10px]">No Image</div>
//               )}
//               <div className="absolute bottom-1 left-1 bg-orange-500 text-black p-1 rounded-lg">
//                 <Plus size={16} strokeWidth={4} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* مودال التخصيص والإضافة للسلة */}
//       {selectedMeal && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-end">
//           <div className="bg-[#0c0c0c] w-full rounded-t-[3rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500 relative max-h-[85vh] overflow-y-auto">
            
//             <button onClick={() => setSelectedMeal(null)} className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors">
//               <X size={28} />
//             </button>

//             <div className="mb-8 pt-4 text-center flex flex-col items-center">
//                {selectedMeal.image && <img src={selectedMeal.image} className="w-28 h-28 rounded-3xl object-cover mb-4 border border-white/10" alt="" />}
//                <h3 className="text-2xl font-black">{selectedMeal.name.ar}</h3>
//                <div className="text-gray-400 mt-1">{selectedMeal.price} JOD</div>
//             </div>

//             <div className="space-y-6 mb-8 max-w-md mx-auto">
//               <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
//                 <span className="font-bold">الكمية</span>
//                 <div className="flex items-center gap-6">
//                   <button onClick={decrementQty} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl"><Minus size={18} /></button>
//                   <span className="text-2xl font-black text-orange-500">{orderData.quantity}</span>
//                   <button onClick={incrementQty} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl"><Plus size={18} /></button>
//                 </div>
//               </div>

//               <div className="relative group">
//                 <MessageSquare className="absolute right-4 top-4 text-gray-600 group-focus-within:text-orange-500" size={18} />
//                 <textarea 
//                   className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none text-sm h-24 resize-none" 
//                   placeholder="ملاحظات إضافية..." 
//                   value={orderData.notes}
//                   onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
//                 />
//               </div>
//             </div>

//             <button 
//               onClick={handleAddToCartClick}
//               className="w-full max-w-md mx-auto bg-orange-600 hover:bg-orange-500 text-black font-black py-5 rounded-3xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
//             >
//               إضافة للسلة • {(selectedMeal.price * orderData.quantity).toFixed(2)} JOD
//             </button>
//           </div>
//         </div>
//       )}

//       {/* زر عرض السلة العائم - يظهر عند وجود وجبات */}
//       {cart?.products?.length > 0 && (
//         <div className="fixed bottom-6 left-0 right-0 px-6 z-40">
//            <button 
//             onClick={() => navigate('/cart')}
//             className="w-full max-w-md mx-auto bg-white text-black font-black py-4 rounded-2xl flex justify-between items-center px-8 shadow-2xl animate-in fade-in slide-in-from-bottom"
//            >
//              <div className="flex items-center gap-3">
//                 <ShoppingBag size={20} className="text-orange-600" />
//                 <span>مشاهدة السلة</span>
//              </div>
//              <div className="flex items-center gap-2">
//                 <span className="bg-black text-white px-3 py-1 rounded-full text-xs">{cart.products.length}</span>
//                 <ArrowLeft size={18} />
//              </div>
//            </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserOrder;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Utensils, Flame, ShoppingBag, Plus, Minus, MessageSquare, X, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const UserOrder = () => {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [orderData, setOrderData] = useState({ quantity: 1, notes: '' });
  
  const { addToCart, cart, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeals();
    // جلب السلة عند تحميل الصفحة لضمان مزامنة البيانات من الـ Session
    if (fetchCart) fetchCart();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/meals`);
      setMeals(res.data);
    } catch (err) {
      toast.error("فشل في تحميل المنيو");
    }
  };

  const handleAddToCartClick = async () => {
    // 1. فحص وجود المستخدم في الـ Session قبل البدء
    const sessionUser = sessionStorage.getItem("user");
    if (!sessionUser) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    if (!selectedMeal) return;

    const loadingToast = toast.loading('جاري الإضافة للسلة...');
    try {
      // 2. إرسال الطلب للـ Context
      await addToCart(selectedMeal._id, orderData.quantity, orderData.notes);
      
      // التنبيه بالنجاح موجود أصلاً داخل الـ Context، ولكن نؤكده هنا للإغلاق
      toast.success(`تمت إضافة ${selectedMeal.name.ar} للسلة! 🛒`, { id: loadingToast });
      setSelectedMeal(null); 
      setOrderData({ quantity: 1, notes: '' }); 
    } catch (err) {
      toast.error("حدث خطأ أثناء الإضافة", { id: loadingToast });
    }
  };

  const incrementQty = () => setOrderData(prev => ({ ...prev, quantity: prev.quantity + 1 }));
  const decrementQty = () => {
    if (orderData.quantity > 1) {
      setOrderData(prev => ({ ...prev, quantity: prev.quantity - 1 }));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-28" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-6">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter text-white">
              ELITE <span className="text-orange-500">MENU</span>
            </h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Premium Experience</p>
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
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors">{meal.name?.ar}</h3>
                <div className="flex items-center gap-1 text-[10px] text-orange-500/60 bg-orange-500/5 px-2 py-0.5 rounded-full">
                  <Flame size={10} />
                  <span>{meal.calories} cal</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs line-clamp-1 italic mb-3">
                {meal.description?.ar}
              </p>
              <span className="text-xl font-black text-white">{meal.price} <small className="text-[10px] text-gray-400">JOD</small></span>
            </div>

            <div className="relative w-24 h-24 bg-white/5 rounded-2xl flex-shrink-0 border border-white/5 overflow-hidden">
              {meal.image ? (
                <img src={meal.image} className="w-full h-full object-cover" alt={meal.name?.ar} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10 italic text-[10px]">No Image</div>
              )}
              <div className="absolute bottom-1 left-1 bg-orange-500 text-black p-1 rounded-lg">
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
            
            <button onClick={() => setSelectedMeal(null)} className="absolute top-6 left-6 text-gray-500 hover:text-white">
              <X size={28} />
            </button>

            <div className="mb-8 pt-4 text-center flex flex-col items-center">
               {selectedMeal.image && <img src={selectedMeal.image} className="w-28 h-28 rounded-3xl object-cover mb-4 border border-white/10" alt="" />}
               <h3 className="text-2xl font-black">{selectedMeal.name?.ar}</h3>
               <div className="text-gray-400 mt-1">{selectedMeal.price} JOD</div>
            </div>

            <div className="space-y-6 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="font-bold">الكمية</span>
                <div className="flex items-center gap-6">
                  <button onClick={decrementQty} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl"><Minus size={18} /></button>
                  <span className="text-2xl font-black text-orange-500">{orderData.quantity}</span>
                  <button onClick={incrementQty} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl"><Plus size={18} /></button>
                </div>
              </div>

              <div className="relative group text-right">
                <MessageSquare className="absolute right-4 top-4 text-gray-600 group-focus-within:text-orange-500" size={18} />
                <textarea 
                  className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none text-sm h-24 resize-none text-right" 
                  placeholder="ملاحظات إضافية..." 
                  value={orderData.notes}
                  onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={handleAddToCartClick}
              className="w-full max-w-md mx-auto bg-orange-600 hover:bg-orange-500 text-black font-black py-5 rounded-3xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
            >
              إضافة للسلة • {(selectedMeal.price * orderData.quantity).toFixed(2)} JOD
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
                <span>مشاهدة السلة</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs">{cart.products.length}</span>
                <ArrowLeft size={18} />
             </div>
           </button>
        </div>
      )}
    </div>
  );
};

export default UserOrder;