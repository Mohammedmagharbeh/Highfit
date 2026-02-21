

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Trash2, Utensils, Phone, Clock, ChefHat, 
  LayoutDashboard, CheckCircle, User, MessageSquare, UploadCloud, X 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ChefDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [meals, setMeals] = useState([]);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({ 
    nameAr: '', nameEn: '', descAr: '', descEn: '', calories: '', price: '', image: '' 
  });

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [resOrders, resMeals] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/orders`, config),
        axios.get(`${import.meta.env.VITE_BASE_URL}/meals`)
      ]);
      setOrders(resOrders.data);
      setMeals(resMeals.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  // --- نظام التنبيه قبل الحذف ---
  const confirmDeleteMeal = (id, mealName) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-gray-800">
          هل أنت متأكد من حذف وجبة <b className="text-red-600">"{mealName}"</b>؟
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              executeDeleteMeal(id);
              toast.dismiss(t.id);
            }}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-black shadow-lg"
          >
            نعم، احذف
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-lg text-xs font-bold"
          >
            تراجع
          </button>
        </div>
      </div>
    ), { duration: 6000, position: 'top-center' });
  };

  const executeDeleteMeal = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/meals/${id}`, config);
      toast.success('تم الحذف من المنيو 🗑️');
      fetchData();
    } catch (err) { toast.error('فشل الحذف'); }
  };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 1.5 * 1024 * 1024) return toast.error("الصورة كبيرة جداً (الحد الأقصى 1.5 ميجا)");
//       const reader = new FileReader();
//       reader.onloadend = () => setNewMeal({ ...newMeal, image: reader.result });
//       reader.readAsDataURL(file);
//     }
//   };

const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // تعديل الحد الأقصى إلى 10 ميجا بايت
      const limit = 10 * 1024 * 1024; 
      
      if (file.size > limit) {
        return toast.error("الصورة كبيرة جداً! الحد الأقصى المسموح به هو 10 ميجا");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMeal({ ...newMeal, image: reader.result });
        // اختياري: تنبيه المستخدم أن الصورة جاهزة للرفع
        toast.success("تم تحميل الصورة، جاهزة للإضافة ✨");
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAddMeal = async (e) => {
    e.preventDefault();
    const payload = {
      name: { ar: newMeal.nameAr, en: newMeal.nameEn },
      description: { ar: newMeal.descAr, en: newMeal.descEn },
      calories: newMeal.calories,
      price: newMeal.price,
      image: newMeal.image 
    };

    const loadingToast = toast.loading('جاري إضافة الوجبة...');
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/meals`, payload, config);
      toast.success('تمت إضافة الوجبة بنجاح! ✨', { id: loadingToast });
      setNewMeal({ nameAr: '', nameEn: '', descAr: '', descEn: '', calories: '', price: '', image: '' });
      setIsAddMealOpen(false);
      fetchData();
    } catch (err) {
      toast.error('خطأ في البيانات أو الصلاحيات', { id: loadingToast });
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/orders/${orderId}`, config);
      toast.success('تم التجهيز والإرسال! 👨‍🍳');
      fetchData();
    } catch (err) { toast.error('حدث خطأ'); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 p-4 lg:p-8 font-sans relative overflow-x-hidden" dir="rtl">
      <Toaster position="top-center" />
      
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-500 ${isAddMealOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsAddMealOpen(false)} 
      />

      {/* لوحة إدارة المنيو (Side Drawer) */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-lg bg-[#0a0a0a] border-l border-white/10 z-50 transform transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] p-6 lg:p-10 shadow-2xl overflow-y-auto ${isAddMealOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black flex items-center gap-3 italic">
              <span className="p-2 bg-orange-600 rounded-xl text-black"><Plus size={24}/></span>
              إدارة المنيو
            </h3>
            <p className="text-[10px] text-gray-500 uppercase mt-2 tracking-widest">Add or Remove Meals</p>
          </div>
          <button onClick={() => setIsAddMealOpen(false)} className="p-3 hover:bg-white/5 rounded-full text-gray-400 transition-colors"><X size={28}/></button>
        </div>

        <form onSubmit={handleAddMeal} className="space-y-5">
            <div className="relative group">
                <input type="file" id="chefUpload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <label htmlFor="chefUpload" className="w-full h-48 bg-white/[0.03] border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 transition-all overflow-hidden">
                    {newMeal.image ? (
                        <img src={newMeal.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Meal Preview" />
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                            <UploadCloud size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest">ارفع صورة الوجبة</span>
                        </div>
                    )}
                </label>
            </div>
            
            <input className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-orange-500 text-sm transition-all" placeholder="اسم الوجبة بالعربي" value={newMeal.nameAr} onChange={(e)=>setNewMeal({...newMeal, nameAr: e.target.value})} required />
            <input className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-orange-500 text-left font-mono text-sm transition-all" placeholder="Meal Name (EN)" value={newMeal.nameEn} dir="ltr" onChange={(e)=>setNewMeal({...newMeal, nameEn: e.target.value})} required />
            
            {/* خانات الوصف (عربي + انجليزي) */}
            <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-orange-500 h-24 resize-none text-sm transition-all" placeholder="وصف الوجبة بالعربي..." value={newMeal.descAr} onChange={(e)=>setNewMeal({...newMeal, descAr: e.target.value})} required />
            <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-orange-500 h-24 resize-none text-sm transition-all text-left font-mono" placeholder="Meal Description (EN)..." value={newMeal.descEn} dir="ltr" onChange={(e)=>setNewMeal({...newMeal, descEn: e.target.value})} required />
            
            <div className="grid grid-cols-2 gap-4">
                <input className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-orange-500 text-sm" placeholder="السعر JOD" type="number" step="0.01" value={newMeal.price} onChange={(e)=>setNewMeal({...newMeal, price: e.target.value})} required />
                <input className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-orange-500 text-sm" placeholder="السعرات" type="number" value={newMeal.calories} onChange={(e)=>setNewMeal({...newMeal, calories: e.target.value})} required />
            </div>

            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-black font-black py-6 rounded-[2.5rem] transition-all active:scale-95 text-[11px] uppercase tracking-widest mt-4 shadow-lg shadow-orange-600/20">
                إضافة للمنيو الآن
            </button>
        </form>

        {/* قائمة الوجبات الحالية للحذف */}
        <div className="mt-12 border-t border-white/5 pt-8">
            <h4 className="text-gray-500 text-[10px] font-black mb-6 uppercase tracking-[0.3em]">الوجبات الحالية ({meals.length})</h4>
            <div className="space-y-3">
                {meals.map(m => (
                <div key={m._id} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl group">
                    <div className="flex items-center gap-4">
                        <img src={m.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold">{m.name?.ar}</span>
                            <span className="text-[10px] text-orange-500/70 font-mono">{m.price} JOD</span>
                        </div>
                    </div>
                    <button onClick={() => confirmDeleteMeal(m._id, m.name?.ar)} className="text-gray-700 hover:text-red-500 p-2 transition-colors">
                      <Trash2 size={18}/>
                    </button>
                </div>
                ))}
            </div>
        </div>
      </aside>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-full">
        
        <aside className="lg:w-24 w-full bg-white/5 border border-white/10 rounded-[2.5rem] flex lg:flex-col items-center py-8 justify-between px-8 lg:px-0 shadow-2xl backdrop-blur-md">
          <ChefHat size={32} className="text-orange-500" />
          <div className="flex lg:flex-col gap-10">
            <LayoutDashboard className="text-orange-500 cursor-pointer" />
            <Utensils className="text-gray-600 hover:text-orange-400 transition-all cursor-pointer" onClick={() => setIsAddMealOpen(true)} />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-yellow-500 border border-white/10 p-1 shadow-inner">
             <div className="w-full h-full rounded-xl bg-[#0a0a0a] flex items-center justify-center text-[10px] font-black">CH</div>
          </div>
        </aside>

        <main className="flex-1 space-y-10">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black italic tracking-tighter text-white uppercase leading-none">Orders Queue</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mt-3">Real-time Kitchen Terminal</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsAddMealOpen(true)}
                className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 hover:border-orange-500 text-white px-8 py-4 rounded-3xl text-[11px] font-black transition-all hover:-translate-y-1 uppercase tracking-widest"
              >
                <Plus size={18} className="text-orange-500" /> إضافة وجبة جديدة
              </button>
              
            </div>
          </header>

          <div className="flex flex-col gap-5 pb-24">
            {orders.length === 0 ? (
                <div className="h-80 flex flex-col items-center justify-center text-gray-700 border-2 border-dashed border-white/5 rounded-[3.5rem]">
                    <Utensils size={64} className="mb-6 opacity-10" />
                    <p className="font-black uppercase tracking-[0.3em] text-xs">لا يوجد طلبات نشطة حالياً</p>
                </div>
            ) : (
                orders.map(order => {
                    const mealInfo = meals.find(m => m.name.ar === order.mealName);
                    return (
                        <div key={order._id} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-5 lg:p-7 flex flex-col md:flex-row items-center gap-6 group hover:border-orange-500/40 transition-all shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/5 blur-[60px] rounded-full pointer-events-none" />

                            <div className="flex flex-row md:flex-col items-center justify-center gap-2 bg-white/5 p-5 rounded-[2rem] min-w-[110px] border border-white/5">
                                <span className="text-4xl font-black text-orange-500 italic leading-none">x{order.quantity || 1}</span>
                                <div className="flex items-center gap-1 text-[9px] text-gray-500 font-black uppercase">
                                    <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-right w-full">
                                <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                                    <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors leading-none">
                                        {order.mealName}
                                    </h4>
                                    {mealInfo?.image && (
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hidden lg:block">
                                            <img src={mealInfo.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                    )}
                                </div>
                                
                                {order.notes ? (
                                    <div className="bg-orange-600/5 border-l-4 border-orange-600 px-5 py-3 rounded-r-2xl inline-block text-right max-w-full">
                                        <p className="text-sm text-gray-400 italic flex items-start gap-3">
                                            <MessageSquare size={16} className="text-orange-500 flex-shrink-0 mt-1" />
                                            "{order.notes}"
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest italic">بدون ملاحظات إضافية</p>
                                )}
                            </div>

                            <div className="hidden lg:flex flex-col gap-3 min-w-[200px] px-8 border-r border-white/5">
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                    <User size={16} className="text-orange-600" /> {order.userName}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-mono text-gray-500" dir="ltr">
                                    <Phone size={16} className="text-orange-600" /> {order.userPhone}
                                </div>
                            </div>

                            <div className="w-full md:w-auto">
                                <button 
                                    onClick={() => handleCompleteOrder(order._id)} 
                                    className="w-full md:w-56 py-6 bg-white/5 hover:bg-orange-600 text-gray-500 hover:text-black rounded-[2rem] font-black transition-all text-[11px] uppercase tracking-[0.2em] border border-white/10 hover:border-orange-600 flex items-center justify-center gap-3"
                                >
                                    <CheckCircle size={22} /> تم التجهيز
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChefDashboard;