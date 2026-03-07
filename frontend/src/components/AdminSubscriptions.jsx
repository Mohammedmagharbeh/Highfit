
//   );
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminSubscriptions() {
  const { t, i18n } = useTranslation();
  
  const [subs, setSubs] = useState([]); 
  const [orders, setOrders] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth().toString());
  const [editingId, setEditingId] = useState(null);
  const [hasNew, setHasNew] = useState(false);

  const durationOptions = [
    { ar: "1 شهر", en: "1 Month" },
    { ar: "3 شهور", en: "3 Months" },
    { ar: "6 شهور", en: "6 Months" },
    { ar: "1 سنة", en: "1 Year" },
    { ar: "أسبوع", en: "1 Week" },
    { ar: "يوم واحد", en: "1 Day" },
  ];

  const [newSub, setNewSub] = useState({
    title: { ar: '', en: '' },
    description: { ar: '', en: '' },
    plans: [{ duration: { ar: durationOptions[0].ar, en: durationOptions[0].en }, price: '' }]
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const currentLang = i18n.language.startsWith('ar') ? 'ar' : 'en';

  const calculateRemainingDays = (durationObj, createdAt) => {
    if (!durationObj || !createdAt) return 0;
    const text = `${durationObj.ar || ''} ${durationObj.en || ''}`.toLowerCase();
    let daysToAdd = 0;
    const extractNumber = (str) => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0]) : 1;
    };
    const num = extractNumber(text);
    if (text.includes('month') || text.includes('شهر')) daysToAdd = num * 30;
    else if (text.includes('year') || text.includes('سنة') || text.includes('عام')) daysToAdd = num * 365;
    else if (text.includes('week') || text.includes('أسبوع')) daysToAdd = num * 7;
    else if (text.includes('day') || text.includes('يوم')) daysToAdd = num;
    else daysToAdd = num || 30;

    const startDate = new Date(createdAt);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + daysToAdd);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const diffTime = endDate.setHours(0,0,0,0) - today;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const months = [
    { id: 'all', name: t("all_months") },
    ...Array.from({ length: 12 }, (_, i) => ({ 
      id: i.toString(), 
      name: new Date(0, i).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long' }) 
    }))
  ];

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } };
      const [resSubs, resOrders] = await Promise.all([
        axios.get(`${BASE_URL}/subscriptions`, config),
        axios.get(`${BASE_URL}/sub-orders/admin/all`, config)
      ]);
      const allOrders = resOrders.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHasNew(allOrders.some(o => o.status === 'pending'));
      setSubs(resSubs.data);
      setOrders(allOrders);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const loadingToast = toast.loading(editingId ? t("processing_order") : t("initializing"));
    try {
      const config = { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } };
      if (editingId) {
        await axios.put(`${BASE_URL}/subscriptions/${editingId}`, newSub, config);
        toast.success(t("success"), { id: loadingToast });
      } else {
        await axios.post(`${BASE_URL}/subscriptions/add`, newSub, config);
        toast.success(t("success"), { id: loadingToast });
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(t("process_error"), { id: loadingToast });
    }
  };

  const handleAccept = async (orderId) => {
    const loadingToast = toast.loading(t("processing_order"));
    try {
      await axios.patch(`${BASE_URL}/sub-orders/${orderId}/accept`, {}, { 
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } 
      });
      toast.success(t("added"), { id: loadingToast });
      fetchData();
    } catch (err) {
      toast.error(t("process_error"), { id: loadingToast });
    }
  };

  const handleDeleteSub = (id) => {
    toast((t_toast) => (
      <div className="flex flex-col gap-4 p-2 min-w-[240px]">
        <span className="text-lg font-bold text-white border-b border-white/10 pb-2">{t("confirm_delete")} ⚠️</span>
        <div className="flex gap-3 mt-2">
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-black text-xs transition-all shadow-lg" 
            onClick={async () => {
              toast.dismiss(t_toast.id);
              const tid = toast.loading(t("processing_order"));
              try {
                await axios.delete(`${BASE_URL}/subscriptions/${id}`, { 
                  headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } 
                });
                toast.success(t("success"), { id: tid });
                fetchData();
              } catch { toast.error(t("process_error"), { id: tid }); }
            }}>{t("delete")}</button>
          <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-bold text-xs transition-all" 
            onClick={() => toast.dismiss(t_toast.id)}>Cancel</button>
        </div>
      </div>
    ), { 
      duration: 8000, 
      position: 'top-center',
      style: { background: '#111', border: '1px solid #f97316', padding: '12px' }
    });
  };

  const handleEditSub = (sub) => {
    setEditingId(sub._id);
    setNewSub({ title: sub.title, description: sub.description || { ar: '', en: '' }, plans: sub.plans });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewSub({ title: { ar: '', en: '' }, description: { ar: '', en: '' }, plans: [{ duration: { ar: durationOptions[0].ar, en: durationOptions[0].en }, price: '' }] });
    setEditingId(null);
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen text-white font-sans" dir={i18n.dir()}>
      <Toaster 
        position="top-center" 
        containerStyle={{ top: 120, zIndex: 999999 }} 
        toastOptions={{
          style: {
            background: '#1a1a1a', color: '#fff', border: '2px solid #f97316', 
            padding: '20px', borderRadius: '15px',
          },
        }}
      />
      
      {hasNew && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999] bg-orange-600 px-6 py-3 rounded-full font-black shadow-2xl animate-bounce border border-white/20">
          <span className="text-[10px] italic">🔔 {t("new_order_alert")}</span>
        </div>
      )}

      <h1 className="text-3xl md:text-5xl font-black text-orange-500 mb-10 italic uppercase tracking-tighter border-s-8 border-orange-500 ps-5">
        {t("admin.title")} <span className="text-white italic underline underline-offset-8">{t("admin.console")}</span>
      </h1>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleSubmit} className="bg-[#0c0c0c] p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-4 shadow-2xl">
            <h2 className="text-orange-500 font-black text-[10px] uppercase italic tracking-[0.2em]">{editingId ? t("update_plan") : t("manage_plans")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input value={newSub.title.ar} placeholder={t("placeholder_ar")} className="bg-white/5 p-4 rounded-xl text-xs outline-none border border-transparent focus:border-orange-500" onChange={e => setNewSub({...newSub, title: {...newSub.title, ar: e.target.value}})} required />
              <input value={newSub.title.en} placeholder={t("placeholder_en")} className="bg-white/5 p-4 rounded-xl text-xs outline-none border border-transparent focus:border-orange-500 text-left font-mono" onChange={e => setNewSub({...newSub, title: {...newSub.title, en: e.target.value}})} required />
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-white/30 uppercase">
                <span>{t("prices_durations")}</span>
                <button type="button" onClick={() => setNewSub({...newSub, plans: [...newSub.plans, {duration: {ar: durationOptions[0].ar, en: durationOptions[0].en}, price:''}]})} className="text-orange-500 hover:underline font-black">+ {t("add_price_option")}</button>
              </div>
              {newSub.plans.map((plan, i) => (
                <div key={i} className="bg-white/[0.02] p-4 rounded-xl border border-white/5 relative space-y-3">
                  <select className="w-full bg-black/40 p-3 rounded-lg text-xs border border-white/10 text-orange-500 font-bold" value={`${plan.duration.ar}|${plan.duration.en}`} onChange={e => { const [ar, en] = e.target.value.split('|'); const p = [...newSub.plans]; p[i].duration = { ar, en }; setNewSub({...newSub, plans: p}); }}>
                    {durationOptions.map((opt, idx) => <option key={idx} value={`${opt.ar}|${opt.en}`} className="bg-black text-white">{currentLang === 'ar' ? opt.ar : opt.en}</option>)}
                  </select>
                  <input value={plan.price} placeholder={t("currency")} type="number" className="w-full bg-orange-500/10 p-3 rounded-lg text-xs text-orange-500 font-black text-center" onChange={e => { const p = [...newSub.plans]; p[i].price = e.target.value; setNewSub({...newSub, plans: p}); }} required />
                  {newSub.plans.length > 1 && <button type="button" onClick={() => { const p = [...newSub.plans]; p.splice(i,1); setNewSub({...newSub, plans: p}); }} className="absolute -top-1 -left-1 bg-red-600 w-5 h-5 rounded-full text-[10px]">×</button>}
                </div>
              ))}
            </div>
            
            <button type="submit" className="w-full bg-orange-500 py-4 rounded-xl font-black uppercase italic tracking-widest hover:bg-white hover:text-black transition-all">
              {editingId ? t("update_plan") : t("save_plan")}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="w-full text-[10px] text-white/20 uppercase font-black py-2 tracking-widest">Cancel</button>}
          </form>

          {/* Active Plans Side List */}
          <div className="bg-[#0c0c0c] p-6 rounded-[2rem] border border-white/5 shadow-2xl">
            <h3 className="text-white/30 font-bold text-[10px] uppercase mb-4 tracking-[0.2em] italic">{t("active_plans")}</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {subs.map(s => (
                <div key={s._id} className="flex justify-between items-center p-4 bg-white/[0.01] rounded-2xl border border-white/5 hover:border-orange-500 transition-all">
                  <div className="font-black text-xs uppercase italic">{s.title[currentLang]}</div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEditSub(s)} className="text-blue-500 text-[10px] font-bold uppercase">{t("edit")}</button>
                    <button onClick={() => handleDeleteSub(s._id)} className="text-red-500 text-[10px] font-bold uppercase">{t("delete")}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monitoring Section */}
        <section className="lg:col-span-8">
          <div className="bg-[#0c0c0c] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.01]">
              <h2 className="font-black italic text-white/40 text-[10px] uppercase tracking-widest">{t("player_monitoring")}</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <select className="bg-white/5 border border-white/10 p-2 rounded-xl text-[10px] text-orange-500 font-bold outline-none flex-1" onChange={(e) => setFilterMonth(e.target.value)} value={filterMonth}>
                  {months.map(m => <option key={m.id} value={m.id} className="bg-black text-white">{m.name}</option>)}
                </select>
                <input type="text" placeholder={t("search_placeholder")} className="bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] outline-none focus:border-orange-500 w-full sm:w-44" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right" dir={i18n.dir()}>
                <thead className="bg-white/5 text-orange-500 text-[9px] font-black uppercase italic tracking-widest border-b border-white/5">
                  <tr>
                    <th className="p-5 text-center">{t("player_data")}</th>
                    <th className="p-5 text-center">{t("plan")}</th>
                    <th className="p-5 text-center">{t("remaining_days")}</th>
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
                    const isNew = order.status === 'pending';
                    const remaining = calculateRemainingDays(order.planDetails?.duration, order.createdAt);
                    return (
                      <tr key={order._id} className={`${isNew ? 'bg-orange-500/[0.07]' : ''} hover:bg-white/[0.02] transition-all`}>
                        <td className="p-5">
                          <div className="font-black text-[15px] text-white uppercase">{order.customerDetails?.fullName}</div>
                          <div className="text-[13px] text-white/ font-mono">📞{order.customerDetails?.phone}</div>
                        </td>
                        <td className="p-5 text-center">
                          <div className="text-[14px] font-black text-white uppercase">{order.planDetails?.title?.[currentLang]}</div>
                          <div className="text-[11px] text-orange-500 font-bold italic">{order.planDetails?.price} JOD</div>
                        </td>
                        <td className="p-5 text-center">
                          {!isNew ? (
                            <span className={`text-[15px] font-black ${remaining <= 5 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                              {remaining > 0 ? `${remaining} ${t("days")}` : 'Expired'}
                            </span>
                          ) : <span className="text-white/10 italic">---</span>}
                        </td>
                        <td className="p-5 text-center">
                          {isNew ? (
                            <button onClick={() => handleAccept(order._id)} className="bg-orange-600 px-5 py-2 rounded-full font-black uppercase italic text-[10px] text-white hover:bg-white hover:text-orange-600 transition-colors">Accept</button>
                          ) : <span className="text-green-500 font-bold uppercase italic text-[12px]">{t("Done")}</span>}
                        </td>
                        <td className="p-5 text-center text-[12px] text-white italic font-mono uppercase">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/5">
              {orders.filter(o => {
                const nameMatch = (o.customerDetails?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
                const monthMatch = filterMonth === 'all' || new Date(o.createdAt).getMonth().toString() === filterMonth;
                return nameMatch && monthMatch;
              }).map(order => {
                const isNew = order.status === 'pending';
                const remaining = calculateRemainingDays(order.planDetails?.duration, order.createdAt);
                return (
                  <div key={order._id} className={`p-5 space-y-4 ${isNew ? 'bg-orange-600/[0.05]' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-black text-white uppercase text-sm tracking-tight">{order.customerDetails?.fullName}</div>
                        <div className="text-xs text-white font-mono mt-1">{order.customerDetails?.phone}</div>
                      </div>
                      <div className="text-[10px] text-white font-mono uppercase italic">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                      <div>
                        <div className="text-[8px] text-white uppercase font-black mb-1">{t("plan")}</div>
                        <div className="text-[11px] font-black text-orange-500 truncate uppercase italic">{order.planDetails?.title?.[currentLang]}</div>
                        <div className="text-[10px] font-bold text-white">{order.planDetails?.price} JOD</div>
                      </div>
                      <div className="text-left">
                        <div className="text-[8px] text-white uppercase font-black mb-1">{t("remaining_days")}</div>
                        {!isNew ? (
                          <div className={`text-[12px] font-black ${remaining <= 5 ? 'text-red-500' : 'text-green-500'}`}>
                            {remaining > 0 ? `${remaining} ${t("days")}` : 'Expired'}
                          </div>
                        ) : <div className="text-[10px] text-white italic">---</div>}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      {isNew ? (
                        <button onClick={() => handleAccept(order._id)} className="w-full bg-orange-600 py-3 rounded-xl font-black uppercase italic text-xs shadow-lg">Accept Order</button>
                      ) : (
                        <div className="text-[10px] font-black text-white italic border border-white px-4 py-1.5 rounded-full uppercase">✅ Done</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {orders.length === 0 && (
              <div className="text-center py-20 text-white italic text-[10px] uppercase tracking-widest">{t("admin_no_data")}</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}