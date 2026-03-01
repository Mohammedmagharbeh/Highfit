import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast'; // استيراد التوست

export default function AdminSubscriptions() {
  const { t, i18n } = useTranslation();
  
  // --- إعدادات الصوت ---
  const audioURL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'; 
  const audioRef = useRef(new Audio(audioURL));
  
  const [subs, setSubs] = useState([]); 
  const [orders, setOrders] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth().toString());
  const [editingId, setEditingId] = useState(null);

  // --- نظام التنبيه والقبول ---
  const [viewedOrders, setViewedOrders] = useState(JSON.parse(localStorage.getItem('viewedOrders') || '[]'));
  const [hasNew, setHasNew] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [newSub, setNewSub] = useState({
    title: { ar: '', en: '' },
    description: { ar: '', en: '' },
    plans: [{ duration: { ar: '', en: '' }, price: '' }]
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const currentLang = i18n.language.startsWith('ar') ? 'ar' : 'en';

  // جلب الأشهر من ملف الترجمة
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

  useEffect(() => {
    audioRef.current.loop = true;
  }, []);

  const stopAlarm = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const playAlarm = () => {
    if (audioEnabled) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const fetchData = async (isSilent = false) => {
    try {
      const config = getAuthHeader();
      const [resSubs, resOrders] = await Promise.all([
        axios.get(`${BASE_URL}/subscriptions`, config),
        axios.get(`${BASE_URL}/sub-orders/admin/all`, config)
      ]);
      
      const sortedOrders = resOrders.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const unreadOrders = sortedOrders.filter(o => !viewedOrders.includes(o._id));
      
      if (unreadOrders.length > 0) {
        setHasNew(true);
        if (isSilent && !isPlaying) playAlarm();
      } else {
        setHasNew(false);
        stopAlarm();
      }

      setSubs(resSubs.data);
      setOrders(sortedOrders);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 20000);
    return () => clearInterval(interval);
  }, [viewedOrders, audioEnabled]);

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
      resetForm(); fetchData();
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

  const handleAccept = (orderId) => {
    const updatedViewed = [...viewedOrders, orderId];
    setViewedOrders(updatedViewed);
    localStorage.setItem('viewedOrders', JSON.stringify(updatedViewed));
    toast.success(t("added"));
    if (orders.filter(o => !updatedViewed.includes(o._id)).length === 0) stopAlarm();
  };

  return (
    <div className="p-6 md:p-10 bg-black min-h-screen text-white font-sans" dir={i18n.dir()}>
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* التحكم بالصوت */}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3">
        {isPlaying && (
          <button onClick={stopAlarm} className="bg-white text-black px-6 py-3 rounded-full font-black text-[10px] uppercase shadow-2xl animate-pulse">
            {t("chef_dashboard_title")} | {t("stop_alarm") || "إيقاف التنبيه"}
          </button>
        )}
        {!audioEnabled && (
          <button onClick={() => { audioRef.current.play(); audioRef.current.pause(); setAudioEnabled(true); }} className="bg-red-600 px-6 py-3 rounded-full font-black text-[10px] uppercase">
             {t("activate_alerts")} 🔈
          </button>
        )}
      </div>

      {/* تنبيه الطلبات الجديدة */}
      {hasNew && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] bg-orange-600 px-8 py-4 rounded-[2rem] font-black shadow-2xl animate-bounce flex items-center gap-4">
          <span className="text-xs italic">🔔 {t("new_order_alert")}</span>
          <button onClick={() => { setViewedOrders(orders.map(o=>o._id)); stopAlarm(); setHasNew(false); }} className="bg-black/20 px-3 py-1 rounded-full text-[9px] uppercase italic">
            {t("adminJobs.actions.cancel")}
          </button>
        </div>
      )}

      <h1 className="text-4xl font-black text-orange-500 mb-10 italic uppercase tracking-tighter leading-none border-r-8 border-orange-500 pr-5">
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
              <div className="space-y-1">
                <label className="text-[9px] text-white/40 px-2">{t("name_ar")}</label>
                <input value={newSub.title.ar} placeholder={t("placeholder_ar")} className="w-full bg-white/5 p-4 rounded-xl text-xs outline-none focus:border-orange-500 border border-transparent" onChange={e => setNewSub({...newSub, title: {...newSub.title, ar: e.target.value}})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-white/40 px-2">{t("name_en")}</label>
                <input value={newSub.title.en} placeholder={t("placeholder_en")} className="w-full bg-white/5 p-4 rounded-xl text-xs outline-none text-left font-mono focus:border-orange-500 border border-transparent" onChange={e => setNewSub({...newSub, title: {...newSub.title, en: e.target.value}})} required />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-white/30 uppercase">
                <span>{t("prices_durations")}</span>
                <button type="button" onClick={() => setNewSub({...newSub, plans: [...newSub.plans, {duration: {ar:'', en:''}, price:''}]})} className="text-orange-500 hover:underline">+ {t("add_price_option")}</button>
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

          {/* الخطط النشطة */}
          <div className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-white/5">
            <h3 className="text-white/30 font-bold text-[10px] uppercase mb-4 px-2 tracking-[0.2em] italic">{t("active_plans")}</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {subs.map(s => (
                <div key={s._id} className="flex justify-between items-center p-4 bg-white/[0.01] rounded-2xl border border-white/5 group hover:border-orange-500/30 transition-all">
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

        {/* سجل المشتركين */}
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
                    const isNew = !viewedOrders.includes(order._id);
                    return (
                      <tr key={order._id} className={`${isNew ? 'bg-orange-500/[0.05]' : ''} hover:bg-white/[0.02] transition-all`}>
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            {isNew && <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]"></span>}
                            <div>
                              <div className="font-black text-xs text-white uppercase">{order.customerDetails?.fullName}</div>
                              <div className="text-[9px] text-whiteitalic font-mono">{order.customerDetails?.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <div className="text-[10px] font-black text-white/90 uppercase leading-none">{order.planDetails?.title?.[currentLang]}</div>
                          <div className="text-[9px] text-orange-500 font-bold mt-1 uppercase italic tracking-tighter">
                            {order.planDetails?.duration?.[currentLang]} — {order.planDetails?.price} {t("currency")}
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          {isNew ? (
                            <button onClick={() => handleAccept(order._id)} className="bg-orange-600 hover:bg-white hover:text-black text-white text-[9px] px-5 py-2 rounded-full font-black uppercase italic transition-all shadow-xl active:scale-95">
                              {t("accept_btn") || "قبول"}
                            </button>
                          ) : (
                            <span className="text-white text-[9px] font-bold uppercase italic tracking-widest">✅ {t("expired") === "منتهي" ? "تمت المراجعة" : t("expired")}</span>
                          )}
                        </td>
                        <td className="p-5 text-center text-[9px] text-white italic font-mono uppercase">
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