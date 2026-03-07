import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';

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
        toast.error(t("process_error") || "خطأ في تحميل الخطط");
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, [t]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-orange-500 font-bold animate-pulse italic text-2xl tracking-tighter">
        {t("plans.loading") || "LOADING..."}
      </div>
    );

  return (
    <div className="bg-black min-h-screen py-20 px-6 font-sans">
      <Toaster 
        position="top-center" 
        containerStyle={{ top: 120, zIndex: 100000 }} 
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #f97316',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 'bold',
          },
        }}
      />

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
          const title = i18n.language.startsWith('ar') ? sub.title.ar : sub.title.en;
          const description = i18n.language.startsWith('ar') ? sub.description?.ar : sub.description?.en;

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

      {/* Modal Section */}
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

// ------------------ Modal Component (Compact Version) ------------------
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
        toast.error(t("modal.loginRequired") || "Login Required");
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

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    if (age < 18) {
      toast.error(t("modal.ageError") || "Minimum age is 18");
      return;
    }

    const tId = toast.loading(t("processing_order") || "Processing...");
    setIsSubmitting(true);
    
    try {
      const token = sessionStorage.getItem('token');
      const payload = {
        subscriptionId: sub._id,
        customerDetails: { fullName, phone: phoneNumber, nationalId: birthDate, age: Number(age) },
        planDetails: {
          title: { ar: sub.title.ar, en: sub.title.en },
          duration: { ar: selectedPlan.duration.ar, en: selectedPlan.duration.en },
          price: Number(selectedPlan.price)
        }
      };

      await axios.post(`${BASE_URL}/sub-orders/subscribe`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(t("validation.success") || "Success! ✨", { id: tId });
      onClose();
    } catch (err) {
      toast.error(t("validation.networkError"), { id: tId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999999] flex justify-center items-end overflow-hidden">
      {/* Container: max-h-[75vh] to keep it away from top headers */}
      <div className="relative bg-[#0f0f0f] border-t border-white/20 w-full max-w-lg p-6 rounded-t-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[75vh] overflow-y-auto">
        
        {/* Close Button - Sticky at the top of the modal content */}
        <button
          onClick={onClose}
          className="sticky top-0 float-right bg-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors shadow-lg z-[100] font-bold -mt-2"
        >
          ✕
        </button>
        
        <div className="clear-both"></div>

        <h2 className="text-xl font-black italic text-orange-500 mb-6 uppercase tracking-tight text-right pt-2 border-b border-white/5 pb-4">
          {t("modal.title") || "Confirm Subscription"}
        </h2>

        {fetchingUser ? (
          <div className="py-10 text-center text-white/20 italic animate-pulse">Loading...</div>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4 pb-6" dir={i18n.dir()}>
            {/* Grid for small devices to save vertical space */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase mb-1 block text-right">{t("modal.phone")}</label>
                <input readOnly type="text" value={phoneNumber} className="w-full bg-white/5 border border-white/5 p-3 rounded-xl text-orange-500 font-bold outline-none text-center text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase mb-1 block text-right">{t("modal.birthDate")}</label>
                <input required type="date" className="w-full bg-white/10 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 font-mono text-center text-sm" onChange={(e) => setBirthDate(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-white/30 uppercase mb-1 block text-right">{t("modal.fullName")}</label>
              <input required type="text" placeholder={t("modal.fullNamePlaceholder")} className="w-full bg-white/10 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 font-bold text-right text-sm" onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div>
              <label className="text-[10px] font-black text-white/30 uppercase mb-1 block text-right">{t("modal.plan")}</label>
              <select className="w-full bg-white/10 border border-white/10 p-4 rounded-xl text-white outline-none font-bold text-right text-sm" onChange={(e) => setSelectedPlan(JSON.parse(e.target.value))}>
                {sub.plans.map((p, i) => (
                  <option key={i} value={JSON.stringify(p)} className="bg-black text-white">
                    {i18n.language.startsWith('ar') ? p.duration.ar : p.duration.en} — {p.price} JOD
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-6 border-t border-white/5 mt-4 flex flex-row-reverse justify-between items-center px-2">
              <div className="text-right">
                <span className="text-white/20 font-bold text-[10px] uppercase italic block tracking-tighter">{t("modal.price")}</span>
                <span className="text-3xl font-black text-white italic">{selectedPlan.price} <small className="text-[11px] text-orange-500 uppercase">JOD</small></span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-white hover:text-black px-10 py-4 rounded-2xl text-white font-black uppercase italic transition-all shadow-xl active:scale-95 text-sm"
              >
                {isSubmitting ? "..." : (t("modal.submit") || "CONFIRM")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Plans;