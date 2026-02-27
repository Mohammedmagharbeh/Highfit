import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, ChefHat, User, UploadCloud, X, Volume2, 
  Calendar as CalendarIcon, Trash2, Edit3, Clock, Store, Truck, Navigation, Phone, ChevronRight, ChevronLeft 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import notificationSound from '../assets/newOrder.mp3';

const socket = io(import.meta.env.VITE_SOCKET_URL);

const ChefDashboard = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [meals, setMeals] = useState([]);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMealId, setEditingMealId] = useState(null);
  const [soundAllowed, setSoundAllowed] = useState(false);
  const [activeAudio, setActiveAudio] = useState(null);
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const isAr = i18n.language === "ar";

  const [newMeal, setNewMeal] = useState({ 
    nameAr: '', nameEn: '', descAr: '', descEn: '', calories: '', price: '', image: '' 
  });

  const config = { 
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } 
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
      toast.success(isAr ? "تم التأكيد بنجاح ✅" : "Confirmed Successfully ✅");
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
        toast.success(isAr ? 'تم التحديث ✨' : 'Updated ✨');
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/meals`, payload, config);
        toast.success(isAr ? 'تمت الإضافة ✨' : 'Added ✨');
      }
      closeDrawer();
      fetchData();
    } catch (err) { toast.error(isAr ? 'فشلت العملية' : 'Action Failed'); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-8 font-sans flex flex-col lg:flex-row gap-6" dir={isAr ? "rtl" : "ltr"}>
      <Toaster position="top-center" />

      {/* Side Nav */}
      <aside className={`lg:w-20 w-full bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] flex lg:flex-col items-center py-8 gap-8 self-start shadow-2xl`}>
        <ChefHat size={30} className="text-orange-500" />
        <div onClick={openAddMode} className="bg-orange-600 p-2 rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-orange-600/20">
          <Plus size={24} className="text-black" />
        </div>
      </aside>

      <main className="flex-1">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-orange-500">{t("chef_dashboard_title")}</h1>
          <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-2xl flex items-center gap-3">
            <CalendarIcon size={16} className="text-orange-500" />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-white outline-none text-xs [color-scheme:dark]" />
          </div>
        </header>

        {/* Orders List */}
        <div className="space-y-8 mb-20">
          <h2 className="text-gray-500 text-[10px] font-black mb-6 uppercase tracking-[0.3em]">{t("active_orders")}</h2>
          {orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === selectedDate).length > 0 ? (
              orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === selectedDate).map(order => {
                const itemsTotal = order.items?.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0) || 0;
                const totalAmount = Number(order.totalAmount) || 0;
                const deliveryCost = totalAmount - itemsTotal;
                const isPickup = !order.address || order.address === "" || order.address.includes(isAr ? "استلام" : "Pickup");

                return (
                 <div key={order._id} className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 shadow-xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-white/5 pb-6 mb-6">
                      <div className="flex items-center gap-4">
                         <div className="bg-orange-500/10 p-4 rounded-[1.5rem] text-orange-500 font-black flex flex-col items-center">
                            <span className="text-[10px] opacity-50 uppercase">NO.</span>
                            <span className="text-xl">#{order.sequenceNumber}</span>
                         </div>
                         <div>
                            <h3 className="font-black text-2xl text-white italic">{order.userName}</h3>
                            <div className="flex items-center gap-3 mt-1 text-gray-500 font-mono text-sm">
                               <Phone size={14} className="text-orange-500"/> {order.userPhone}
                               <Clock size={14} className="text-orange-500"/> {new Date(order.createdAt).toLocaleTimeString(isAr ? 'ar-JO' : 'en-US')}
                            </div>
                         </div>
                      </div>

                      <div className={`p-4 px-6 rounded-[2rem] border-2 flex items-center gap-3 min-w-[280px] ${isPickup ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-orange-500/5 border-orange-500/20 text-orange-400'}`}>
                           {isPickup ? <Store size={24} /> : <Truck size={24} />}
                           <span className="font-black text-xl text-white uppercase tracking-wider">
                              {isPickup ? (isAr ? "استلام من النادي 🏠" : "Pickup from Club 🏠") : order.address}
                           </span>
                      </div>
                    </div>

                    {/* عرض عناصر الطلب مع الصور */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-[2rem] border border-white/5">
                            {/* صورة الوجبة المطلوبة */}
                            <img 
                              src={item.image || (meals.find(m => (m.name.ar === item.mealName || m.name.en === item.mealName))?.image)} 
                              className="w-16 h-16 rounded-2xl object-cover border border-white/10" 
                              alt={item.mealName}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="bg-orange-500 text-black text-[10px] px-2 py-0.5 rounded-md font-black italic">x{item.quantity}</span>
                                <h4 className="font-bold text-white truncate">{item.mealName}</h4>
                              </div>
                              {item.notes && <p className="text-[10px] text-orange-400 italic mt-1 line-clamp-1">{t("notes")}: {item.notes}</p>}
                            </div>
                            <span className="text-xs text-gray-500 font-mono">{item.price} {t("currency")}</span>
                          </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                       <div className="flex gap-8">
                          <div>
                            <span className="text-[10px] text-gray-500 block uppercase font-black">{t("items")}</span>
                            <span className="text-lg font-bold">{itemsTotal.toFixed(2)} {t("currency")}</span>
                          </div>
                          {!isPickup && (
                            <div className={`${isAr ? 'border-r pr-8' : 'border-l pl-8'} border-white/10`}>
                              <span className="text-[10px] text-orange-500 block uppercase font-black">{t("delivery")}</span>
                              <span className="text-lg font-black text-orange-500">+{deliveryCost.toFixed(2)} {t("currency")}</span>
                            </div>
                          )}
                       </div>
                       <div className="bg-orange-500/5 px-6 py-3 rounded-2xl border border-orange-500/10 text-center">
                          <span className="text-[10px] text-gray-500 block uppercase font-black">{t("total")}</span>
                          <span className="text-3xl font-black text-white italic">{totalAmount.toFixed(2)} {t("currency")}</span>
                       </div>
                    </div>
                 </div>
                );
              })
          ) : (
            <div className="py-20 text-center bg-[#0a0a0a] rounded-[3rem] border border-dashed border-white/10 text-gray-600">
                {t("no_orders")}
            </div>
          )}
        </div>

        {/* Menu Management */}
        <div className="border-t border-white/5 pt-10">
            <h2 className="text-gray-500 text-[10px] font-black mb-6 uppercase tracking-[0.3em]">{t("menu_mgmt")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map(meal => (
                    <div key={meal._id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl flex items-center gap-4 hover:border-orange-500/30 transition-all">
                        <img src={meal.image} className="w-14 h-14 rounded-2xl object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate text-white">{isAr ? meal.name?.ar : meal.name?.en}</h4>
                          <p className="text-orange-500 font-black text-[10px]">{meal.price} {t("currency")}</p>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => { 
                                setNewMeal({ nameAr: meal.name.ar, nameEn: meal.name.en, descAr: meal.description.ar, descEn: meal.description.en, calories: meal.calories, price: meal.price, image: meal.image });
                                setEditingMealId(meal._id); setIsEditing(true); setIsAddMealOpen(true);
                            }} className="p-2 text-gray-600 hover:text-orange-500 transition-colors"><Edit3 size={18}/></button>
                            <button onClick={() => { if(window.confirm(isAr ? "حذف؟" : "Delete?")) axios.delete(`${import.meta.env.VITE_BASE_URL}/meals/${meal._id}`, config).then(fetchData) }} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>

      {/* Popup طلب جديد */}
      {incomingOrder && (
        <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-2 backdrop-blur-md">
          <div className="bg-[#111] border-2 border-orange-500 p-6 rounded-[3rem] max-w-md w-full text-center shadow-[0_0_50px_rgba(249,115,22,0.2)]">
            <div className="bg-orange-500 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce shadow-lg shadow-orange-500/20">
               <Truck size={28} className="text-black" />
            </div>
            <h2 className="text-xl font-black italic text-white uppercase mb-4">{t("new_order_alert")}</h2>
            <div className="space-y-3 mb-6">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <h3 className="text-lg font-bold text-white italic">{incomingOrder.userName}</h3>
                  <p className="text-gray-500 font-mono text-sm">{incomingOrder.userPhone}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-[1.5rem] border border-white/5 max-h-[180px] overflow-y-auto custom-scrollbar">
                {incomingOrder.items && incomingOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/[0.03] p-3 rounded-xl mb-2 last:mb-0 border border-white/5">
                    <div className={`${isAr ? 'text-right' : 'text-left'} flex-1`}>
                      <p className="text-white text-sm font-bold leading-tight">{item.mealName}</p>
                    </div>
                    <div className="bg-orange-500 text-black font-black px-3 py-0.5 rounded-lg text-sm ml-2 mr-2">
                      x{item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-3 rounded-xl border-2 ${(!incomingOrder.address || incomingOrder.address.includes(isAr ? "استلام" : "Pickup")) ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-orange-500/5 border-orange-500/20 text-orange-400'}`}>
                  <p className="font-black text-sm uppercase">
                    {(!incomingOrder.address || incomingOrder.address.includes(isAr ? "استلام" : "Pickup")) 
                      ? (isAr ? "استلام من النادي 🏠" : "Pickup from Club 🏠") 
                      : incomingOrder.address}
                  </p>
              </div>
            </div>
            <button onClick={handleAcceptOrder} className="w-full bg-orange-600 py-4 rounded-2xl font-black text-black text-lg hover:bg-orange-500 transition-all flex items-center justify-center gap-2 active:scale-95">
              {t("accept_btn")} {isAr ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Drawer إضافة الوجبات */}
      {isAddMealOpen && (
        <div className={`fixed inset-0 z-[600] flex ${isAr ? 'justify-start' : 'justify-end'}`}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeDrawer} />
          <aside className={`relative w-full max-w-lg bg-[#0a0a0a] h-full p-8 overflow-y-auto border-white/5 ${isAr ? 'border-l animate-in slide-in-from-left' : 'border-r animate-in slide-in-from-right'}`}>
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black text-orange-500 uppercase italic">{isEditing ? t("edit_meal") : t("add_meal")}</h2>
               <X className="cursor-pointer text-gray-500 hover:text-white" onClick={closeDrawer} size={30} />
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
                <label className="w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden group">
                    {newMeal.image ? <img src={newMeal.image} className="w-full h-full object-cover" alt="" /> : <UploadCloud size={40} className="text-gray-700 group-hover:text-orange-500" />}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                         const reader = new FileReader();
                         reader.onloadend = () => setNewMeal({...newMeal, image: reader.result});
                         reader.readAsDataURL(e.target.files[0]);
                    }} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder={t("meal_name_ar")} value={newMeal.nameAr} onChange={(e)=>setNewMeal({...newMeal, nameAr:e.target.value})} required dir="rtl" />
                  <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder={t("meal_name_en")} value={newMeal.nameEn} onChange={(e)=>setNewMeal({...newMeal, nameEn:e.target.value})} required dir="ltr" />
                </div>
                <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-24 text-sm" placeholder={t("desc_ar")} value={newMeal.descAr} onChange={(e)=>setNewMeal({...newMeal, descAr:e.target.value})} required dir="rtl" />
                <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-24 text-sm" placeholder={t("desc_en")} value={newMeal.descEn} onChange={(e)=>setNewMeal({...newMeal, descEn:e.target.value})} required dir="ltr" />
                <div className="grid grid-cols-2 gap-3">
                    <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder={t("cal")} type="number" value={newMeal.calories} onChange={(e)=>setNewMeal({...newMeal, calories:e.target.value})} required />
                    <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder={t("currency")} type="number" step="0.1" value={newMeal.price} onChange={(e)=>setNewMeal({...newMeal, price:e.target.value})} required />
                </div>
                <button type="submit" className="w-full bg-orange-600 text-black py-6 rounded-2xl font-black uppercase mt-6 shadow-xl hover:bg-orange-500 transition-all">
                  {isEditing ? t("update_btn") : t("create_btn")}
                </button>
             </form>
          </aside>
        </div>
      )}

      {/* Sound Activator */}
      {!soundAllowed && (
        <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center text-center p-6">
          <Volume2 size={80} className="text-orange-500 mb-6 animate-pulse" />
          <button onClick={() => setSoundAllowed(true)} className="bg-orange-600 px-12 py-6 rounded-3xl font-black text-black text-2xl shadow-[0_0_50px_rgba(234,88,12,0.3)]">
            {t("activate_btn")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChefDashboard;











