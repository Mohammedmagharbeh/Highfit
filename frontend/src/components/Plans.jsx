

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Plans = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/subscriptions`);
        setSubscriptions(res.data);
      } catch (err) {
        console.error("Error fetching subs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-orange-500 font-bold animate-pulse italic text-2xl tracking-tighter">
      HIGH FIT IS LOADING...
    </div>
  );

  return (
    <div className="bg-black min-h-screen py-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-white text-6xl md:text-8xl font-black italic uppercase tracking-tighter">
          باقات <span className="text-orange-500">الاشتراك</span>
        </h1>
        <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest">NO EXCUSES, JUST RESULTS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {subscriptions.map((sub) => (
          <div key={sub._id} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[3rem] flex flex-col justify-between hover:border-orange-500/40 transition-all group relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white italic mb-4 uppercase">{sub.title}</h3>
              <p className="text-white/40 text-sm mb-8 leading-relaxed">
                {sub.description || "استمتع بأفضل تجربة تدريب في High Fit."}
              </p>
            </div>
            <button 
              onClick={() => { setSelectedSub(sub); setShowModal(true); }}
              className="w-full bg-orange-500 hover:bg-white hover:text-black text-white py-5 rounded-2xl font-black uppercase italic transition-all active:scale-95 z-10"
            >
              اشترك الآن
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedSub && (
        <SubscriptionModal sub={selectedSub} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

// --- المكون المنبثق (Modal) المصغر ---
const SubscriptionModal = ({ sub, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(sub.plans[0]);
  const [fetchingUser, setFetchingUser] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) { alert("يرجى تسجيل الدخول"); onClose(); return; }
      try {
        const res = await axios.get(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPhoneNumber(res.data.phone);
      } catch (err) { console.error(err); } 
      finally { setFetchingUser(false); }
    };
    getUserData();
  }, [onClose]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    const idStr = String(nationalId).trim();
    if (idStr.length !== 10) { alert("❌ الرقم الوطني 10 خانات"); return; }
    
    let birthYear = idStr.startsWith('2') ? parseInt(idStr.substring(0, 4)) : 1900 + parseInt(idStr.substring(0, 2));
    const age = new Date().getFullYear() - birthYear;
    if (age < 18) { alert(`التسجيل متاح لـ +18 فقط (عمرك الحالي ${age})`); return; }

    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`${BASE_URL}/sub-orders/subscribe`, {
        subscriptionId: sub._id,
        customerDetails: { fullName, phone: phoneNumber, nationalId: idStr, age },
        planDetails: { title: sub.title, duration: selectedPlan.duration, price: selectedPlan.price }
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert(`✅ تم إرسال الطلب!`);
      onClose();
    } catch (err) { alert("❌ حدث خطأ في الشبكة"); }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      {/* تصغير حجم الحاوية من p-8 إلى p-6 وتقليل max-w */}
      <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-sm p-6 rounded-[2rem] relative shadow-2xl animate-in zoom-in duration-200">
        
        {/* رمز X الصغير في الزاوية العلوية */}
        <button 
          onClick={onClose} 
          className="absolute -top-3 -right-3 bg-orange-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform shadow-lg z-[10000]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-xl font-black italic text-orange-500 mb-4 uppercase tracking-tight text-right italic">تأكيد الاشتراك</h2>

        {fetchingUser ? (
          <div className="py-10 text-center text-white/20 italic animate-pulse">جاري التحميل...</div>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4" dir="rtl">
            <div>
              <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">الهاتف</label>
              <input readOnly type="text" value={phoneNumber} className="w-full bg-white/5 border border-white/5 p-3 rounded-xl text-orange-500 font-bold outline-none text-center text-sm" />
            </div>

            <div>
              <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">الاسم الكامل</label>
              <input required type="text" placeholder="الاسم الثلاثي" className="w-full bg-white/10 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 font-bold text-right text-sm" 
                onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div>
              <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">الرقم الوطني</label>
              <input required type="text" maxLength="10" placeholder="10 أرقام" className="w-full bg-white/10 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 font-mono tracking-widest text-center text-sm" 
                onChange={(e) => setNationalId(e.target.value)} />
            </div>

            <div>
              <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">الباقة</label>
              <select className="w-full bg-white/10 border border-white/10 p-3 rounded-xl text-white outline-none cursor-pointer font-bold text-right text-sm"
                onChange={(e) => setSelectedPlan(JSON.parse(e.target.value))}>
                {sub.plans.map((p, i) => (
                  <option key={i} value={JSON.stringify(p)} className="bg-black">{p.duration} — {p.price} JOD</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-white/5 mt-2">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-white/20 font-bold text-[10px] uppercase italic tracking-tighter">السعر:</span>
                <span className="text-2xl font-black text-white italic">{selectedPlan.price} <small className="text-[10px] text-orange-500 uppercase">JOD</small></span>
              </div>
              <button type="submit" className="w-full bg-orange-500 py-4 rounded-xl text-white font-black uppercase italic hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 text-sm tracking-tighter">
                إرسال الطلب الآن
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Plans;