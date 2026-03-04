// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useTranslation } from 'react-i18next';

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// const Plans = () => {
//   const { t, i18n } = useTranslation();
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [selectedSub, setSelectedSub] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSubs = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/subscriptions`);
//         setSubscriptions(res.data);
//       } catch (err) {
//         console.error("Error fetching subscriptions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSubs();
//   }, []);

//   if (loading)
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-orange-500 font-bold animate-pulse italic text-2xl tracking-tighter">
//         {t("plans.loading")}
//       </div>
//     );

//   return (
//     <div className="bg-black min-h-screen py-20 px-6 font-sans">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto text-center mb-16">
//         <h1 className="text-white text-6xl md:text-8xl font-black italic uppercase tracking-tighter">
//           {t("plans.title")}{" "}
//           <span className="text-orange-500">{t("plans.highlight")}</span>
//         </h1>
//         <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest">
//           {t("plans.subtitle")}
//         </p>
//       </div>

//       {/* Plans Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {subscriptions.map((sub) => {
//           const title = i18n.language === "ar" ? sub.title.ar : sub.title.en;
//           const description =
//             i18n.language === "ar"
//               ? sub.description?.ar
//               : sub.description?.en;

//           return (
//             <div
//               key={sub._id}
//               className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[3rem] flex flex-col justify-between hover:border-orange-500/40 transition-all group relative overflow-hidden"
//             >
//               <div className="relative z-10">
//                 <h3 className="text-3xl font-black text-white italic mb-4 uppercase">
//                   {title}
//                 </h3>
//                 <p className="text-white/40 text-sm mb-8 leading-relaxed">
//                   {description || t("plans.defaultDescription")}
//                 </p>
//               </div>
//               <button
//                 onClick={() => {
//                   setSelectedSub(sub);
//                   setShowModal(true);
//                 }}
//                 className="w-full bg-orange-500 hover:bg-white hover:text-black text-white py-5 rounded-2xl font-black uppercase italic transition-all active:scale-95 z-10"
//               >
//                 {t("plans.subscribeNow")}
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {/* Modal */}
//       {showModal && selectedSub && (
//         <SubscriptionModal
//           sub={selectedSub}
//           onClose={() => setShowModal(false)}
//           i18n={i18n}
//         />
//       )}
//     </div>
//   );
// };

// // ------------------ Modal Component ------------------
// const SubscriptionModal = ({ sub, onClose, i18n }) => {
//   const { t } = useTranslation();
//   const [fullName, setFullName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [nationalId, setNationalId] = useState('');
//   const [selectedPlan, setSelectedPlan] = useState(sub.plans[0]);
//   const [fetchingUser, setFetchingUser] = useState(true);

//   useEffect(() => {
//     const getUserData = async () => {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         alert(t("modal.loginRequired"));
//         onClose();
//         return;
//       }
//       try {
//         const res = await axios.get(`${BASE_URL}/users/me`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setPhoneNumber(res.data.phone);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setFetchingUser(false);
//       }
//     };
//     getUserData();
//   }, [onClose, t]);

//   const handleConfirm = async (e) => {
//     e.preventDefault();
//     const idStr = String(nationalId).trim();

//     if (idStr.length !== 10) {
//       alert(t("validation.nationalIdLength"));
//       return;
//     }

//     // حساب العمر بناءً على الرقم الوطني
//     let birthYear = idStr.startsWith('2')
//       ? parseInt(idStr.substring(0, 4))
//       : 1900 + parseInt(idStr.substring(0, 2));

//     const age = new Date().getFullYear() - birthYear;

//     if (age < 18) {
//       alert(t("validation.ageRestriction", { age }));
//       return;
//     }

//     try {
//       const token = sessionStorage.getItem('token');
      
//       // التعديل هنا: نرسل الكائنات كاملة ar و en لتتوافق مع الموديل الجديد
//       await axios.post(`${BASE_URL}/sub-orders/subscribe`, {
//         subscriptionId: sub._id,
//         customerDetails: { 
//           fullName, 
//           phone: phoneNumber, 
//           nationalId: idStr, 
//           age 
//         },
//         planDetails: {
//           title: sub.title,        // نرسل كائن اللغات كاملاً {ar: "...", en: "..."}
//           duration: selectedPlan.duration, // نرسل كائن اللغات كاملاً {ar: "...", en: "..."}
//           price: selectedPlan.price
//         }
//       }, { headers: { Authorization: `Bearer ${token}` } });

//       alert(t("validation.success"));
//       onClose();
//     } catch (err) {
//       // طباعة الخطأ في الكونسول لمعرفة السبب الحقيقي لو استمرت المشكلة
//       console.error("Subscription Error:", err.response?.data || err.message);
//       alert(t("validation.networkError"));
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
//       <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-sm p-6 rounded-[2rem] relative shadow-2xl animate-in zoom-in duration-200">
        
//         <button
//           onClick={onClose}
//           className="absolute -top-3 -right-3 bg-orange-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform shadow-lg z-[10000]"
//         >
//           ✕
//         </button>
        
//         <h2 className="text-xl font-black italic text-orange-500 mb-4 uppercase tracking-tight text-right">
//           {t("modal.title")}
//         </h2>

//         {fetchingUser ? (
//           <div className="py-10 text-center text-white/20 italic animate-pulse">
//             {t("modal.loading")}
//           </div>
//         ) : (
//           <form onSubmit={handleConfirm} className="space-y-4" dir="rtl">
//             <div>
//               <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">
//                 {t("modal.phone")}
//               </label>
//               <input
//                 readOnly
//                 type="text"
//                 value={phoneNumber}
//                 className="w-full bg-white/5 border border-white/5 p-3 rounded-xl text-orange-500 font-bold outline-none text-center text-sm"
//               />
//             </div>

//             <div>
//               <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">
//                 {t("modal.fullName")}
//               </label>
//               <input
//                 required
//                 type="text"
//                 placeholder={t("modal.fullNamePlaceholder")}
//                 className="w-full bg-white/10 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 font-bold text-right text-sm"
//                 onChange={(e) => setFullName(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">
//                 {t("modal.nationalId")}
//               </label>
//               <input
//                 required
//                 type="text"
//                 maxLength="10"
//                 placeholder={t("modal.nationalIdPlaceholder")}
//                 className="w-full bg-white/10 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 font-mono tracking-widest text-center text-sm"
//                 onChange={(e) => setNationalId(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">
//                 {t("modal.plan")}
//               </label>
//               <select
//                 className="w-full bg-white/10 border border-white/10 p-3 rounded-xl text-white outline-none cursor-pointer font-bold text-right text-sm"
//                 onChange={(e) => setSelectedPlan(JSON.parse(e.target.value))}
//               >
//                 {sub.plans.map((p, i) => (
//                   <option key={i} value={JSON.stringify(p)} className="bg-black">
//                     {i18n.language === "ar" ? p.duration.ar : p.duration.en} — {p.price} JOD
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="pt-4 border-t border-white/5 mt-2">
//               <div className="flex justify-between items-center mb-4 px-1">
//                 <span className="text-white/20 font-bold text-[10px] uppercase italic tracking-tighter">
//                   {t("modal.price")}
//                 </span>
//                 <span className="text-2xl font-black text-white italic">
//                   {selectedPlan.price} <small className="text-[10px] text-orange-500 uppercase">JOD</small>
//                 </span>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-orange-500 py-4 rounded-xl text-white font-black uppercase italic hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 text-sm tracking-tighter"
//               >
//                 {t("modal.submit")}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Plans;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Plans = () => {
  const { t, i18n } = useTranslation();
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
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-orange-500 font-bold animate-pulse italic text-2xl tracking-tighter">
        {t("plans.loading") || "LOADING..."}
      </div>
    );

  return (
    <div className="bg-black min-h-screen py-20 px-6 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-white text-6xl md:text-8xl font-black italic uppercase tracking-tighter">
          {t("plans.title")}{" "}
          <span className="text-orange-500">{t("plans.highlight")}</span>
        </h1>
        <p className="text-white/20 mt-4 font-bold italic uppercase tracking-widest">
          {t("plans.subtitle")}
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {subscriptions.map((sub) => {
          const title = i18n.language === "ar" ? sub.title.ar : sub.title.en;
          const description = i18n.language === "ar" ? sub.description?.ar : sub.description?.en;

          return (
            <div
              key={sub._id}
              className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[3rem] flex flex-col justify-between hover:border-orange-500/40 transition-all group relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white italic mb-4 uppercase">
                  {title}
                </h3>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">
                  {description || t("plans.defaultDescription")}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSub(sub);
                  setShowModal(true);
                }}
                className="w-full bg-orange-500 hover:bg-white hover:text-black text-white py-5 rounded-2xl font-black uppercase italic transition-all active:scale-95 z-10"
              >
                {t("plans.subscribeNow")}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && selectedSub && (
        <SubscriptionModal
          sub={selectedSub}
          onClose={() => setShowModal(false)}
          i18n={i18n}
        />
      )}
    </div>
  );
};

// ------------------ Modal Component ------------------
const SubscriptionModal = ({ sub, onClose, i18n }) => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(sub.plans[0]);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert(t("modal.loginRequired") || "يرجى تسجيل الدخول أولاً");
        onClose();
        return;
      }
      try {
        const res = await axios.get(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPhoneNumber(res.data.phone);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setFetchingUser(false);
      }
    };
    getUserData();
  }, [onClose, t]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!birthDate) {
      alert("يرجى إدخال تاريخ الميلاد");
      return;
    }

    // حساب العمر
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 18) {
      alert(t("validation.ageRestriction", { age }) || `يجب أن يكون العمر 18 عاماً على الأقل. عمرك الحالي: ${age}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      
      const payload = {
        subscriptionId: sub._id,
        customerDetails: { 
          fullName, 
          phone: phoneNumber, 
          nationalId: birthDate, 
          age: Number(age) 
        },
        planDetails: {
          title: {
            ar: sub.title.ar,
            en: sub.title.en
          },
          duration: {
            ar: selectedPlan.duration.ar,
            en: selectedPlan.duration.en
          },
          price: Number(selectedPlan.price)
        }
      };

      await axios.post(`${BASE_URL}/sub-orders/subscribe`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(t("validation.success") || "تم الاشتراك بنجاح");
      onClose();
    } catch (err) {
      console.error("Subscription Error Details:", err.response?.data || err.message);
      alert(err.response?.data?.msg || t("validation.networkError") || "حدث خطأ أثناء الاشتراك");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-sm p-6 rounded-[2rem] relative shadow-2xl animate-in zoom-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-orange-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform shadow-lg z-[10000]"
        >
          ✕
        </button>
        
        <h2 className="text-xl font-black italic text-orange-500 mb-4 uppercase tracking-tight text-right">
          {t("modal.title") || "إتمام الاشتراك"}
        </h2>

        {fetchingUser ? (
          <div className="py-10 text-center text-white/20 italic animate-pulse">
            {t("modal.loading") || "جاري التحميل..."}
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4" dir="rtl">
            <div>
              <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">
                {t("modal.phone")}
              </label>
              <input
                readOnly
                type="text"
                value={phoneNumber}
                className="w-full bg-white/5 border border-white/5 p-3 rounded-xl text-orange-500 font-bold outline-none text-center text-sm"
              />
            </div>

            <div>
              <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">
                {t("modal.fullName")}
              </label>
              <input
                required
                type="text"
                placeholder={t("modal.fullNamePlaceholder") || "الاسم الكامل"}
                className="w-full bg-white/10 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 font-bold text-right text-sm"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">
                {t("modal.birthDate") || "تاريخ الميلاد"}
              </label>
              <input
                required
                type="date"
                className="w-full bg-white/10 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 font-mono text-center text-sm"
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[9px] font-black text-white/30 uppercase mb-1 block tracking-widest text-right">
                {t("modal.plan")}
              </label>
              <select
                className="w-full bg-white/10 border border-white/10 p-3 rounded-xl text-white outline-none cursor-pointer font-bold text-right text-sm"
                onChange={(e) => setSelectedPlan(JSON.parse(e.target.value))}
              >
                {sub.plans.map((p, i) => (
                  <option key={i} value={JSON.stringify(p)} className="bg-black">
                    {i18n.language === "ar" ? p.duration.ar : p.duration.en} — {p.price} JOD
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-white/5 mt-2">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-white/20 font-bold text-[10px] uppercase italic tracking-tighter">
                  {t("modal.price")}
                </span>
                <span className="text-2xl font-black text-white italic">
                  {selectedPlan.price} <small className="text-[10px] text-orange-500 uppercase">JOD</small>
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-600' : 'bg-orange-500 hover:bg-white hover:text-black'} py-4 rounded-xl text-white font-black uppercase italic transition-all shadow-lg active:scale-95 text-sm tracking-tighter`}
              >
                {isSubmitting ? "جاري الإرسال..." : (t("modal.submit") || "تأكيد الاشتراك")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Plans;