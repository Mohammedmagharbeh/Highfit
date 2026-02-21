
// // // import React, { useState, useEffect } from 'react'; // تصحيح الخطأ: استيراد الـ Hooks
// // // import axios from 'axios';
// // // import { Utensils, Flame, CheckCircle2, ShoppingBag, User, Phone, ArrowLeft, X } from 'lucide-react'; // إضافة أيقونة X
// // // import toast, { Toaster } from 'react-hot-toast'; // استيراد التوست

// // // const UserOrder = () => {
// // //   const [meals, setMeals] = useState([]);
// // //   const [selectedMeal, setSelectedMeal] = useState(null);
// // //   const [userData, setUserData] = useState({ name: '', phone: '' });

// // //   useEffect(() => {
// // //     fetchMeals();
// // //   }, []);

// // //   const fetchMeals = async () => {
// // //     try {
// // //       const res = await axios.get('http://localhost:5000/api/meals');
// // //       setMeals(res.data);
// // //     } catch (err) {
// // //       console.error("Error fetching meals", err);
// // //       toast.error("فشل في تحميل قائمة الطعام");
// // //     }
// // //   };

// // //   const handleOrder = async () => {
// // //     if (!userData.name || !userData.phone) {
// // //       return toast.error("الرجاء إدخال اسمك ورقم هاتفك");
// // //     }

// // //     const loadingToast = toast.loading('جاري إرسال طلبك الفاخر...');
    
// // //     try {
// // //       await axios.post('http://localhost:5000/api/orders', {
// // //         userName: userData.name,
// // //         userPhone: userData.phone,
// // //         mealName: selectedMeal.name.ar
// // //       });
      
// // //       toast.success(`تم طلب ${selectedMeal.name.ar} بنجاح! 🍽️`, { id: loadingToast });
// // //       setSelectedMeal(null);
// // //       setUserData({ name: '', phone: '' });
// // //     } catch (err) {
// // //       toast.error("فشل في إرسال الطلب، حاول مرة أخرى", { id: loadingToast });
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30 pb-32" dir="rtl">
// // //       {/* مكون التوست في أعلى الصفحة */}
// // //       <Toaster position="top-center" reverseOrder={false} />

// // //       {/* Decorative Background */}
// // //       <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
// // //         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full"></div>
// // //         <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-orange-900/10 blur-[100px] rounded-full"></div>
// // //       </div>

// // //       {/* Header Section */}
// // //       <header className="relative z-10 pt-16 pb-12 text-center px-4">
// // //         <div className="inline-block mb-4 p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 animate-pulse">
// // //           <Utensils className="text-orange-500" size={32} />
// // //         </div>
// // //         <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 italic">
// // //           قائمة <span className="text-orange-500">النخبة</span>
// // //         </h1>
// // //         <p className="text-gray-400 max-w-lg mx-auto text-lg font-light leading-relaxed">
// // //           استمتع بتجربة طعام استثنائية، حيث تلتقي الجودة العالية مع المذاق الذي لا يُنسى.
// // //         </p>
// // //       </header>

// // //       {/* Meals Grid */}
// // //       <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// // //         {meals.map((meal) => (
// // //           <div 
// // //             key={meal._id}
// // //             onClick={() => setSelectedMeal(meal)}
// // //             className={`group relative cursor-pointer rounded-[2.5rem] transition-all duration-500 overflow-hidden border ${
// // //               selectedMeal?._id === meal._id 
// // //                 ? 'border-orange-500 bg-orange-500/5 shadow-[0_0_40px_rgba(249,115,22,0.15)]' 
// // //                 : 'border-white/5 bg-[#0c0c0c] hover:border-white/20'
// // //             }`}
// // //           >
// // //             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
// // //             <div className="p-8 relative z-10">
// // //               <div className="flex justify-between items-start mb-6">
// // //                 <div className="bg-orange-500 text-black font-black px-4 py-2 rounded-2xl text-xl shadow-lg shadow-orange-500/20">
// // //                   {meal.price} <span className="text-sm">JOD</span>
// // //                 </div>
// // //                 {selectedMeal?._id === meal._id && (
// // //                   <div className="bg-orange-500/20 p-2 rounded-full text-orange-500 animate-bounce">
// // //                     <CheckCircle2 size={24} />
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               <div className="mb-6">
// // //                 <h3 className="text-3xl font-bold text-white group-hover:text-orange-500 transition-colors mb-2">{meal.name.ar}</h3>
// // //                 <p className="text-gray-500 font-mono text-sm tracking-widest uppercase" dir="ltr">{meal.name.en}</p>
// // //               </div>

// // //               <div className="space-y-4 mb-8">
// // //                 <p className="text-gray-400 leading-relaxed h-12 overflow-hidden line-clamp-2 italic">
// // //                   "{meal.description.ar}"
// // //                 </p>
// // //               </div>

// // //               <div className="flex items-center justify-between pt-6 border-t border-white/5">
// // //                 <div className="flex items-center gap-2 text-orange-500/80 font-bold">
// // //                   <Flame size={18} className="animate-pulse" />
// // //                   <span>{meal.calories} سعرة</span>
// // //                 </div>
// // //                 <div className="text-xs text-gray-600 font-bold uppercase tracking-widest">Premium Choice</div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* Floating Checkout Panel with Close Button */}
// // //       {selectedMeal && (
// // //         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50 animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
// // //           <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-4 md:p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative">
            
// // //             {/* زر الإغلاق الجديد */}
// // //             <button 
// // //               onClick={() => setSelectedMeal(null)}
// // //               className="absolute -top-4 -right-4 bg-orange-600 text-white p-2 rounded-full shadow-xl hover:bg-orange-500 hover:scale-110 transition-all z-50 border-2 border-[#050505]"
// // //             >
// // //               <X size={24} />
// // //             </button>

// // //             <div className="flex flex-col lg:flex-row items-center gap-6">
// // //               <div className="flex-1 flex items-center gap-4 w-full md:w-auto">
// // //                 <div className="hidden md:flex min-w-[64px] h-16 bg-orange-500 items-center justify-center rounded-2xl shadow-lg shadow-orange-500/40">
// // //                   <ShoppingBag className="text-black" size={30} />
// // //                 </div>
// // //                 <div>
// // //                   <p className="text-orange-500 text-[10px] font-black mb-1 uppercase tracking-widest">أنت تطلب الآن</p>
// // //                   <h3 className="text-xl md:text-2xl font-bold truncate max-w-[200px]">{selectedMeal.name.ar}</h3>
// // //                 </div>
// // //               </div>

// // //               <div className="flex-[2] grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
// // //                 <div className="relative">
// // //                   <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
// // //                   <input 
// // //                     className="w-full bg-black/40 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none transition-all placeholder:text-gray-600 text-sm" 
// // //                     placeholder="اسمك الكامل" 
// // //                     value={userData.name}
// // //                     onChange={(e) => setUserData({...userData, name: e.target.value})}
// // //                   />
// // //                 </div>
// // //                 <div className="relative">
// // //                   <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
// // //                   <input 
// // //                     className="w-full bg-black/40 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none transition-all placeholder:text-gray-600 text-sm" 
// // //                     placeholder="رقم الهاتف" 
// // //                     type="tel"
// // //                     value={userData.phone}
// // //                     onChange={(e) => setUserData({...userData, phone: e.target.value})}
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <button 
// // //                 onClick={handleOrder}
// // //                 className="w-full lg:w-auto bg-orange-500 hover:bg-orange-400 text-black font-black py-4 px-12 rounded-2xl transition-all transform active:scale-95 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 whitespace-nowrap group uppercase text-sm"
// // //               >
// // //                 تأكيد الطلب 
// // //                 <ArrowLeft className="group-hover:-translate-x-2 transition-transform" size={20} />
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default UserOrder;

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { Utensils, Flame, CheckCircle2, ShoppingBag, User, Phone, ArrowLeft, X } from 'lucide-react';
// // import toast, { Toaster } from 'react-hot-toast';

// // const UserOrder = () => {
// //   const [meals, setMeals] = useState([]);
// //   const [selectedMeal, setSelectedMeal] = useState(null);
// //   const [userData, setUserData] = useState({ name: '', phone: '' });

// //   useEffect(() => {
// //     fetchMeals();
// //   }, []);

// //   const fetchMeals = async () => {
// //     try {
// //       // استخدام VITE_BASE_URL لجلب الوجبات
// //       const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/meals`);
// //       setMeals(res.data);
// //     } catch (err) {
// //       console.error("Error fetching meals", err);
// //       toast.error("فشل في تحميل قائمة الطعام");
// //     }
// //   };

// //   const handleOrder = async () => {
// //     if (!userData.name || !userData.phone) {
// //       return toast.error("الرجاء إدخال اسمك ورقم هاتفك");
// //     }

// //     const loadingToast = toast.loading('جاري إرسال طلبك الفاخر...');
    
// //     try {
// //       // استخدام VITE_BASE_URL لإرسال الطلب
// //       await axios.post(`${import.meta.env.VITE_BASE_URL}/orders`, {
// //         userName: userData.name,
// //         userPhone: userData.phone,
// //         mealName: selectedMeal.name.ar
// //       });
      
// //       toast.success(`تم طلب ${selectedMeal.name.ar} بنجاح! 🍽️`, { id: loadingToast });
// //       setSelectedMeal(null);
// //       setUserData({ name: '', phone: '' });
// //     } catch (err) {
// //       toast.error("فشل في إرسال الطلب، حاول مرة أخرى", { id: loadingToast });
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30 pb-32" dir="rtl">
// //       <Toaster position="top-center" reverseOrder={false} />

// //       {/* Decorative Background */}
// //       <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
// //         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full"></div>
// //         <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-orange-900/10 blur-[100px] rounded-full"></div>
// //       </div>

// //       {/* Header Section */}
// //       <header className="relative z-10 pt-16 pb-12 text-center px-4">
// //         <div className="inline-block mb-4 p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 animate-pulse">
// //           <Utensils className="text-orange-500" size={32} />
// //         </div>
// //         <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 italic">
// //           قائمة <span className="text-orange-500">النخبة</span>
// //         </h1>
// //         <p className="text-gray-400 max-w-lg mx-auto text-lg font-light leading-relaxed">
// //           استمتع بتجربة طعام استثنائية، حيث تلتقي الجودة العالية مع المذاق الذي لا يُنسى.
// //         </p>
// //       </header>

// //       {/* Meals Grid */}
// //       <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //         {meals.map((meal) => (
// //           <div 
// //             key={meal._id}
// //             onClick={() => setSelectedMeal(meal)}
// //             className={`group relative cursor-pointer rounded-[2.5rem] transition-all duration-500 overflow-hidden border ${
// //               selectedMeal?._id === meal._id 
// //                 ? 'border-orange-500 bg-orange-500/5 shadow-[0_0_40px_rgba(249,115,22,0.15)]' 
// //                 : 'border-white/5 bg-[#0c0c0c] hover:border-white/20'
// //             }`}
// //           >
// //             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
// //             <div className="p-8 relative z-10">
// //               <div className="flex justify-between items-start mb-6">
// //                 <div className="bg-orange-500 text-black font-black px-4 py-2 rounded-2xl text-xl shadow-lg shadow-orange-500/20">
// //                   {meal.price} <span className="text-sm">JOD</span>
// //                 </div>
// //                 {selectedMeal?._id === meal._id && (
// //                   <div className="bg-orange-500/20 p-2 rounded-full text-orange-500 animate-bounce">
// //                     <CheckCircle2 size={24} />
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="mb-6">
// //                 <h3 className="text-3xl font-bold text-white group-hover:text-orange-500 transition-colors mb-2">{meal.name.ar}</h3>
// //                 <p className="text-gray-500 font-mono text-sm tracking-widest uppercase" dir="ltr">{meal.name.en}</p>
// //               </div>

// //               <div className="space-y-4 mb-8">
// //                 <p className="text-gray-400 leading-relaxed h-12 overflow-hidden line-clamp-2 italic">
// //                   "{meal.description.ar}"
// //                 </p>
// //               </div>

// //               <div className="flex items-center justify-between pt-6 border-t border-white/5">
// //                 <div className="flex items-center gap-2 text-orange-500/80 font-bold">
// //                   <Flame size={18} className="animate-pulse" />
// //                   <span>{meal.calories} سعرة</span>
// //                 </div>
// //                 <div className="text-xs text-gray-600 font-bold uppercase tracking-widest">Premium Choice</div>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Floating Checkout Panel */}
// //       {selectedMeal && (
// //         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
// //           <div className="bg-black/60 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-6 md:p-10 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] relative">
            
// //             {/* زر الإغلاق - يظهر في كل الشاشات بوضوح */}
// //             <button 
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 setSelectedMeal(null);
// //               }}
// //               className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-orange-600 text-white p-2 md:p-3 rounded-full shadow-2xl hover:bg-orange-500 hover:scale-110 active:scale-90 transition-all z-[60] border-4 border-[#050505]"
// //               title="إغلاق"
// //             >
// //               <X size={24} strokeWidth={3} />
// //             </button>

// //             <div className="flex flex-col lg:flex-row items-center gap-8">
// //               {/* Meal Info Section */}
// //               <div className="flex items-center gap-5 w-full lg:w-1/3 border-b lg:border-b-0 lg:border-l border-white/10 pb-6 lg:pb-0 lg:pl-8">
// //                 <div className="min-w-[70px] h-[70px] bg-orange-500 flex items-center justify-center rounded-2xl shadow-lg shadow-orange-500/30">
// //                   <ShoppingBag className="text-black" size={32} />
// //                 </div>
// //                 <div>
// //                   <p className="text-orange-500 text-[10px] font-black mb-1 uppercase tracking-[0.2em]">طلبك المختار</p>
// //                   <h3 className="text-xl md:text-2xl font-black truncate text-white">{selectedMeal.name.ar}</h3>
// //                   <p className="text-gray-500 text-xs font-bold">{selectedMeal.price} JOD</p>
// //                 </div>
// //               </div>

// //               {/* Form Section */}
// //               <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
// //                 <div className="relative group">
// //                   <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
// //                   <input 
// //                     className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600 text-sm font-bold" 
// //                     placeholder="أدخل اسمك الكريم" 
// //                     value={userData.name}
// //                     onChange={(e) => setUserData({...userData, name: e.target.value})}
// //                   />
// //                 </div>
// //                 <div className="relative group">
// //                   <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
// //                   <input 
// //                     className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600 text-sm font-bold" 
// //                     placeholder="رقم الهاتف للتواصل" 
// //                     type="tel"
// //                     value={userData.phone}
// //                     onChange={(e) => setUserData({...userData, phone: e.target.value})}
// //                   />
// //                 </div>
// //               </div>

// //               {/* Submit Button */}
// //               <button 
// //                 onClick={handleOrder}
// //                 className="w-full lg:w-auto bg-orange-600 hover:bg-orange-500 text-black font-black py-5 px-10 rounded-[2rem] transition-all transform active:scale-95 shadow-2xl shadow-orange-600/20 flex items-center justify-center gap-4 whitespace-nowrap group text-sm uppercase tracking-widest"
// //               >
// //                 تأكيد الطلب 
// //                 <ArrowLeft className="group-hover:-translate-x-2 transition-transform" size={22} />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserOrder;

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { Utensils, Flame, ShoppingBag, User, Phone, ArrowLeft, X, Plus } from 'lucide-react';
// // import toast, { Toaster } from 'react-hot-toast';

// // const UserOrder = () => {
// //   const [meals, setMeals] = useState([]);
// //   const [selectedMeal, setSelectedMeal] = useState(null);
// //   const [userData, setUserData] = useState({ name: '', phone: '' });

// //   useEffect(() => {
// //     fetchMeals();
// //   }, []);

// //   const fetchMeals = async () => {
// //     try {
// //       const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/meals`);
// //       setMeals(res.data);
// //     } catch (err) {
// //       toast.error("فشل في تحميل المنيو");
// //     }
// //   };

// //   const handleOrder = async () => {
// //     if (!userData.name || !userData.phone) return toast.error("أدخل بياناتك أولاً");
// //     const loadingToast = toast.loading('جاري طلب وجبتك...');
// //     try {
// //       await axios.post(`${import.meta.env.VITE_BASE_URL}/orders`, {
// //         userName: userData.name,
// //         userPhone: userData.phone,
// //         mealName: selectedMeal.name.ar
// //       });
// //       toast.success(`تم طلب ${selectedMeal.name.ar}! 🍽️`, { id: loadingToast });
// //       setSelectedMeal(null);
// //       setUserData({ name: '', phone: '' });
// //     } catch (err) {
// //       toast.error("حدث خطأ", { id: loadingToast });
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#050505] text-white font-sans pb-20" dir="rtl">
// //       <Toaster position="top-center" />

// //       {/* Header الفخم */}
// //       <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-6">
// //         <div className="max-w-2xl mx-auto flex justify-between items-center">
// //           <div>
// //             <h1 className="text-2xl font-black italic tracking-tighter">ELITE <span className="text-orange-500">MENU</span></h1>
// //             <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Premium Experience</p>
// //           </div>
// //           <Utensils className="text-orange-500" size={24} />
// //         </div>
// //       </header>

// //       {/* قائمة الوجبات - ترتيب أفقي (طلبات ستايل) */}
// //       <div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
// //         {meals.map((meal) => (
// //           <div 
// //             key={meal._id}
// //             onClick={() => setSelectedMeal(meal)}
// //             className="group flex items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] hover:border-orange-500/50 transition-all cursor-pointer active:scale-95"
// //           >
// //             {/* جهة اليمين: معلومات الوجبة */}
// //             <div className="flex-1">
// //               <div className="flex items-center gap-2 mb-1">
// //                 <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors">{meal.name.ar}</h3>
// //                 <div className="flex items-center gap-1 text-[10px] text-orange-500/60 bg-orange-500/5 px-2 py-0.5 rounded-full">
// //                   <Flame size={10} />
// //                   <span>{meal.calories} cal</span>
// //                 </div>
// //               </div>
// //               <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3 italic">
// //                 {meal.description.ar}
// //               </p>
// //               <span className="text-xl font-black text-white">{meal.price} <small className="text-[10px] text-gray-500">JOD</small></span>
// //             </div>

// //             {/* جهة اليسار: الصورة وزر الزائد */}
// //             <div className="relative w-24 h-24 bg-white/5 rounded-2xl flex-shrink-0 border border-white/5 flex items-center justify-center">
// //               <ShoppingBag className="text-white/10" size={30} />
              
// //               {/* زر الزائد الصغير */}
// //               <div className="absolute -bottom-2 -left-2 bg-orange-500 text-black p-1.5 rounded-xl shadow-lg shadow-orange-500/20">
// //                 <Plus size={18} strokeWidth={4} />
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Bottom Sheet - نافذة إدخال البيانات */}
// //       {selectedMeal && (
// //         <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end">
// //           <div className="bg-[#0c0c0c] w-full rounded-t-[3rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500 relative">
            
// //             {/* زر الإغلاق X */}
// //             <button 
// //               onClick={() => setSelectedMeal(null)}
// //               className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
// //             >
// //               <X size={30} />
// //             </button>

// //             <div className="mb-10 pt-4 text-center">
// //                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2">تأكيد الطلب</p>
// //                <h3 className="text-3xl font-black">{selectedMeal.name.ar}</h3>
// //                <div className="text-gray-500 mt-2 font-mono">{selectedMeal.price} JOD</div>
// //             </div>

// //             <div className="space-y-4 mb-8 max-w-md mx-auto">
// //               <div className="relative group">
// //                 <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={20} />
// //                 <input 
// //                   className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none transition-all text-sm" 
// //                   placeholder="اسمك الكامل" 
// //                   value={userData.name}
// //                   onChange={(e) => setUserData({...userData, name: e.target.value})}
// //                 />
// //               </div>
// //               <div className="relative group">
// //                 <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={20} />
// //                 <input 
// //                   className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none transition-all text-sm font-mono" 
// //                   placeholder="رقم الهاتف" 
// //                   type="tel"
// //                   value={userData.phone}
// //                   onChange={(e) => setUserData({...userData, phone: e.target.value})}
// //                 />
// //               </div>
// //             </div>

// //             <button 
// //               onClick={handleOrder}
// //               className="w-full max-w-md mx-auto bg-orange-600 hover:bg-orange-500 text-black font-black py-5 rounded-3xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg shadow-xl shadow-orange-600/10"
// //             >
// //               إرسال الطلب الآن
// //               <ArrowLeft size={24} />
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserOrder;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Utensils, Flame, ShoppingBag, User, Phone, ArrowLeft, X, Plus, Minus, MessageSquare } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

// const UserOrder = () => {
//   const [meals, setMeals] = useState([]);
//   const [selectedMeal, setSelectedMeal] = useState(null);
//   // إضافة الكمية والملاحظات لحالة المستخدم
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
//         quantity: userData.quantity, // إرسال الكمية
//         notes: userData.notes        // إرسال الملاحظات
//       });
      
//       toast.success(`تم طلب ${userData.quantity} ${selectedMeal.name.ar}! 🍽️`, { id: loadingToast });
//       setSelectedMeal(null);
//       setUserData({ name: '', phone: '', quantity: 1, notes: '' });
//     } catch (err) {
//       toast.error("حدث خطأ", { id: loadingToast });
//     }
//   };

//   // دوال التحكم بالكمية
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
//               setUserData(prev => ({ ...prev, quantity: 1, notes: '' })); // تصفير الكمية عند اختيار وجبة جديدة
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

//             <div className="relative w-24 h-24 bg-white/5 rounded-2xl flex-shrink-0 border border-white/5 flex items-center justify-center">
//               <ShoppingBag className="text-white/10" size={30} />
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

//             <div className="mb-8 pt-4 text-center">
//                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2">تخصيص الطلب</p>
//                <h3 className="text-3xl font-black">{selectedMeal.name.ar}</h3>
//                <div className="text-gray-400 mt-1">سعر الوجبة: {selectedMeal.price} JOD</div>
//             </div>

//             <div className="space-y-6 mb-8 max-w-md mx-auto">
              
//               {/* واجهة التحكم في الكمية */}
//               <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
//                 <span className="font-bold">الكمية</span>
//                 <div className="flex items-center gap-6">
//                   <button 
//                     onClick={decrementQty}
//                     className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-red-500/20 transition-colors"
//                   >
//                     <Minus size={20} />
//                   </button>
//                   <span className="text-2xl font-black text-orange-500">{userData.quantity}</span>
//                   <button 
//                     onClick={incrementQty}
//                     className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-green-500/20 transition-colors"
//                   >
//                     <Plus size={20} />
//                   </button>
//                 </div>
//               </div>

//               {/* مدخلات المستخدم */}
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
//                   {(selectedMeal.price * userData.quantity).toFixed(2)} JOD
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


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Utensils, Flame, ShoppingBag, User, Phone, ArrowLeft, X, Plus, Minus, MessageSquare } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const UserOrder = () => {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [userData, setUserData] = useState({ name: '', phone: '', quantity: 1, notes: '' });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/meals`);
      setMeals(res.data);
    } catch (err) {
      toast.error("فشل في تحميل المنيو");
    }
  };

  const handleOrder = async () => {
    if (!userData.name || !userData.phone) return toast.error("أدخل بياناتك أولاً");
    
    const loadingToast = toast.loading('جاري طلب وجبتك...');
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/orders`, {
        userName: userData.name,
        userPhone: userData.phone,
        mealName: selectedMeal.name.ar,
        quantity: userData.quantity,
        notes: userData.notes
      });
      
      toast.success(`تم طلب ${userData.quantity} ${selectedMeal.name.ar}! 🍽️`, { id: loadingToast });
      setSelectedMeal(null);
      setUserData({ name: '', phone: '', quantity: 1, notes: '' });
    } catch (err) {
      toast.error("حدث خطأ", { id: loadingToast });
    }
  };

  const incrementQty = () => setUserData(prev => ({ ...prev, quantity: prev.quantity + 1 }));
  const decrementQty = () => {
    if (userData.quantity > 1) {
      setUserData(prev => ({ ...prev, quantity: prev.quantity - 1 }));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20" dir="rtl">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-6">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter">ELITE <span className="text-orange-500">MENU</span></h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Premium Experience</p>
          </div>
          <Utensils className="text-orange-500" size={24} />
        </div>
      </header>

      {/* قائمة الوجبات */}
      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
        {meals.map((meal) => (
          <div 
            key={meal._id}
            onClick={() => {
              setSelectedMeal(meal);
              setUserData(prev => ({ ...prev, quantity: 1, notes: '' }));
            }}
            className="group flex items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] hover:border-orange-500/50 transition-all cursor-pointer active:scale-95"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold group-hover:text-orange-500 transition-colors">{meal.name.ar}</h3>
                <div className="flex items-center gap-1 text-[10px] text-orange-500/60 bg-orange-500/5 px-2 py-0.5 rounded-full">
                  <Flame size={10} />
                  <span>{meal.calories} cal</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3 italic">
                {meal.description.ar}
              </p>
              <span className="text-xl font-black text-white">{meal.price} <small className="text-[10px] text-gray-500">JOD</small></span>
            </div>

            {/* عرض صورة الوجبة المرفوعة من الشيف */}
            <div className="relative w-24 h-24 bg-white/5 rounded-2xl flex-shrink-0 border border-white/5 overflow-hidden flex items-center justify-center">
              {meal.image ? (
                <img src={meal.image} className="w-full h-full object-cover" alt={meal.name.ar} />
              ) : (
                <ShoppingBag className="text-white/10" size={30} />
              )}
              <div className="absolute -bottom-2 -left-2 bg-orange-500 text-black p-1.5 rounded-xl shadow-lg">
                <Plus size={18} strokeWidth={4} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sheet المطور */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-end">
          <div className="bg-[#0c0c0c] w-full rounded-t-[3rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-500 relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setSelectedMeal(null)}
              className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={30} />
            </button>

            <div className="mb-8 pt-4 text-center flex flex-col items-center">
               {/* عرض صورة الوجبة داخل الـ Bottom Sheet */}
               {selectedMeal.image && (
                 <img src={selectedMeal.image} className="w-32 h-32 rounded-3xl object-cover mb-4 border border-white/10 shadow-2xl" alt="" />
               )}
               <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2">تخصيص الطلب</p>
               <h3 className="text-3xl font-black">{selectedMeal.name.ar}</h3>
               <div className="text-gray-400 mt-1">سعر الوجبة: {selectedMeal.price} JOD</div>
            </div>

            <div className="space-y-6 mb-8 max-w-md mx-auto">
              
              {/* واجهة التحكم في الكمية */}
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="font-bold">الكمية</span>
                <div className="flex items-center gap-6">
                  <button onClick={decrementQty} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-red-500/20 transition-colors">
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-black text-orange-500">{userData.quantity}</span>
                  <button onClick={incrementQty} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-green-500/20 transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* مدخلات المستخدم - الحقول التي طلبت عدم لمسها */}
              <div className="space-y-3">
                <div className="relative group">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500" size={18} />
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none text-sm" 
                    placeholder="اسمك الكامل" 
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500" size={18} />
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none text-sm font-mono" 
                    placeholder="رقم الهاتف" 
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <MessageSquare className="absolute right-4 top-4 text-gray-600 group-focus-within:text-orange-500" size={18} />
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl focus:border-orange-500 outline-none text-sm h-24 resize-none" 
                    placeholder="ملاحظات إضافية (اختياري)..." 
                    value={userData.notes}
                    onChange={(e) => setUserData({...userData, notes: e.target.value})}
                  />
                </div>
              </div>

              {/* المجموع النهائي */}
              <div className="flex justify-between items-center px-2 py-2">
                <span className="text-gray-500 font-bold">المجموع الإجمالي:</span>
                <span className="text-2xl font-black text-white">
                  {(selectedMeal.price * userData.quantity).toFixed(2)} <small className="text-sm">JOD</small>
                </span>
              </div>
            </div>

            <button 
              onClick={handleOrder}
              className="w-full max-w-md mx-auto bg-orange-600 hover:bg-orange-500 text-black font-black py-5 rounded-3xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg shadow-xl shadow-orange-600/10"
            >
              تأكيد وطلب الآن
              <ArrowLeft size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;