
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminSubscriptions() {
  const { t, i18n } = useTranslation();
  
  // الحالة العامة
  const [subs, setSubs] = useState([]); 
  const [orders, setOrders] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth().toString());
  const [editingId, setEditingId] = useState(null);
  
  // حالة التنبيه - تعتمد على الداتابيز فقط
  const [hasNew, setHasNew] = useState(false);

  const [newSub, setNewSub] = useState({
    title: { ar: '', en: '' },
    description: { ar: '', en: '' },
    plans: [{ duration: { ar: '', en: '' }, price: '' }]
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const currentLang = i18n.language.startsWith('ar') ? 'ar' : 'en';

  const months = [
    { id: 'all', name: t("all_months") },
    ...Array.from({ length: 12 }, (_, i) => ({ 
      id: i.toString(), 
      name: new Date(0, i).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long' }) 
    }))
  ];

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
  });

  // المصدر الوحيد للمعلومات هو السيرفر
  const fetchData = async () => {
    try {
      const config = getAuthHeader();
      const [resSubs, resOrders] = await Promise.all([
        axios.get(`${BASE_URL}/subscriptions`, config),
        axios.get(`${BASE_URL}/sub-orders/admin/all`, config)
      ]);
      
      const allOrders = resOrders.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // المزامنة: التنبيه يظهر إذا وجد أي طلب pending في السيرفر
      const unreadExists = allOrders.some(o => o.status === 'pending');
      setHasNew(unreadExists);

      setSubs(resSubs.data);
      setOrders(allOrders);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    }
  };

  useEffect(() => {
    fetchData();
    // تحديث كل 15 ثانية لمزامنة كل الأجهزة المفتوحة
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (orderId) => {
    const loadingToast = toast.loading(t("processing_order"));
    try {
      // تحديث الحالة في قاعدة البيانات (PATCH)
      await axios.patch(`${BASE_URL}/sub-orders/${orderId}/accept`, {}, getAuthHeader());
      
      toast.success(t("added"), { id: loadingToast });
      fetchData(); // تحديث فوري للجهاز الحالي
    } catch (err) {
      toast.error(t("process_error"), { id: loadingToast });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(t("initializing"));
    try {
      const config = getAuthHeader();
      if (editingId) {
        await axios.put(`${BASE_URL}/subscriptions/${editingId}`, newSub, config);
        toast.success(t("update_success"), { id: loadingToast });
      } else {
        await axios.post(`${BASE_URL}/subscriptions/add`, newSub, config);
        toast.success(t("add_success"), { id: loadingToast });
      }
      resetForm(); 
      fetchData();
    } catch (err) { 
      toast.error(t("process_error"), { id: loadingToast }); 
    }
  };

  const handleDeleteSub = async (id) => {
    if (!window.confirm(t("confirm_delete"))) return;
    try {
      await axios.delete(`${BASE_URL}/subscriptions/${id}`, getAuthHeader());
      toast.success(t("delete_success"));
      fetchData();
    } catch (err) { 
      toast.error(t("delete_error")); 
    }
  };

  const handleEditSub = (sub) => {
    setEditingId(sub._id);
    setNewSub({ title: sub.title, description: sub.description || { ar: '', en: '' }, plans: sub.plans });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewSub({ title: { ar: '', en: '' }, description: { ar: '', en: '' }, plans: [{ duration: { ar: '', en: '' }, price: '' }] });
    setEditingId(null);
  };

  return (
    <div className="p-6 md:p-10 bg-black min-h-screen text-white font-sans" dir={i18n.dir()}>
      <Toaster position="top-center" />
      
      {/* تنبيه المزامنة العلوي (بدون صوت) */}
      {hasNew && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] bg-orange-600 px-8 py-4 rounded-[2rem] font-black shadow-2xl animate-bounce flex items-center gap-4 border border-white/20">
          <span className="text-xs italic">🔔 {t("new_order_alert")}</span>
        </div>
      )}

      <h1 className="text-4xl font-black text-orange-500 mb-10 italic uppercase tracking-tighter border-r-8 border-orange-500 pr-5">
        {t("admin.title")} <span className="text-white italic underline underline-offset-8">{t("admin.console")}</span>
      </h1>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* قسم إدارة الباقات */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-4 shadow-2xl">
            <h2 className="text-orange-500 font-black text-[10px] uppercase italic tracking-[0.2em]">
              {editingId ? t("update_plan") : t("manage_plans")}
            </h2>
            
            <div className="grid grid-cols-2 gap-2">
              <input value={newSub.title.ar} placeholder={t("placeholder_ar")} className="bg-white/5 p-4 rounded-xl text-xs outline-none focus:border-orange-500 border border-transparent" onChange={e => setNewSub({...newSub, title: {...newSub.title, ar: e.target.value}})} required />
              <input value={newSub.title.en} placeholder={t("placeholder_en")} className="bg-white/5 p-4 rounded-xl text-xs outline-none text-left font-mono focus:border-orange-500 border border-transparent" onChange={e => setNewSub({...newSub, title: {...newSub.title, en: e.target.value}})} required />
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-white/30 uppercase">
                <span>{t("prices_durations")}</span>
                <button type="button" onClick={() => setNewSub({...newSub, plans: [...newSub.plans, {duration: {ar:'', en:''}, price:''}]})} className="text-orange-500 hover:underline font-black">+ {t("add_price_option")}</button>
              </div>
              
              {newSub.plans.map((plan, i) => (
                <div key={i} className="bg-white/[0.02] p-4 rounded-xl border border-white/5 relative space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={plan.duration.ar} placeholder={t("duration") + " (Ar)"} className="bg-black/40 p-3 rounded-lg text-[10px]" onChange={e => { const p = [...newSub.plans]; p[i].duration.ar = e.target.value; setNewSub({...newSub, plans: p}); }} required />
                    <input value={plan.duration.en} placeholder={t("duration") + " (En)"} className="bg-black/40 p-3 rounded-lg text-[10px] text-left font-mono" onChange={e => { const p = [...newSub.plans]; p[i].duration.en = e.target.value; setNewSub({...newSub, plans: p}); }} required />
                  </div>
                  <input value={plan.price} placeholder={t("currency")} type="number" className="w-full bg-orange-500/10 p-3 rounded-lg text-xs text-orange-500 font-black text-center" onChange={e => { const p = [...newSub.plans]; p[i].price = e.target.value; setNewSub({...newSub, plans: p}); }} required />
                  {newSub.plans.length > 1 && <button type="button" onClick={() => { const p = [...newSub.plans]; p.splice(i,1); setNewSub({...newSub, plans: p}); }} className="absolute -top-1 -left-1 bg-red-600 w-5 h-5 rounded-full text-[10px]">×</button>}
                </div>
              ))}
            </div>
            <button type="submit" className="w-full bg-orange-500 py-4 rounded-xl font-black uppercase italic tracking-widest hover:bg-white hover:text-black transition-all">
              {editingId ? t("update_plan") : t("save_plan")}
            </button>
          </form>

          <div className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-white/5 shadow-2xl">
            <h3 className="text-white/30 font-bold text-[10px] uppercase mb-4 px-2 tracking-[0.2em] italic">{t("active_plans")}</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {subs.map(s => (
                <div key={s._id} className="flex justify-between items-center p-4 bg-white/[0.01] rounded-2xl border border-white/5 group hover:border-orange-500 transition-all">
                  <div className="font-black text-xs uppercase italic">{s.title[currentLang]}</div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEditSub(s)} className="text-blue-500 text-[10px] font-bold uppercase hover:underline">{t("edit")}</button>
                    <button onClick={() => handleDeleteSub(s._id)} className="text-red-500 text-[10px] font-bold uppercase hover:underline">{t("delete")}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* قسم مراقبة اللاعبين المحدث */}
        <section className="lg:col-span-7">
          <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 bg-white/[0.01]">
              <h2 className="font-black italic text-white/40 text-[10px] uppercase tracking-widest">{t("player_monitoring")}</h2>
              <div className="flex gap-2">
                <select className="bg-white/5 border border-white/10 p-2 rounded-xl text-[10px] text-orange-500 font-bold outline-none" onChange={(e) => setFilterMonth(e.target.value)} value={filterMonth}>
                  {months.map(m => <option key={m.id} value={m.id} className="bg-black text-white">{m.name}</option>)}
                </select>
                <input type="text" placeholder={t("search_placeholder")} className="bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] outline-none focus:border-orange-500 w-32 focus:w-44 transition-all" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right" dir={i18n.dir()}>
                <thead className="bg-white/5 text-orange-500 text-[9px] font-black uppercase italic tracking-widest">
                  <tr>
                    <th className="p-5 text-center">{t("player_data")}</th>
                    <th className="p-5 text-center">{t("plan")}</th>
                    <th className="p-5 text-center">{t("adminJobs.applicants_btn")}</th>
                    <th className="p-5 text-center">{t("date")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.filter(o => {
                    const nameMatch = (o.customerDetails?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
                    const monthMatch = filterMonth === 'all' || new Date(o.createdAt).getMonth().toString() === filterMonth;
                    return nameMatch && monthMatch;
                  }).map(order => {
                    // الاعتماد كلياً على status من الداتابيز
                    const isNew = order.status === 'pending';
                    return (
                      <tr key={order._id} className={`${isNew ? 'bg-orange-500/[0.07]' : ''} hover:bg-white/[0.02] transition-all`}>
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            {isNew && <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]"></span>}
                            <div>
                              <div className="font-black text-[15px] text-white uppercase">{order.customerDetails?.fullName}</div>
                              <div className="text-[15px] text-white italic font-mono">{order.customerDetails?.phone}📞</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <div className="text-[15px] font-black text-white uppercase">{order.planDetails?.title?.[currentLang]}</div>
                          <div className="text-[15px] text-orange-500 font-bold mt-1 italic uppercase tracking-tighter">
                            {order.planDetails?.duration?.[currentLang]} — {order.planDetails?.price} {t("currency")}
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          {isNew ? (
                            <button onClick={() => handleAccept(order._id)} className="bg-orange-600 hover:bg-white hover:text-black text-white text-[9px] px-5 py-2 rounded-full font-black uppercase italic transition-all shadow-xl active:scale-95">
                              {t("accept") || "قبول"}
                            </button>
                          ) : (
                            <span className="text-white text-[15px] font-bold uppercase italic tracking-widest">✅ {t("reviewed")}</span>
                          )}
                        </td>
                        <td className="p-5 text-center text-[15px] text-white italic font-mono uppercase">
                          {new Date(order.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}