

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, ChefHat, User, UploadCloud, X, Volume2, 
  Calendar as CalendarIcon, Trash2, Edit3, MapPin, Hash, Clock, ShoppingCart 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import notificationSound from '../assets/newOrder.mp3';

const socket = io(import.meta.env.VITE_SOCKET_URL);

const ChefDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [meals, setMeals] = useState([]);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMealId, setEditingMealId] = useState(null);
  const [soundAllowed, setSoundAllowed] = useState(false);
  const [activeAudio, setActiveAudio] = useState(null);
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [newMeal, setNewMeal] = useState({ 
    nameAr: '', nameEn: '', descAr: '', descEn: '', calories: '', price: '', image: '' 
  });

  const config = { 
    headers: { 
      Authorization: `Bearer ${sessionStorage.getItem('token')}` 
    } 
  };

  const closeDrawer = () => {
    setIsAddMealOpen(false);
    setIsEditing(false);
    setEditingMealId(null);
    setNewMeal({ nameAr: '', nameEn: '', descAr: '', descEn: '', calories: '', price: '', image: '' });
  };

  const openAddMode = () => {
    setIsEditing(false);
    setEditingMealId(null);
    setNewMeal({ nameAr: '', nameEn: '', descAr: '', descEn: '', calories: '', price: '', image: '' });
    setIsAddMealOpen(true);
  };

  const fetchData = async () => {
    try {
      const [resOrders, resMeals] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/orders`, config),
        axios.get(`${import.meta.env.VITE_BASE_URL}/meals`)
      ]);
      setOrders(resOrders.data);
      setMeals(resMeals.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
    socket.on("newOrderArrived", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      setIncomingOrder(newOrder); 
      if (soundAllowed) {
        const audio = new Audio(notificationSound);
        audio.loop = true;
        audio.play().catch(err => console.log(err));
        setActiveAudio(audio);
      }
    });
    return () => socket.off("newOrderArrived");
  }, [soundAllowed]);

  const handleAcceptOrder = async () => {
    if (!incomingOrder) return;
    try {
      if (activeAudio) { activeAudio.pause(); setActiveAudio(null); }
      const mealNames = incomingOrder.items.map(i => i.mealName).join(', ');
      await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/confirm-order`, {
        phone: incomingOrder.userPhone,
        mealName: mealNames
      }, config);
      
      setIncomingOrder(null);
      toast.success("تم تأكيد الطلب وإرسال SMS ✅");
      fetchData();
    } catch (err) {
      setIncomingOrder(null);
      if (activeAudio) { activeAudio.pause(); setActiveAudio(null); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: { ar: newMeal.nameAr, en: newMeal.nameEn },
      description: { ar: newMeal.descAr, en: newMeal.descEn },
      calories: newMeal.calories, price: newMeal.price, image: newMeal.image 
    };
    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/meals/${editingMealId}`, payload, config);
        toast.success('تم التحديث ✨');
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/meals`, payload, config);
        toast.success('تمت الإضافة ✨');
      }
      closeDrawer();
      fetchData();
    } catch (err) { toast.error('فشلت العملية'); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-8 font-sans flex flex-col lg:flex-row gap-6" dir="rtl">
      <Toaster position="top-center" />

      {/* Side Nav */}
      <aside className="lg:w-20 w-full bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] flex lg:flex-col items-center py-8 gap-8 self-start order-last lg:order-first shadow-2xl">
        <ChefHat size={30} className="text-orange-500" />
        <div onClick={openAddMode} className="bg-orange-600 p-2 rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-orange-600/20">
          <Plus size={24} className="text-black" />
        </div>
      </aside>

      <main className="flex-1">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Kitchen Station</h1>
          <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-2xl flex items-center gap-3">
            <CalendarIcon size={16} className="text-orange-500" />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-white outline-none text-xs [color-scheme:dark]" />
          </div>
        </header>

        {/* Orders List */}
        <div className="space-y-6 mb-20">
          {orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === selectedDate).map(order => (
            <div key={order._id} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-4">
                   <div className="bg-orange-500/10 p-3 rounded-2xl text-orange-500 font-black flex items-center gap-1">
                      <Hash size={16}/> {order.sequenceNumber}
                   </div>
                   <div>
                      <h3 className="font-black text-lg">{order.userName}</h3>
                      <p className="text-xs text-gray-500 font-mono">{order.userPhone}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                   <span className="bg-white/5 px-3 py-1 rounded-full flex items-center gap-1">
                      <MapPin size={12}/> {order.address || 'استلام من المحل'}
                   </span>
                   <span className="bg-white/5 px-3 py-1 rounded-full flex items-center gap-1 font-mono">
                      <Clock size={12}/> {new Date(order.createdAt).toLocaleTimeString('ar-JO')}
                   </span>
                </div>
              </div>

              {/* Items in Order */}
            {/* Items in Order - التعديل المضمون لظهور الصور */}
<div className="space-y-4">
  {order.items.map((item, index) => {
    // 1. محاولة إيجاد بيانات الوجبة من قائمة meals المحملة عند الشيف
    // نبحث بمطابقة الـ ID (نتأكد من تحويلهم لنصوص للمقارنة)
    const mealData = meals.find(m => String(m._id) === String(item.mealId || item.productId));
    
    // 2. إذا لم يجد بالـ ID، نحاول البحث بالاسم (خطة احتياطية قوية)
    const mealByName = !mealData ? meals.find(m => m.name?.ar === item.mealName) : null;

    // 3. تحديد الصورة النهائية (الأولوية لبيانات المنيو الأصلية لأنها الأحدث)
    const imgToShow = mealData?.image || mealByName?.image || item.mealImage || 'https://via.placeholder.com/150?text=No+Image';
    
    return (
      <div key={index} className="flex items-center gap-4 bg-white/5 p-3 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-colors">
        {/* صندوق الصورة */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-black flex-shrink-0">
          <img 
            src={imgToShow} 
            className="w-full h-full object-cover" 
            alt={item.mealName}
            onLoad={() => console.log("Image Loaded:", imgToShow)}
            onError={(e) => { 
              console.log("Image Failed:", imgToShow);
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/150?text=Meal'; 
            }}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-bold text-white text-base block">{item.mealName}</span>
              {item.notes && (
                <span className="text-[10px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                  ملاحظة: {item.notes}
                </span>
              )}
            </div>
            <span className="text-orange-500 font-black text-sm">{item.price} JOD</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400 font-medium">الكمية: <b className="text-orange-500 text-lg">x{item.quantity}</b></span>
          </div>
        </div>
      </div>
    );
  })}
</div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                 <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Total Bill</span>
                 <div className="text-2xl font-black text-white italic">
                    {order.totalAmount?.toFixed(2)} <span className="text-orange-500 text-xs not-italic uppercase">JOD</span>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Menu Management */}
        <div className="border-t border-white/5 pt-10">
            <h2 className="text-gray-500 text-[10px] font-black mb-6 uppercase tracking-[0.3em]">Menu Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map(meal => (
                    <div key={meal._id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl flex items-center gap-4 hover:border-orange-500/30 transition-all">
                        <img src={meal.image} className="w-14 h-14 rounded-2xl object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate text-white">{meal.name.ar}</h4>
                          <p className="text-orange-500 font-black text-[10px]">{meal.price} JOD</p>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => { 
                                setNewMeal({ nameAr: meal.name.ar, nameEn: meal.name.en, descAr: meal.description.ar, descEn: meal.description.en, calories: meal.calories, price: meal.price, image: meal.image });
                                setEditingMealId(meal._id); setIsEditing(true); setIsAddMealOpen(true);
                            }} className="p-2 text-gray-600 hover:text-orange-500 transition-colors"><Edit3 size={18}/></button>
                            <button onClick={() => { if(window.confirm("حذف؟")) axios.delete(`${import.meta.env.VITE_BASE_URL}/meals/${meal._id}`, config).then(fetchData) }} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>

      {/* New Order Notification Pop-up */}
      {incomingOrder && (
        <div className="fixed inset-0 bg-black/95 z-[400] flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="bg-[#111] border-2 border-orange-500 p-8 rounded-[3.5rem] max-w-md w-full text-center shadow-[0_0_50px_rgba(249,115,22,0.2)] animate-in zoom-in">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-orange-500 p-3 rounded-full mb-3 animate-bounce">
                <ShoppingCart size={30} className="text-black" />
              </div>
              <h2 className="text-2xl font-black italic text-white uppercase tracking-wider">طلب جديد الآن! 🔔</h2>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 mb-6 flex items-center gap-4 text-right">
              <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-500"><User size={24} /></div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">العميل</p>
                <h3 className="text-lg font-black text-white">{incomingOrder.userName}</h3>
                <p className="text-sm text-orange-500 font-mono">{incomingOrder.userPhone}</p>
              </div>
            </div>
            
           {/* قائمة الوجبات بالصور داخل التنبيه - نسخة معدلة ومضمونة */}
<div className="bg-white/5 p-4 rounded-[2rem] border border-white/5 mb-6 max-h-[250px] overflow-y-auto space-y-3 custom-scrollbar">
  {incomingOrder.items.map((item, idx) => {
    // البحث عن بيانات الوجبة في الـ meals المحملة عند الشيف لضمان الصورة
    const mData = meals.find(m => 
      String(m._id) === String(item.mealId || item.productId) || 
      m.name?.ar === item.mealName
    );

    // تحديد الصورة: الأولوية للمنيو ثم البيانات القادمة من السوكت
    const popImg = mData?.image || item.mealImage || 'https://via.placeholder.com/150';

    return (
      <div key={idx} className="flex gap-4 items-center text-right border-b border-white/5 pb-3 last:border-0">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10">
          <img 
            src={popImg} 
            className="w-full h-full object-cover" 
            alt={item.mealName} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Meal'; }}
          />
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-bold text-white leading-tight">{item.mealName}</p>
          <div className="flex justify-between items-center mt-1">
             <span className="text-xs text-gray-500 font-black">x{item.quantity}</span>
             <span className="text-xs text-orange-500 font-bold">{item.price} JOD</span>
          </div>
          {item.notes && (
            <p className="text-[9px] text-orange-400 mt-1">ملاحظة: {item.notes}</p>
          )}
        </div>
      </div>
    );
  })}
</div>

            <button onClick={handleAcceptOrder} className="w-full bg-orange-600 py-6 rounded-[2rem] font-black text-black text-xl hover:bg-orange-500 shadow-xl transition-all active:scale-95 uppercase italic">
              Confirm & Process
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Meal Drawer */}
      {isAddMealOpen && (
        <div className="fixed inset-0 z-[250] flex justify-start">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeDrawer} />
          <aside className="relative w-full max-w-lg bg-[#0a0a0a] h-full p-8 overflow-y-auto animate-in slide-in-from-right border-r border-white/5">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black text-orange-500 uppercase italic">{isEditing ? 'Edit' : 'Add'} Meal</h2>
               <X className="cursor-pointer text-gray-500 hover:text-white" onClick={closeDrawer} size={30} />
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
                <label className="w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden group">
                    {newMeal.image ? <img src={newMeal.image} className="w-full h-full object-cover" alt="" /> : <UploadCloud size={40} className="text-gray-700 group-hover:text-orange-500 transition-colors" />}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                         const reader = new FileReader();
                         reader.onloadend = () => setNewMeal({...newMeal, image: reader.result});
                         reader.readAsDataURL(e.target.files[0]);
                    }} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder="الاسم (AR)" value={newMeal.nameAr} onChange={(e)=>setNewMeal({...newMeal, nameAr:e.target.value})} required />
                  <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm text-left" placeholder="Name (EN)" value={newMeal.nameEn} onChange={(e)=>setNewMeal({...newMeal, nameEn:e.target.value})} required />
                </div>
                <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-24 text-sm" placeholder="وصف عربي" value={newMeal.descAr} onChange={(e)=>setNewMeal({...newMeal, descAr:e.target.value})} required />
                <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-24 text-sm text-left font-sans" placeholder="Description EN" value={newMeal.descEn} onChange={(e)=>setNewMeal({...newMeal, descEn:e.target.value})} required />
                <div className="grid grid-cols-2 gap-3">
                    <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder="Calories" type="number" value={newMeal.calories} onChange={(e)=>setNewMeal({...newMeal, calories:e.target.value})} required />
                    <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder="Price" type="number" step="0.1" value={newMeal.price} onChange={(e)=>setNewMeal({...newMeal, price:e.target.value})} required />
                </div>
                <button type="submit" className="w-full bg-orange-600 text-black py-6 rounded-2xl font-black uppercase mt-6 shadow-xl hover:bg-orange-500 transition-all">
                  {isEditing ? 'Update Meal' : 'Create Meal'}
                </button>
             </form>
          </aside>
        </div>
      )}

      {/* Sound Activation Overlay */}
      {!soundAllowed && (
        <div className="fixed inset-0 bg-black z-[500] flex flex-col items-center justify-center">
          <Volume2 size={80} className="text-orange-500 mb-6 animate-pulse" />
          <button onClick={() => setSoundAllowed(true)} className="bg-orange-600 px-12 py-6 rounded-3xl font-black text-black text-2xl shadow-[0_0_50px_rgba(234,88,12,0.3)]">ACTIVATE KITCHEN 🔔</button>
        </div>
      )}
    </div>
  );
};

export default ChefDashboard;