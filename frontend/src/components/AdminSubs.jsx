

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([]); 
  const [orders, setOrders] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [editingId, setEditingId] = useState(null); 
  const [newSub, setNewSub] = useState({ 
    title: '', 
    type: '', 
    description: '', 
    plans: [{ duration: '', price: '' }] 
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const months = [
    { id: 'all', name: 'كل الشهور' },
    { id: '0', name: 'يناير (1)' }, { id: '1', name: 'فبراير (2)' },
    { id: '2', name: 'مارس (3)' }, { id: '3', name: 'أبريل (4)' },
    { id: '4', name: 'مايو (5)' }, { id: '5', name: 'يونيو (6)' },
    { id: '6', name: 'يوليو (7)' }, { id: '7', name: 'أغسطس (8)' },
    { id: '8', name: 'سبتمبر (9)' }, { id: '9', name: 'أكتوبر (10)' },
    { id: '10', name: 'نوفمبر (11)' }, { id: '11', name: 'ديسمبر (12)' }
  ];

  const getAuthHeader = () => {
    const token = sessionStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async () => {
    try {
      const config = getAuthHeader();
      const resSubs = await axios.get(`${BASE_URL}/subscriptions`, config);
      setSubs(resSubs.data);
      const resOrders = await axios.get(`${BASE_URL}/sub-orders/admin/all`, config);
      setOrders(resOrders.data);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- دالة حذف الاشتراك (التي طلبت إعادتها) ---
  const handleDeleteSub = async (id) => {
    if (window.confirm("⚠️ هل أنت متأكد من حذف هذه الباقة نهائياً؟")) {
      try {
        await axios.delete(`${BASE_URL}/subscriptions/${id}`, getAuthHeader());
        alert("تم الحذف بنجاح");
        fetchData();
      } catch (err) { 
        alert("فشل الحذف، قد تكون الباقة مرتبطة بطلبات نشطة"); 
      }
    }
  };

  const addPlanField = () => {
    setNewSub({ ...newSub, plans: [...newSub.plans, { duration: '', price: '' }] });
  };

  const calculateRemainingDays = (createdAt, duration) => {
    if (!createdAt || !duration) return 0;
    const startDate = new Date(createdAt);
    const text = duration.toString().toLowerCase();
    let daysToAdd = 30; 
    if (text.includes("شهرين")) daysToAdd = 60;
    else if (text.includes("شهر")) {
      const match = text.match(/\d+/);
      daysToAdd = match ? parseInt(match[0]) * 30 : 30;
    } else if (text.includes("سنة") || text.includes("عام")) daysToAdd = 365;
    else if (text.includes("اسبوع") || text.includes("أسبوع")) daysToAdd = 7;
    else {
      const match = text.match(/\d+/);
      daysToAdd = match ? parseInt(match[0]) * 30 : 30;
    }
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + daysToAdd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const exportToExcel = () => {
    const filtered = orders.filter(o => {
      const nameMatch = (o.customerDetails?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const monthMatch = filterMonth === 'all' || new Date(o.createdAt).getMonth().toString() === filterMonth;
      return nameMatch && monthMatch;
    });
    const data = filtered.map(o => ({
      "الاسم الكامل": o.customerDetails?.fullName,
      "الرقم الوطني": o.customerDetails?.nationalId,
      "الهاتف": o.customerDetails?.phone,
      "تاريخ الاشتراك": new Date(o.createdAt).toLocaleDateString('ar-JO'),
      "الباقة": o.planDetails?.title,
      "الأيام المتبقية": calculateRemainingDays(o.createdAt, o.planDetails?.duration)
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "المشتركين");
    XLSX.writeFile(wb, "HighFit_Final_Report.xlsx");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthHeader();
      if (editingId) {
        await axios.put(`${BASE_URL}/subscriptions/${editingId}`, newSub, config);
        alert("✅ تم التحديث!");
      } else {
        await axios.post(`${BASE_URL}/subscriptions/add`, newSub, config);
        alert("✅ تمت الإضافة!");
      }
      setNewSub({ title: '', type: '', description: '', plans: [{ duration: '', price: '' }] });
      setEditingId(null);
      fetchData();
    } catch (err) { alert("❌ خطأ في العملية"); }
  };

  return (
    <div className="p-6 md:p-10 bg-black min-h-screen text-white font-sans text-right" dir="rtl">
      <h1 className="text-3xl font-black text-orange-500 mb-10 italic uppercase border-l-4 border-orange-500 pl-4 text-left tracking-tighter">
        High Fit <span className="text-white">Admin Console</span>
      </h1>

      <div className="grid lg:grid-cols-12 gap-10">
        <section className="lg:col-span-4 space-y-6">
          <form onSubmit={handleSubmit} className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h2 className="text-white font-bold mb-6 uppercase italic text-xs tracking-widest text-white/50">إدارة الباقات / SETTINGS</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input value={newSub.title} placeholder="العنوان (صباحي)" className="bg-white/5 p-4 rounded-xl outline-none border border-white/10 focus:border-orange-500 text-white text-sm" 
                onChange={e => setNewSub({...newSub, title: e.target.value})} required />
              <input value={newSub.type} placeholder="النوع (morning)" className="bg-white/5 p-4 rounded-xl outline-none border border-white/10 focus:border-orange-500 text-white text-sm font-mono" 
                onChange={e => setNewSub({...newSub, type: e.target.value})} required />
            </div>

           
            
            <div className="space-y-3 mb-4">
              <label className="text-[10px] text-orange-500 font-black uppercase block tracking-widest italic">الأسعار والمدد</label>
              {newSub.plans.map((plan, i) => (
                <div key={i} className="flex gap-2">
                  <input value={plan.duration} placeholder="المدة" className="flex-1 bg-white/5 p-3 rounded-lg border border-white/5 text-xs text-white" 
                    onChange={e => {
                      const p = [...newSub.plans]; p[i].duration = e.target.value; setNewSub({...newSub, plans: p});
                    }} required />
                  <input value={plan.price} placeholder="JOD" type="number" className="w-20 bg-white/5 p-3 rounded-lg border border-white/5 text-xs font-bold text-orange-500" 
                    onChange={e => {
                      const p = [...newSub.plans]; p[i].price = e.target.value; setNewSub({...newSub, plans: p});
                    }} required />
                </div>
              ))}
            </div>
            
            <button type="button" onClick={addPlanField} className="text-white/30 text-[10px] font-black uppercase mb-6 hover:text-orange-500 transition-all">+ إضافة خيار سعري</button>
            <button type="submit" className="w-full bg-orange-500 py-4 rounded-2xl font-black uppercase italic hover:bg-white hover:text-black transition-all shadow-lg shadow-orange-500/10">
              {editingId ? "تحديث الباقة الآن" : "حفظ الاشتراك بالنظام"}
            </button>
          </form>

          {/* قائمة الباقات الحالية مع فنكشن الحذف */}
          <div className="space-y-2">
            <h3 className="text-[10px] text-white/20 font-bold uppercase tracking-widest px-2">الباقات النشطة</h3>
            {subs.map(sub => (
              <div key={sub._id} className="p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5 group hover:border-white/10 transition-all">
                <div className="font-black text-xs italic uppercase tracking-tighter">{sub.title}</div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => { setEditingId(sub._id); setNewSub(sub); window.scrollTo(0,0); }} className="text-[9px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-md font-bold uppercase">تعديل</button>
                  <button onClick={() => handleDeleteSub(sub._id)} className="text-[9px] bg-red-500/20 text-red-400 px-3 py-1 rounded-md font-bold uppercase">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-8">
           <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex flex-wrap justify-between items-center bg-white/[0.02] gap-4">
                  <div className="flex items-center gap-3">
                     <h2 className="font-black italic uppercase text-white/50 tracking-tighter">مراقبة اللاعبين</h2>
                     <button onClick={exportToExcel} className="bg-green-600/20 text-green-500 border border-green-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-green-500 hover:text-white transition-all">تصدير EXCEL</button>
                  </div>
                  <div className="flex gap-2">
                    <select className="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] outline-none text-orange-500 font-bold"
                      onChange={(e) => setFilterMonth(e.target.value)} value={filterMonth}>
                      {months.map(m => <option key={m.id} value={m.id} className="bg-black">{m.name}</option>)}
                    </select>
                    <input type="text" placeholder="بحث بالاسم..." className="bg-white/5 border border-white/10 p-2 rounded-xl text-xs outline-none focus:border-orange-500 w-32 md:w-48 text-white" 
                      onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-white/5 text-orange-500 text-[10px] font-black uppercase italic">
                    <tr>
                      <th className="p-4">بيانات اللاعب</th>
                      <th className="p-4">الرقم الوطني</th>
                      <th className="p-4 text-center">التاريخ</th>
                      <th className="p-4 text-center">المتبقي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.filter(o => {
                        const nameMatch = (o.customerDetails?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
                        const monthMatch = filterMonth === 'all' || new Date(o.createdAt).getMonth().toString() === filterMonth;
                        return nameMatch && monthMatch;
                    }).map(order => {
                      const daysLeft = calculateRemainingDays(order.createdAt, order.planDetails?.duration);
                      return (
                        <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="font-black text-sm uppercase text-white tracking-tighter">{order.customerDetails?.fullName}</div>
                            <div className="text-[9px] text-white font-mono tracking-widest italic">📞 {order.customerDetails?.phone}</div>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-white tracking-tighter italic">
                            {order.customerDetails?.nationalId || '---'}
                          </td>
                          <td className="p-4 text-center text-[10px] text-white italic font-mono">
                            {new Date(order.createdAt).toLocaleDateString('ar-JO')}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center">
                              {daysLeft > 0 ? (
                                <span className={`text-3xl font-black italic tracking-tighter ${daysLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                                  {daysLeft}<small className="text-[10px] mr-1 uppercase font-bold">يوم</small>
                                </span>
                              ) : (
                                <div className="bg-red-600/10 border border-red-600/30 text-red-500 px-3 py-1 rounded-xl text-[10px] font-black italic uppercase">Expired</div>
                              )}
                            </div>
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