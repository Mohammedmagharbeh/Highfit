
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([]); 
  const [orders, setOrders] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [editingId, setEditingId] = useState(null); 
  const [newSub, setNewSub] = useState({ title: '', type: '', description: '', plans: [{ duration: '', price: '' }] });

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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // --- دالة الإكسل المصححة ---
  const exportToExcel = () => {
    try {
      const filteredOrders = orders.filter(o => {
        const customerName = o.customerDetails?.fullName || '';
        const matchName = customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchMonth = filterMonth === 'all' || new Date(o.createdAt).getMonth().toString() === filterMonth;
        return matchName && matchMonth;
      });

      if (filteredOrders.length === 0) {
        alert("لا توجد بيانات لتصديرها");
        return;
      }

      const dataForExcel = filteredOrders.map(order => ({
        "اسم اللاعب": order.customerDetails?.fullName || 'غير معروف',
        "رقم الهاتف": order.customerDetails?.phone || '---',
        "الرقم الوطني": order.customerDetails?.nationalId || '---',
        "تاريخ الاشتراك": new Date(order.createdAt).toLocaleDateString('ar-JO'),
        "الباقة": order.planDetails?.title || '---',
        "المدة": order.planDetails?.duration || '---',
        "السعر المدفوع (JOD)": order.planDetails?.price || 0,
        "الأيام المتبقية": calculateRemainingDays(order.createdAt, order.planDetails?.duration || "")
      }));

      // تحويل البيانات لورقة عمل
      const ws = XLSX.utils.json_to_sheet(dataForExcel);
      
      // إنشاء كتاب عمل وإضافة الورقة له
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "المشتركين");

      // التصدير باستخدام الدالة الصحيحة من الكائن الرئيسي
      XLSX.writeFile(wb, `HighFit_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("Export Error:", error);
      alert("حدث خطأ أثناء تصدير الملف");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthHeader();
      if (editingId) {
        await axios.put(`${BASE_URL}/subscriptions/${editingId}`, newSub, config);
        alert("تم التحديث!");
      } else {
        await axios.post(`${BASE_URL}/subscriptions/add`, newSub, config);
        alert("تمت الإضافة!");
      }
      setNewSub({ title: '', type: '', description: '', plans: [{ duration: '', price: '' }] });
      setEditingId(null);
      fetchData();
    } catch (err) { alert("خطأ في العملية"); }
  };

  const handleDeleteSub = async (id) => {
    if (window.confirm("حذف الباقة نهائياً؟")) {
      try {
        await axios.delete(`${BASE_URL}/subscriptions/${id}`, getAuthHeader());
        fetchData();
      } catch (err) { alert("فشل الحذف"); }
    }
  };

  return (
    <div className="p-6 md:p-10 bg-black min-h-screen text-white font-sans text-right" dir="rtl">
      <h1 className="text-3xl font-black text-orange-500 mb-10 italic uppercase tracking-tighter text-left">
        High Fit <span className="text-white">Admin Console</span>
      </h1>

      <div className="grid lg:grid-cols-12 gap-10">
        <section className="lg:col-span-4 space-y-6">
          <form onSubmit={handleSubmit} className="bg-[#0a0a0a] p-6 rounded-[2.5rem] border border-orange-500/20 shadow-xl">
            <h2 className="text-white font-bold mb-4 uppercase italic text-sm">إعدادات الباقات</h2>
            <div className="space-y-3 mb-4">
              <input value={newSub.title} placeholder="اسم الباقة" className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white outline-none focus:border-orange-500" onChange={e => setNewSub({...newSub, title: e.target.value})} required />
              <input value={newSub.type} placeholder="النوع" className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white outline-none focus:border-orange-500" onChange={e => setNewSub({...newSub, type: e.target.value})} required />
            </div>
            
            {newSub.plans.map((plan, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={plan.duration} placeholder="المدة" className="flex-1 bg-white/5 p-3 rounded-lg border border-white/5 text-xs text-white outline-none" onChange={e => {
                  const p = [...newSub.plans]; p[i].duration = e.target.value; setNewSub({...newSub, plans: p});
                }} required />
                <input value={plan.price} placeholder="JOD" type="number" className="w-20 bg-white/5 p-3 rounded-lg border border-white/5 text-xs font-bold text-orange-500 outline-none" onChange={e => {
                  const p = [...newSub.plans]; p[i].price = e.target.value; setNewSub({...newSub, plans: p});
                }} required />
              </div>
            ))}
            
            <button type="submit" className="w-full bg-orange-500 py-4 rounded-xl font-black uppercase italic hover:bg-white hover:text-black transition-all mt-4">
              {editingId ? "تحديث الباقة" : "إضافة باقة"}
            </button>
          </form>

          <div className="space-y-2">
            {subs.map(sub => (
              <div key={sub._id} className="p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5 group">
                <div className="font-bold text-xs italic uppercase">{sub.title}</div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => { setEditingId(sub._id); setNewSub(sub); window.scrollTo(0,0); }} className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md font-bold uppercase">تعديل</button>
                  <button onClick={() => handleDeleteSub(sub._id)} className="text-[9px] bg-red-500/20 text-red-400 px-2 py-1 rounded-md font-bold uppercase">حذف</button>
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
                     <button onClick={exportToExcel} className="bg-green-600/20 text-green-500 border border-green-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/10">تصدير EXCEL</button>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      className="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] outline-none text-orange-500 font-bold focus:border-orange-500"
                      onChange={(e) => setFilterMonth(e.target.value)}
                      value={filterMonth}
                    >
                      {months.map(m => <option key={m.id} value={m.id} className="bg-black text-white">{m.name}</option>)}
                    </select>
                    <input type="text" placeholder="بحث بالاسم..." className="bg-white/5 border border-white/10 p-2 rounded-lg text-xs outline-none focus:border-orange-500 w-32 md:w-48 text-white" onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-white/5 text-orange-500 text-[10px] font-black uppercase italic">
                    <tr>
                      <th className="p-4">بيانات اللاعب</th>
                      <th className="p-4">الرقم الوطني</th>
                      <th className="p-4 text-center">التاريخ</th>
                      <th className="p-4 text-center">متبقي لنهاية الاشتراك</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.filter(o => {
                        const name = (o.customerDetails?.fullName || '').toLowerCase();
                        const matchName = name.includes(searchTerm.toLowerCase());
                        const matchMonth = filterMonth === 'all' || new Date(o.createdAt).getMonth().toString() === filterMonth;
                        return matchName && matchMonth;
                    }).map(order => {
                      const daysLeft = calculateRemainingDays(order.createdAt, order.planDetails?.duration);
                      return (
                        <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="font-black text-sm uppercase text-white">{order.customerDetails?.fullName}</div>
                            <div className="text-[9px] text-white font-mono tracking-widest italic">📞 {order.customerDetails?.phone}</div>
                          </td>
                          <td className="p-4 font-mono text-xs text-white tracking-tighter">{order.customerDetails?.nationalId}</td>
                          <td className="p-4 text-center text-[10px] text-white italic">{new Date(order.createdAt).toLocaleDateString('ar-JO')}</td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center">
                              {daysLeft > 0 ? (
                                <>
                                  <span className={`text-4xl font-black italic tracking-tighter ${daysLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                                    {daysLeft}<small className="text-[10px] mr-1 uppercase">يوم</small>
                                  </span>
                                  <div className="text-[8px] text-white font-bold uppercase mt-1 tracking-widest">مفعل ✓</div>
                                </>
                              ) : (
                                <div className="bg-red-600/10 border border-red-600/30 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black italic uppercase">منتهي ✕</div>
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