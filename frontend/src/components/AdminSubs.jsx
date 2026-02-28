import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

export default function AdminSubscriptions() {
  const { t, i18n } = useTranslation();
  const [subs, setSubs] = useState([]); 
  const [orders, setOrders] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [editingId, setEditingId] = useState(null);

  const [newSub, setNewSub] = useState({
    title: { ar: '', en: '' },
    description: { ar: '', en: '' },
    plans: [{ duration: { ar: '', en: '' }, price: '' }]
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // تحديد اللغة الحالية بشكل أدق
  const currentLang = i18n.language.startsWith('ar') ? 'ar' : 'en';

  const months = [
    { id: 'all', name: currentLang === 'ar' ? "كل الأشهر" : "All Months" },
    ...Array.from({ length: 12 }, (_, i) => ({ 
      id: i.toString(), 
      name: new Date(0, i).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long' }) 
    }))
  ];

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
  });

  const fetchData = async () => {
    try {
      const config = getAuthHeader();
      const [resSubs, resOrders] = await Promise.all([
        axios.get(`${BASE_URL}/subscriptions`, config),
        axios.get(`${BASE_URL}/sub-orders/admin/all`, config)
      ]);
      setSubs(resSubs.data);
      setOrders(resOrders.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthHeader();
      if (editingId) {
        await axios.put(`${BASE_URL}/subscriptions/${editingId}`, newSub, config);
        alert(currentLang === 'ar' ? "تم التعديل بنجاح" : "Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/subscriptions/add`, newSub, config);
        alert(currentLang === 'ar' ? "تمت الإضافة بنجاح" : "Added Successfully");
      }
      resetForm();
      fetchData();
    } catch (err) { alert("Error"); }
  };

  const resetForm = () => {
    setNewSub({ title: { ar: '', en: '' }, description: { ar: '', en: '' }, plans: [{ duration: { ar: '', en: '' }, price: '' }] });
    setEditingId(null);
  };

  const handleEdit = (sub) => {
    setEditingId(sub._id);
    setNewSub({
      title: sub.title,
      description: sub.description || { ar: '', en: '' },
      plans: sub.plans
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSub = async (id) => {
    if (!window.confirm(currentLang === 'ar' ? "هل أنت متأكد؟" : "Are you sure?")) return;
    try {
      await axios.delete(`${BASE_URL}/subscriptions/${id}`, getAuthHeader());
      fetchData();
    } catch (err) { alert("Delete Error"); }
  };

  const exportToExcel = () => {
    const filtered = orders.filter(o => {
      const nameMatch = (o.customerDetails?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const monthMatch = filterMonth === 'all' || new Date(o.createdAt).getMonth().toString() === filterMonth;
      return nameMatch && monthMatch;
    });
    const data = filtered.map(o => ({
      [currentLang === 'ar' ? "اللاعب" : "Player"]: o.customerDetails?.fullName,
      [currentLang === 'ar' ? "الباقة" : "Subscription"]: o.planDetails?.title?.[currentLang],
      [currentLang === 'ar' ? "المدة" : "Duration"]: o.planDetails?.duration?.[currentLang],
      [currentLang === 'ar' ? "السعر" : "Price"]: o.planDetails?.price + " JOD",
      [currentLang === 'ar' ? "التاريخ" : "Date"]: new Date(o.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `HighFit_Report_${currentLang}.xlsx`);
  };

  return (
    <div className="p-6 md:p-10 bg-black min-h-screen text-white font-sans" dir={i18n.dir()}>
      <h1 className="text-3xl font-black text-orange-500 mb-10 italic border-r-4 border-orange-500 pr-4 uppercase tracking-tighter">
        HIGH FIT <span className="text-white underline decoration-orange-500 underline-offset-8 italic">DASHBOARD</span>
      </h1>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* الفورم وإدارة الباقات */}
        <div className="lg:col-span-4 space-y-8">
          <form onSubmit={handleSubmit} className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-2xl">
            <h2 className="text-white/40 font-bold text-[10px] uppercase tracking-[0.3em]">
              {editingId ? (currentLang === 'ar' ? "تحرير الباقة" : "Edit Plan") : (currentLang === 'ar' ? "إضافة باقة" : "Add Plan")}
            </h2>
            
            <div className="grid grid-cols-2 gap-2">
              <input value={newSub.title.ar} placeholder="العنوان (عربي)" className="bg-white/5 p-3 rounded-xl text-xs border border-white/10 outline-none focus:border-orange-500" onChange={e => setNewSub({...newSub, title: {...newSub.title, ar: e.target.value}})} required />
              <input value={newSub.title.en} placeholder="Title (EN)" className="bg-white/5 p-3 rounded-xl text-xs border border-white/10 outline-none focus:border-orange-500 font-mono text-left" onChange={e => setNewSub({...newSub, title: {...newSub.title, en: e.target.value}})} required />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <textarea value={newSub.description.ar} placeholder="الوصف (عربي)" className="bg-white/5 p-3 rounded-xl text-xs border border-white/10 h-20 outline-none" onChange={e => setNewSub({...newSub, description: {...newSub.description, ar: e.target.value}})} />
              <textarea value={newSub.description.en} placeholder="Desc (EN)" className="bg-white/5 p-3 rounded-xl text-xs border border-white/10 h-20 outline-none text-left font-mono" onChange={e => setNewSub({...newSub, description: {...newSub.description, en: e.target.value}})} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] text-orange-500 font-black uppercase italic">{currentLang === 'ar' ? "الخطط والأسعار" : "Plans & Prices"}</label>
              {newSub.plans.map((plan, i) => (
                <div key={i} className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={plan.duration.ar} placeholder="المدة (عربي)" className="bg-black/40 p-2 rounded-lg text-[10px]" onChange={e => { const p = [...newSub.plans]; p[i].duration.ar = e.target.value; setNewSub({...newSub, plans: p}); }} required />
                    <input value={plan.duration.en} placeholder="Duration (EN)" className="bg-black/40 p-2 rounded-lg text-[10px] text-left font-mono" onChange={e => { const p = [...newSub.plans]; p[i].duration.en = e.target.value; setNewSub({...newSub, plans: p}); }} required />
                  </div>
                  <input value={plan.price} placeholder="JOD" type="number" className="w-full bg-orange-500/10 p-2 rounded-lg text-xs text-orange-500 font-black text-center" onChange={e => { const p = [...newSub.plans]; p[i].price = e.target.value; setNewSub({...newSub, plans: p}); }} required />
                </div>
              ))}
              <button type="button" onClick={() => setNewSub({...newSub, plans: [...newSub.plans, {duration: {ar:'', en:''}, price:''}]})} className="text-[10px] text-orange-500 font-bold hover:underline">+ {currentLang === 'ar' ? "إضافة خطة" : "Add Plan"}</button>
            </div>

            <button type="submit" className="w-full bg-orange-500 py-4 rounded-2xl font-black uppercase italic hover:bg-white hover:text-black transition-all shadow-lg">
              {editingId ? (currentLang === 'ar' ? "تحديث" : "Update") : (currentLang === 'ar' ? "حفظ" : "Save")}
            </button>
          </form>

          {/* القائمة المصغرة للباقات */}
          <div className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-white/5">
            <h2 className="text-white/30 font-bold text-[10px] uppercase mb-4 italic tracking-[0.2em]">{currentLang === 'ar' ? "الباقات الحالية" : "Current Subs"}</h2>
            <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar">
              {subs.map(sub => (
                <div key={sub._id} className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-orange-500/40 transition-all">
                  <span className="text-[11px] font-bold">{sub.title?.[currentLang]}</span>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(sub)} className="text-blue-500 text-[10px] font-black uppercase tracking-tighter hover:underline italic">Edit</button>
                    <button onClick={() => handleDeleteSub(sub._id)} className="text-red-500 text-[10px] font-black uppercase tracking-tighter hover:underline italic">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* جدول سجل اللاعبين */}
        <section className="lg:col-span-8">
          <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <h2 className="font-black italic text-white/50 text-sm uppercase tracking-tighter">{currentLang === 'ar' ? "سجل اللاعبين" : "Players Record"}</h2>
                <button onClick={exportToExcel} className="bg-green-600/10 text-green-500 border border-green-500/20 px-4 py-1.5 rounded-lg text-[10px] font-black hover:bg-green-500 hover:text-white transition-all">EXCEL</button>
              </div>
              <div className="flex gap-2">
                <select className="bg-white/5 border border-white/10 p-2 rounded-xl text-[10px] text-orange-500 font-bold outline-none" onChange={(e) => setFilterMonth(e.target.value)} value={filterMonth}>
                  {months.map(m => <option key={m.id} value={m.id} className="bg-black text-white">{m.name}</option>)}
                </select>
                <input type="text" placeholder={currentLang === 'ar' ? "بحث..." : "Search..."} className="bg-white/5 border border-white/10 p-3 rounded-2xl text-xs outline-none focus:border-orange-500 transition-all" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right" dir={i18n.dir()}>
                <thead className="bg-white/5 text-orange-500 text-[10px] font-black uppercase italic tracking-widest">
                  <tr>
                    <th className="p-5">{currentLang === 'ar' ? "اللاعب" : "Player"}</th>
                    <th className="p-5 text-center">{currentLang === 'ar' ? "الباقة" : "Subscription"}</th>
                    <th className="p-5 text-center">{currentLang === 'ar' ? "المدة" : "Duration"}</th>
                    <th className="p-5 text-center">{currentLang === 'ar' ? "السعر" : "Price"}</th>
                    <th className="p-5 text-center">{currentLang === 'ar' ? "التاريخ" : "Date"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.filter(o => {
                    const nameMatch = (o.customerDetails?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
                    const monthMatch = filterMonth === 'all' || new Date(o.createdAt).getMonth().toString() === filterMonth;
                    return nameMatch && monthMatch;
                  }).map(order => (
                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5 text-right">
                        <div className="font-black text-sm text-white group-hover:text-orange-500 transition-colors uppercase">{order.customerDetails?.fullName}</div>
                        <div className="text-[10px] text-white/30 font-mono italic tracking-widest">{order.customerDetails?.phone}</div>
                      </td>
                      <td className="p-5 text-center">
                        <span className="text-[11px] font-black text-white/80 uppercase tracking-tighter">
                           {order.planDetails?.title?.[currentLang]}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="text-[10px] text-white/40 italic font-bold">
                           {order.planDetails?.duration?.[currentLang]}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="text-[12px] text-orange-500 font-black tracking-tighter">{order.planDetails?.price} JOD</span>
                      </td>
                      <td className="p-5 text-center text-[10px] text-white/40 italic font-mono">
                        {new Date(order.createdAt).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}