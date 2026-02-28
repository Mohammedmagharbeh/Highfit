import React, { useState, useEffect } from 'react';

export default function SubscriptionCard({ sub }) {
  // 1. الحماية: إذا الـ sub مش موجود أو الـ plans لسه ما وصلت، اعرض "Loading" بسيط
  if (!sub || !sub.plans || sub.plans.length === 0) {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] animate-pulse">
        <div className="h-8 bg-white/10 w-1/2 rounded mb-4"></div>
        <div className="h-10 bg-white/10 w-full rounded"></div>
      </div>
    );
  }

  // 2. التعريف: الآن إحنا متأكدين إن plans موجودة ومستحيل يعطي TypeError
  const [selectedPlan, setSelectedPlan] = useState(sub.plans[0]);

  // تحديث الحالة إذا تغيرت البيانات القادمة من الباك إند
  useEffect(() => {
    if (sub.plans && sub.plans.length > 0) {
      setSelectedPlan(sub.plans[0]);
    }
  }, [sub]);

  return (
    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] hover:border-orange-500 transition-all">
      <h3 className="text-3xl font-black italic text-white uppercase italic tracking-tighter">
        {sub.title}
      </h3>
      
      <div className="mt-6 space-y-4">
        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">اختر المدة</label>
        <select 
          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 cursor-pointer"
          value={JSON.stringify(selectedPlan)}
          onChange={(e) => setSelectedPlan(JSON.parse(e.target.value))}
        >
          {sub.plans.map((plan, i) => (
            <option key={i} value={JSON.stringify(plan)} className="bg-black text-white">
              {plan.duration} - {plan.price} JOD
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div>
          <span className="text-5xl font-black text-orange-500">{selectedPlan.price}</span>
          <span className="text-white/40 font-bold ml-2 italic">JOD</span>
        </div>
        <button className="bg-orange-500 text-white px-8 py-3 rounded-full font-black uppercase text-xs hover:scale-105 transition-transform">
          اشترك الآن
        </button>
      </div>
    </div>
  );
}