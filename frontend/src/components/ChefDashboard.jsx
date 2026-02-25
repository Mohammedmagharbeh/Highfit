
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, ChefHat, User, UploadCloud, X, Volume2, 
  Calendar as CalendarIcon, Trash2, Edit3, MapPin, Hash, Clock,Store , ShoppingCart, Truck, Navigation, Phone, ChevronRight 
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
      toast.success("تم تأكيد الطلب ✅");
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

      {/* Side Nav الأصلي */}
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

        {/* Orders List المطور */}
        <div className="space-y-8 mb-20">
          {orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === selectedDate).map(order => {
             // حسابات الأسعار الذكية
             const itemsTotal = order.items?.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0) || 0;
             const totalAmount = Number(order.totalAmount) || 0;
             const deliveryCost = totalAmount - itemsTotal;
             
             // فرز النوع
             const isDelivery = order.address && !order.address.includes("استلام");
             const isPickup = !isDelivery;

             return (
              <div key={order._id} className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 shadow-xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-white/5 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                     <div className="bg-orange-500/10 p-4 rounded-[1.5rem] text-orange-500 font-black flex flex-col items-center">
                        <span className="text-[10px] opacity-50 uppercase">Order</span>
                        <span className="text-xl">#{order.sequenceNumber}</span>
                     </div>
                     <div className="text-right">
                        <h3 className="font-black text-2xl text-white">{order.userName}</h3>
                        <div className="flex items-center gap-3 mt-1 text-gray-500 font-mono text-sm">
                           <Phone size={14} className="text-orange-500"/> {order.userPhone}
                           <Clock size={14} className="text-orange-500 mr-2"/> {new Date(order.createdAt).toLocaleTimeString('ar-JO')}
                        </div>
                     </div>
                  </div>

                  {/* بوكس العنوان الجديد */}
                  <div className={`p-4 rounded-[2rem] border-2 flex flex-col gap-2 min-w-[320px] ${isPickup ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-orange-500/5 border-orange-500/20 text-orange-400'}`}>
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-current/10 rounded-xl">
                          {isPickup ? <Store size={20} /> : <Navigation size={20} />}
                       </div>
                       <span className="font-bold text-white">{order.address || 'استلام من المحل'}</span>
                    </div>
                    {!isPickup && (order.addressDetails?.street || order.addressDetails?.building) && (
                      <div className="bg-black/30 p-3 rounded-xl text-xs text-gray-300 leading-relaxed border border-white/5">
                        <span className="text-orange-500 font-black block mb-1">الملاحظات:</span>
                        {order.addressDetails.street && `شارع: ${order.addressDetails.street} `}
                        {order.addressDetails.building && `| بناية: ${order.addressDetails.building} `}
                        {order.addressDetails.apartment && `| شقة: ${order.addressDetails.apartment} `}
                        {order.addressDetails.notes && `| ${order.addressDetails.notes}`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, index) => {
                    const mealData = meals.find(m => String(m._id) === String(item.mealId || item.productId));
                    const imgToShow = mealData?.image || item.mealImage || 'https://via.placeholder.com/150';
                    
                    return (
                      <div key={index} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-[2rem] border border-white/5">
                        <img src={imgToShow} className="w-16 h-16 rounded-2xl object-cover bg-black" alt="" />
                        <div className="flex-1 text-right">
                          <h4 className="font-bold text-white">{item.mealName}</h4>
                          <div className="flex justify-between items-center mt-1">
                             <span className="text-orange-500 font-black">x{item.quantity}</span>
                             <span className="text-xs text-gray-500 font-mono">{item.price} JOD</span>
                          </div>
                          {item.notes && <p className="text-[10px] text-orange-400 mt-1 italic">ملاحظة: {item.notes}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bill Section */}
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                   <div className="flex gap-8">
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 block uppercase">الوجبات</span>
                        <span className="text-lg font-bold">{itemsTotal.toFixed(2)} JOD</span>
                      </div>
                      {isDelivery && deliveryCost > 0 && (
                        <div className="text-right border-r border-white/10 pr-8">
                          <span className="text-[10px] text-orange-500 block uppercase">التوصيل</span>
                          <span className="text-lg font-black text-orange-500">+{deliveryCost.toFixed(2)} JOD</span>
                        </div>
                      )}
                   </div>
                   <div className="text-left bg-orange-500/5 px-6 py-3 rounded-2xl border border-orange-500/10">
                      <span className="text-[10px] text-gray-500 block uppercase">Total Bill</span>
                      <span className="text-3xl font-black text-white italic">{totalAmount.toFixed(2)} JOD</span>
                   </div>
                </div>
              </div>
             );
          })}
        </div>

        {/* Menu Management */}
        <div className="border-t border-white/5 pt-10">
            <h2 className="text-gray-500 text-[10px] font-black mb-6 uppercase tracking-[0.3em]">Menu Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map(meal => (
                    <div key={meal._id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl flex items-center gap-4 hover:border-orange-500/30 transition-all">
                        <img src={meal.image} className="w-14 h-14 rounded-2xl object-cover border border-white/10" />
                        <div className="flex-1 min-w-0 text-right">
                          <h4 className="font-bold text-sm truncate text-white">{meal.name?.ar}</h4>
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

      {/* الـ Popup المطور بالاسم والرقم والوجبات والصور */}
      {incomingOrder && (
        <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="bg-[#111] border-2 border-orange-500 p-8 rounded-[4rem] max-w-lg w-full text-center shadow-[0_0_80px_rgba(249,115,22,0.3)]">
            
            <div className="bg-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg shadow-orange-500/20">
               <Truck size={40} className="text-black" />
            </div>

            <h2 className="text-3xl font-black italic text-white uppercase mb-6">طلب جديد الآن! 🔔</h2>

            <div className="space-y-4 mb-8">
              {/* معلومات الشخص */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center">
                 <div className="flex items-center gap-3 mb-1">
                    <User size={22} className="text-orange-500" />
                    <span className="text-2xl font-black text-white">{incomingOrder.userName}</span>
                 </div>
                 <div className="flex items-center gap-2 text-gray-400 font-mono text-lg">
                    <Phone size={18} className="text-orange-500" />
                    <span>{incomingOrder.userPhone}</span>
                 </div>
              </div>

              {/* وجهة الطلب */}
              <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20">
                 <p className="text-orange-500 font-bold text-lg">{incomingOrder.address || 'استلام من المحل'}</p>
              </div>

              {/* الوجبات بالصور */}
              <div className="bg-black/40 p-5 rounded-[2.5rem] border border-white/5 max-h-[220px] overflow-y-auto custom-scrollbar">
                <span className="text-[10px] text-gray-500 uppercase font-black block mb-4 text-right italic">قائمة الطعام:</span>
                {incomingOrder.items.map((item, idx) => {
                  const mData = meals.find(m => String(m._id) === String(item.mealId || item.productId));
                  return (
                    <div key={idx} className="flex gap-4 items-center text-right border-b border-white/5 pb-3 mb-3 last:border-0">
                      <img src={mData?.image || item.mealImage || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-xl object-cover bg-black" />
                      <div className="flex-1">
                        <p className="text-white font-bold leading-tight">{item.mealName}</p>
                        <div className="flex justify-between items-center mt-1">
                           <span className="text-orange-500 font-black">x{item.quantity}</span>
                           <span className="text-xs text-gray-500 font-mono">{item.price} JOD</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={handleAcceptOrder} className="w-full bg-orange-600 py-7 rounded-[2.5rem] font-black text-black text-2xl hover:bg-orange-500 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
              قبول وبدء التحضير <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}

      {/* Drawer الأصلي لإضافة الوجبات */}
      {isAddMealOpen && (
        <div className="fixed inset-0 z-[600] flex justify-start">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeDrawer} />
          <aside className="relative w-full max-w-lg bg-[#0a0a0a] h-full p-8 overflow-y-auto border-r border-white/5 animate-in slide-in-from-right">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black text-orange-500 uppercase italic">{isEditing ? 'Edit' : 'Add'} Meal</h2>
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
                <div className="grid grid-cols-2 gap-3 text-right">
                  <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder="الاسم (AR)" value={newMeal.nameAr} onChange={(e)=>setNewMeal({...newMeal, nameAr:e.target.value})} required />
                  <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm text-left" placeholder="Name (EN)" value={newMeal.nameEn} onChange={(e)=>setNewMeal({...newMeal, nameEn:e.target.value})} required />
                </div>
                <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-24 text-sm text-right" placeholder="وصف عربي" value={newMeal.descAr} onChange={(e)=>setNewMeal({...newMeal, descAr:e.target.value})} required />
                <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-24 text-sm text-left" placeholder="Description EN" value={newMeal.descEn} onChange={(e)=>setNewMeal({...newMeal, descEn:e.target.value})} required />
                <div className="grid grid-cols-2 gap-3 text-right">
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

      {/* Sound Overlay الأصلي */}
      {!soundAllowed && (
        <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center">
          <Volume2 size={80} className="text-orange-500 mb-6 animate-pulse" />
          <button onClick={() => setSoundAllowed(true)} className="bg-orange-600 px-12 py-6 rounded-3xl font-black text-black text-2xl shadow-[0_0_50px_rgba(234,88,12,0.3)]">ACTIVATE KITCHEN 🔔</button>
        </div>
      )}
    </div>
  );
};

export default ChefDashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Plus, ChefHat, User, UploadCloud, X, Volume2, 
//   Calendar as CalendarIcon, Trash2, Edit3, MapPin, Hash, Clock, Store, ShoppingCart, Truck, Navigation, Phone, ChevronRight, Utensils 
// } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';
// import { io } from 'socket.io-client';
// import notificationSound from '../assets/newOrder.mp3';

// const socket = io(import.meta.env.VITE_SOCKET_URL);

// const ChefDashboard = () => {
//   const [orders, setOrders] = useState([]);
//   const [meals, setMeals] = useState([]);
//   const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'kitchen'
//   const [isAddMealOpen, setIsAddMealOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingMealId, setEditingMealId] = useState(null);
//   const [soundAllowed, setSoundAllowed] = useState(false);
//   const [activeAudio, setActiveAudio] = useState(null);
//   const [incomingOrder, setIncomingOrder] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
//   const [newMeal, setNewMeal] = useState({ 
//     nameAr: '', nameEn: '', descAr: '', descEn: '', calories: '', price: '', image: '' 
//   });

//   const config = { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } };

//   const closeDrawer = () => {
//     setIsAddMealOpen(false);
//     setIsEditing(false);
//     setEditingMealId(null);
//     setNewMeal({ nameAr: '', nameEn: '', descAr: '', descEn: '', calories: '', price: '', image: '' });
//   };

//   const openAddMode = () => {
//     setIsEditing(false);
//     setEditingMealId(null);
//     setNewMeal({ nameAr: '', nameEn: '', descAr: '', descEn: '', calories: '', price: '', image: '' });
//     setIsAddMealOpen(true);
//   };

//   const fetchData = async () => {
//     try {
//       const [resOrders, resMeals] = await Promise.all([
//         axios.get(`${import.meta.env.VITE_BASE_URL}/orders`, config),
//         axios.get(`${import.meta.env.VITE_BASE_URL}/meals`)
//       ]);
//       setOrders(resOrders.data);
//       setMeals(resMeals.data);
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => {
//     fetchData();
//     socket.on("newOrderArrived", (newOrder) => {
//       setOrders((prev) => [newOrder, ...prev]);
//       setIncomingOrder(newOrder); 
//       if (soundAllowed) {
//         const audio = new Audio(notificationSound);
//         audio.loop = true;
//         audio.play().catch(err => console.log(err));
//         setActiveAudio(audio);
//       }
//     });
//     return () => socket.off("newOrderArrived");
//   }, [soundAllowed]);

//   const handleAcceptOrder = async () => {
//     if (!incomingOrder) return;
//     try {
//       if (activeAudio) { activeAudio.pause(); setActiveAudio(null); }
//       const mealNames = incomingOrder.items.map(i => i.mealName).join(', ');
//       await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/confirm-order`, {
//         phone: incomingOrder.userPhone,
//         mealName: mealNames
//       }, config);
//       setIncomingOrder(null);
//       toast.success("تم تأكيد الطلب ✅");
//       fetchData();
//     } catch (err) {
//       setIncomingOrder(null);
//       if (activeAudio) { activeAudio.pause(); setActiveAudio(null); }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       name: { ar: newMeal.nameAr, en: newMeal.nameEn },
//       description: { ar: newMeal.descAr, en: newMeal.descEn },
//       calories: newMeal.calories, price: newMeal.price, image: newMeal.image 
//     };
//     try {
//       if (isEditing) {
//         await axios.put(`${import.meta.env.VITE_BASE_URL}/meals/${editingMealId}`, payload, config);
//         toast.success('تم التحديث ✨');
//       } else {
//         await axios.post(`${import.meta.env.VITE_BASE_URL}/meals`, payload, config);
//         toast.success('تمت الإضافة ✨');
//       }
//       closeDrawer();
//       fetchData();
//     } catch (err) { toast.error('فشلت العملية'); }
//   };

//   return (
//     <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-8 font-sans flex flex-col lg:flex-row gap-6" dir="rtl">
//       <Toaster position="top-center" />

//       {/* Side Nav الأصلي مع لمسة بسيطة */}
//       <aside className="lg:w-20 w-full bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] flex lg:flex-col items-center py-8 gap-8 self-start order-last lg:order-first shadow-2xl">
//         <div className="relative group">
//           <ChefHat size={30} className={activeTab === 'orders' ? 'text-orange-500' : 'text-gray-600'} />
//           <div className="absolute -right-2 top-0 w-1 h-8 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_10px_#ea580c]" />
//         </div>
//         <div onClick={openAddMode} className="bg-orange-600 p-2 rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-orange-600/20">
//           <Plus size={24} className="text-black" />
//         </div>
//       </aside>

//       <main className="flex-1">
//         <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
//           <div className="flex flex-col items-start">
//              <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Kitchen Station</h1>
//              {/* الحركة اللطيفة: الـ Tab Switcher الجديد */}
//              <div className="flex bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/5 shadow-inner">
//                 <button 
//                   onClick={() => setActiveTab('orders')}
//                   className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-orange-600 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
//                 >
//                   <Hash size={14} /> الطلبات الحالية
//                 </button>
//                 <button 
//                   onClick={() => setActiveTab('kitchen')}
//                   className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'kitchen' ? 'bg-orange-600 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
//                 >
//                   <Utensils size={14} /> إدارة المطبخ
//                 </button>
//              </div>
//           </div>
          
//           <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-2xl flex items-center gap-3 self-center md:self-end">
//             <CalendarIcon size={16} className="text-orange-500" />
//             <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-white outline-none text-xs [color-scheme:dark]" />
//           </div>
//         </header>

//         {/* --- المحتوى بناءً على الـ Tab المختار --- */}

//         {activeTab === 'orders' ? (
//           /* Orders List (القسم الأصلي) */
//           <div className="space-y-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === selectedDate).map(order => {
//                 const itemsTotal = order.items?.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0) || 0;
//                 const totalAmount = Number(order.totalAmount) || 0;
//                 const deliveryCost = totalAmount - itemsTotal;
//                 const isDelivery = order.address && !order.address.includes("استلام");
//                 const isPickup = !isDelivery;

//                 return (
//                  <div key={order._id} className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 shadow-xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
//                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-white/5 pb-6 mb-6">
//                      <div className="flex items-center gap-4">
//                         <div className="bg-orange-500/10 p-4 rounded-[1.5rem] text-orange-500 font-black flex flex-col items-center">
//                            <span className="text-[10px] opacity-50 uppercase">Order</span>
//                            <span className="text-xl">#{order.sequenceNumber}</span>
//                         </div>
//                         <div className="text-right">
//                            <h3 className="font-black text-2xl text-white">{order.userName}</h3>
//                            <div className="flex items-center gap-3 mt-1 text-gray-500 font-mono text-sm">
//                               <Phone size={14} className="text-orange-500"/> {order.userPhone}
//                               <Clock size={14} className="text-orange-500 mr-2"/> {new Date(order.createdAt).toLocaleTimeString('ar-JO')}
//                            </div>
//                         </div>
//                      </div>

//                      <div className={`p-4 rounded-[2rem] border-2 flex flex-col gap-2 min-w-[320px] ${isPickup ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-orange-500/5 border-orange-500/20 text-orange-400'}`}>
//                        <div className="flex items-center gap-3">
//                           <div className="p-2 bg-current/10 rounded-xl">
//                              {isPickup ? <Store size={20} /> : <Navigation size={20} />}
//                           </div>
//                           <span className="font-bold text-white">{order.address || 'استلام من المحل'}</span>
//                        </div>
//                        {!isPickup && (order.addressDetails?.street || order.addressDetails?.building) && (
//                          <div className="bg-black/30 p-3 rounded-xl text-xs text-gray-300 leading-relaxed border border-white/5">
//                            <span className="text-orange-500 font-black block mb-1">الملاحظات:</span>
//                            {order.addressDetails.street && `شارع: ${order.addressDetails.street} `}
//                            {order.addressDetails.building && `| بناية: ${order.addressDetails.building} `}
//                            {order.addressDetails.apartment && `| شقة: ${order.addressDetails.apartment} `}
//                            {order.addressDetails.notes && `| ${order.addressDetails.notes}`}
//                          </div>
//                        )}
//                      </div>
//                    </div>

//                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                      {order.items.map((item, index) => {
//                        const mealData = meals.find(m => String(m._id) === String(item.mealId || item.productId));
//                        const imgToShow = mealData?.image || item.mealImage || 'https://via.placeholder.com/150';
//                        return (
//                          <div key={index} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-[2rem] border border-white/5">
//                            <img src={imgToShow} className="w-16 h-16 rounded-2xl object-cover bg-black" alt="" />
//                            <div className="flex-1 text-right">
//                              <h4 className="font-bold text-white">{item.mealName}</h4>
//                              <div className="flex justify-between items-center mt-1">
//                                 <span className="text-orange-500 font-black">x{item.quantity}</span>
//                                 <span className="text-xs text-gray-500 font-mono">{item.price} JOD</span>
//                              </div>
//                              {item.notes && <p className="text-[10px] text-orange-400 mt-1 italic">ملاحظة: {item.notes}</p>}
//                            </div>
//                          </div>
//                        );
//                      })}
//                    </div>

//                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
//                       <div className="flex gap-8">
//                          <div className="text-right">
//                            <span className="text-[10px] text-gray-500 block uppercase">الوجبات</span>
//                            <span className="text-lg font-bold">{itemsTotal.toFixed(2)} JOD</span>
//                          </div>
//                          {isDelivery && deliveryCost > 0 && (
//                            <div className="text-right border-r border-white/10 pr-8">
//                              <span className="text-[10px] text-orange-500 block uppercase">التوصيل</span>
//                              <span className="text-lg font-black text-orange-500">+{deliveryCost.toFixed(2)} JOD</span>
//                            </div>
//                          )}
//                       </div>
//                       <div className="text-left bg-orange-500/5 px-6 py-3 rounded-2xl border border-orange-500/10">
//                          <span className="text-[10px] text-gray-500 block uppercase">Total Bill</span>
//                          <span className="text-3xl font-black text-white italic">{totalAmount.toFixed(2)} JOD</span>
//                       </div>
//                    </div>
//                  </div>
//                 );
//             })}
//           </div>
//         ) : (
//           /* Menu Management (قسم المطبخ الجديد) */
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Kitchen Inventory</h2>
//                 <button onClick={openAddMode} className="text-orange-500 text-xs font-bold border border-orange-500/20 px-4 py-2 rounded-xl hover:bg-orange-500 hover:text-black transition-all">إضافة وجبة جديدة +</button>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {meals.map(meal => (
//                       <div key={meal._id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2.5rem] flex flex-col gap-4 hover:border-orange-500/30 transition-all group relative overflow-hidden">
//                           <div className="absolute top-4 left-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                               <button onClick={() => { 
//                                   setNewMeal({ nameAr: meal.name.ar, nameEn: meal.name.en, descAr: meal.description.ar, descEn: meal.description.en, calories: meal.calories, price: meal.price, image: meal.image });
//                                   setEditingMealId(meal._id); setIsEditing(true); setIsAddMealOpen(true);
//                               }} className="p-3 bg-black/60 backdrop-blur-md rounded-2xl text-white hover:text-orange-500 transition-colors"><Edit3 size={20}/></button>
//                               <button onClick={() => { if(window.confirm("حذف؟")) axios.delete(`${import.meta.env.VITE_BASE_URL}/meals/${meal._id}`, config).then(fetchData) }} className="p-3 bg-black/60 backdrop-blur-md rounded-2xl text-white hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
//                           </div>
//                           <img src={meal.image} className="w-full h-44 rounded-[2rem] object-cover border border-white/10 group-hover:scale-105 transition-transform duration-500" />
//                           <div className="flex-1 text-right mt-2">
//                             <h4 className="font-black text-xl text-white mb-1">{meal.name?.ar}</h4>
//                             <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">{meal.description?.ar}</p>
//                             <div className="flex justify-between items-center pt-4 border-t border-white/5">
//                               <span className="text-orange-500 font-black text-2xl italic">{meal.price} JOD</span>
//                               <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase">
//                                  <Clock size={12}/> {meal.calories} CAL
//                               </div>
//                             </div>
//                           </div>
//                       </div>
//                   ))}
//               </div>
//           </div>
//         )}
//       </main>

//       {/* --- الصندوق الممنوع لمسه (Popup التنبيه) --- */}
//       {incomingOrder && (
//         <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-4 backdrop-blur-xl">
//           <div className="bg-[#111] border-2 border-orange-500 p-8 rounded-[4rem] max-w-lg w-full text-center shadow-[0_0_80px_rgba(249,115,22,0.3)]">
//             <div className="bg-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg shadow-orange-500/20">
//                 <Truck size={40} className="text-black" />
//             </div>
//             <h2 className="text-3xl font-black italic text-white uppercase mb-6">طلب جديد الآن! 🔔</h2>
//             <div className="space-y-4 mb-8 text-right italic">
//               <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center">
//                   <div className="flex items-center gap-3 mb-1">
//                      <User size={22} className="text-orange-500" />
//                      <span className="text-2xl font-black text-white">{incomingOrder.userName}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-400 font-mono text-lg">
//                      <Phone size={18} className="text-orange-500" />
//                      <span>{incomingOrder.userPhone}</span>
//                   </div>
//               </div>
//               <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 text-center">
//                   <p className="text-orange-500 font-bold text-lg">{incomingOrder.address || 'استلام من المحل'}</p>
//               </div>
//               <div className="bg-black/40 p-5 rounded-[2.5rem] border border-white/5 max-h-[220px] overflow-y-auto custom-scrollbar">
//                 <span className="text-[10px] text-gray-500 uppercase font-black block mb-4 text-right italic">قائمة الطعام:</span>
//                 {incomingOrder.items.map((item, idx) => {
//                   const mData = meals.find(m => String(m._id) === String(item.mealId || item.productId));
//                   return (
//                     <div key={idx} className="flex gap-4 items-center text-right border-b border-white/5 pb-3 mb-3 last:border-0">
//                       <img src={mData?.image || item.mealImage || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-xl object-cover bg-black" />
//                       <div className="flex-1">
//                         <p className="text-white font-bold leading-tight">{item.mealName}</p>
//                         <div className="flex justify-between items-center mt-1">
//                             <span className="text-orange-500 font-black">x{item.quantity}</span>
//                             <span className="text-xs text-gray-500 font-mono">{item.price} JOD</span>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             <button onClick={handleAcceptOrder} className="w-full bg-orange-600 py-7 rounded-[2.5rem] font-black text-black text-2xl hover:bg-orange-500 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
//               قبول وبدء التحضير <ChevronRight size={28} />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Drawer إضافة الوجبات الأصلي */}
//       {isAddMealOpen && (
//         <div className="fixed inset-0 z-[600] flex justify-start">
//           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeDrawer} />
//           <aside className="relative w-full max-w-lg bg-[#0a0a0a] h-full p-8 overflow-y-auto border-r border-white/5 animate-in slide-in-from-right">
//              <div className="flex justify-between items-center mb-8">
//                <h2 className="text-2xl font-black text-orange-500 uppercase italic">{isEditing ? 'Edit' : 'Add'} Meal</h2>
//                <X className="cursor-pointer text-gray-500 hover:text-white" onClick={closeDrawer} size={30} />
//              </div>
//              <form onSubmit={handleSubmit} className="space-y-4">
//                 <label className="w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden group">
//                     {newMeal.image ? <img src={newMeal.image} className="w-full h-full object-cover" alt="" /> : <UploadCloud size={40} className="text-gray-700 group-hover:text-orange-500" />}
//                     <input type="file" className="hidden" accept="image/*" onChange={(e) => {
//                          const reader = new FileReader();
//                          reader.onloadend = () => setNewMeal({...newMeal, image: reader.result});
//                          reader.readAsDataURL(e.target.files[0]);
//                     }} />
//                 </label>
//                 <div className="grid grid-cols-2 gap-3 text-right">
//                   <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder="الاسم (AR)" value={newMeal.nameAr} onChange={(e)=>setNewMeal({...newMeal, nameAr:e.target.value})} required />
//                   <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm text-left" placeholder="Name (EN)" value={newMeal.nameEn} onChange={(e)=>setNewMeal({...newMeal, nameEn:e.target.value})} required />
//                 </div>
//                 <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-24 text-sm text-right" placeholder="وصف عربي" value={newMeal.descAr} onChange={(e)=>setNewMeal({...newMeal, descAr:e.target.value})} required />
//                 <textarea className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-24 text-sm text-left" placeholder="Description EN" value={newMeal.descEn} onChange={(e)=>setNewMeal({...newMeal, descEn:e.target.value})} required />
//                 <div className="grid grid-cols-2 gap-3 text-right">
//                     <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder="Calories" type="number" value={newMeal.calories} onChange={(e)=>setNewMeal({...newMeal, calories:e.target.value})} required />
//                     <input className="bg-white/5 border border-white/10 p-5 rounded-2xl text-sm" placeholder="Price" type="number" step="0.1" value={newMeal.price} onChange={(e)=>setNewMeal({...newMeal, price:e.target.value})} required />
//                 </div>
//                 <button type="submit" className="w-full bg-orange-600 text-black py-6 rounded-2xl font-black uppercase mt-6 shadow-xl hover:bg-orange-500 transition-all">
//                   {isEditing ? 'Update Meal' : 'Create Meal'}
//                 </button>
//              </form>
//           </aside>
//         </div>
//       )}

//       {/* Sound Overlay الأصلي */}
//       {!soundAllowed && (
//         <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center">
//           <Volume2 size={80} className="text-orange-500 mb-6 animate-pulse" />
//           <button onClick={() => setSoundAllowed(true)} className="bg-orange-600 px-12 py-6 rounded-3xl font-black text-black text-2xl shadow-[0_0_50px_rgba(234,88,12,0.3)]">ACTIVATE KITCHEN 🔔</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChefDashboard;