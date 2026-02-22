import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Plus, Utensils, Phone, ChefHat, User, UploadCloud, X, Volume2, Calendar as CalendarIcon, Trash2, Edit3 
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

  const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  // دالة لإيجاد سعر الوجبة من مصفوفة الوجبات
  const getMealData = (mealName) => {
    return meals.find(m => m.name.ar === mealName) || null;
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

  const handleAcceptOrder = async () => {
    if (!incomingOrder) return;
    try {
      if (activeAudio) { activeAudio.pause(); setActiveAudio(null); }
      await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/confirm-order`, {
        phone: incomingOrder.userPhone || incomingOrder.phone,
        mealName: incomingOrder.mealName
      }, config);
      setIncomingOrder(null);
      toast.success("تم تأكيد الطلب ✅");
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

        {/* الطلبات الحية مع تفاصيل الأسعار */}
        <div className="space-y-6 mb-20">
          {orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === selectedDate).map(order => {
            const mealData = getMealData(order.mealName);
            const unitPrice = mealData ? parseFloat(mealData.price) : 0;
            const totalPrice = unitPrice * order.quantity;

            return (
              <div key={order._id} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden group">
                
                {/* صورة الوجبة */}
                <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/10 shrink-0">
                  <img src={mealData?.image || ''} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                </div>
                
                {/* الكمية */}
                <div className="bg-white/5 px-6 py-4 rounded-3xl text-center border border-white/5">
                  <span className="text-3xl font-black text-orange-500 italic">x{order.quantity}</span>
                </div>

                {/* المعلومات */}
                <div className="flex-1 text-center md:text-right space-y-2">
                  <h3 className="text-2xl font-black text-white">{order.mealName}</h3>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
                      <User size={14} className="text-orange-500"/> {order.userName}
                    </span>
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <Phone size={14} className="text-orange-500"/> {order.userPhone}
                    </span>
                  </div>

                  {/* تفاصيل السعر داخل الكارد */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                    <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      <span className="text-[10px] text-gray-500 ml-1">سعر الوحدة:</span>
                      <span className="text-sm font-bold text-orange-400">{unitPrice} JOD</span>
                    </div>
                    <div className="bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                      <span className="text-[10px] text-orange-500/70 ml-1">المجموع الكلي:</span>
                      <span className="text-sm font-black text-orange-500">{totalPrice.toFixed(2)} JOD</span>
                    </div>
                  </div>

                  {/* ملاحظة الزبون */}
                  {order.notes && (
                    <div className="mt-4 p-3 bg-orange-500/10 border-r-4 border-orange-500 rounded-lg inline-block text-right min-w-[200px]">
                      <span className="text-[10px] text-orange-500/70 block uppercase font-black mb-1">ملاحظة الزبون:</span>
                      <p className="text-orange-100 text-sm font-medium italic">"{order.notes}"</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* المنيو */}
        <div className="border-t border-white/5 pt-10">
            <h2 className="text-gray-500 text-[10px] font-black mb-6 uppercase tracking-[0.3em]">Active Menu Management</h2>
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

      {/* نافذة التنبيه (Dialog) */}
      {incomingOrder && (
        <div className="fixed inset-0 bg-black/95 z-[400] flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="bg-[#111] border-2 border-orange-500 p-8 rounded-[3.5rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in">
            <h2 className="text-2xl font-black mb-8 italic text-white uppercase tracking-wider">NEW ORDER! 🔔</h2>
            
            <div className="space-y-4 mb-10 text-right bg-white/5 p-6 rounded-[2rem] border border-white/5">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-500 text-[10px] font-bold uppercase">Meal:</span>
                <span className="font-black text-orange-500 text-lg">{incomingOrder.mealName}</span>
              </div>

             <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-500 text-[10px] font-bold uppercase">Pricing:</span>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">Unit: {getMealData(incomingOrder.mealName)?.price || 0} JOD</div>
                  <div className="font-black text-white">Total: {( (getMealData(incomingOrder.mealName)?.price || 0) * incomingOrder.quantity ).toFixed(2)} JOD</div>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-500 text-[10px] font-bold uppercase">Quantity:</span>
                <span className="font-black text-white">{incomingOrder.quantity}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-500 text-[10px] font-bold uppercase">Client:</span>
                <span className="font-bold text-white uppercase">{incomingOrder.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[10px] font-bold uppercase">Phone:</span>
                <span className="font-mono text-white tracking-widest text-sm">{incomingOrder.userPhone || incomingOrder.phone}</span>
              </div>
            </div>

            <button onClick={handleAcceptOrder} className="w-full bg-orange-600 py-6 rounded-[2rem] font-black text-black text-xl hover:bg-orange-500 shadow-xl transition-all active:scale-95">
              ACCEPT & SEND SMS
            </button>
          </div>
        </div>
      )}

      {/* Drawer الإضافة والتعديل */}
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

      {/* زر تفعيل الصوت */}
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