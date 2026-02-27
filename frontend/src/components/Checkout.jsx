
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  ArrowRight,
  ArrowLeft,
  Store,
  Truck,
  ClipboardList,
  ChevronDown,
} from "lucide-react";

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState("delivery");

  const [locations, setLocations] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  const sessionData = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  const [userName, setUserName] = useState(sessionData?.name || "");
  const [addressNote, setAddressNote] = useState("");
  const [phone, setPhone] = useState(sessionData?.phone || "");

  const isAr = i18n.language === "ar";

  useEffect(() => {
    if (orderType === "delivery" && token) {
      const fetchLocations = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/locations/get`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setLocations(res.data.locations || []);
        } catch (error) {
          toast.error(t("error_fetch_locations"));
        }
      };
      fetchLocations();
    }
  }, [orderType, token, t]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!sessionData || !token) {
      toast.error(t("session_expired"));
      navigate("/log");
      return;
    }

    if (orderType === "delivery" && !selectedArea) {
      toast.error(t("select_area_error"));
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(t("processing_order"));

    try {
      const deliveryFee = orderType === "delivery" ? (selectedArea?.deliveryCost || 0) : 0;
      
      const orderPayload = {
        userId: sessionData._id,
        userName: userName,
        userPhone: phone,
        orderType: orderType,
        address: orderType === "pickup" ? (isAr ? "استلام من المحل" : "Pickup from Store") : selectedArea.name, 
        addressDetails: {
          area: selectedArea?.name || "",
          street: addressNote,
        },
        deliveryCost: deliveryFee,
        totalAmount: total + deliveryFee,
        items: cart.products.map((p) => ({
          mealId: p.productId?._id || p.productId,
          mealName: p.productId?.name[i18n.language] || p.productId?.name?.en || "Meal",
          mealImage: p.productId?.image || "",
          quantity: p.quantity,
          price: p.productId?.price || 0,
          notes: p.notes || "",
        })),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/orders`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success(t("order_success_msg"), { id: loadingToast });
        await clearCart();
        setTimeout(() => navigate("/order"), 2000);
      }
    } catch (error) {
      const msg = error.response?.data?.error || t("order_error_msg");
      toast.error(msg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (!cart.products || cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-white/5 p-8 rounded-full mb-6 animate-pulse">
          <ShoppingBag size={80} className="text-orange-500/20" />
        </div>
        <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">{t("cart_empty_title")}</h2>
        <button onClick={() => navigate("/order")} className="bg-orange-500 px-10 py-4 rounded-2xl font-bold">
          {t("browse_menu")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 pb-32 pt-36" dir={isAr ? "rtl" : "ltr"}>
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white border border-white/5 transition-all">
              {isAr ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
            </button>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">{t("checkout_title")}</h1>
          </div>
          <span className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl text-orange-500 font-bold text-sm">
            {cart.products.length} {t("items")}
          </span>
        </div>

        {/* Order Type Tabs */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setOrderType("delivery")} className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-3 ${orderType === "delivery" ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-xl shadow-orange-500/5" : "border-white/5 bg-[#0a0a0a] text-gray-600"}`}>
            <Truck size={32} />
            <span className="font-black uppercase text-xs tracking-widest">{t("delivery")}</span>
          </button>
          <button onClick={() => setOrderType("pickup")} className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-3 ${orderType === "pickup" ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-xl shadow-orange-500/5" : "border-white/5 bg-[#0a0a0a] text-gray-600"}`}>
            <Store size={32} />
            <span className="font-black uppercase text-xs tracking-widest">{t("pickup")}</span>
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
            <h3 className={`font-black italic uppercase flex items-center gap-2 text-gray-400 tracking-tighter text-sm ${isAr ? "text-right" : "text-left"}`}>
              <ClipboardList size={20} className="text-orange-500" /> {t("receiver_info")}
            </h3>

            <div className="space-y-5">
              <div className="relative group">
                <User className={`absolute ${isAr ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors`} size={20} />
                <input required className={`w-full bg-white/5 border border-white/10 p-5 ${isAr ? "pl-12 text-right" : "pr-12 text-left"} rounded-2xl outline-none focus:border-orange-500/50 transition-all`} placeholder={t("full_name_placeholder")} value={userName} onChange={(e) => setUserName(e.target.value)} />
              </div>

              {orderType === "delivery" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="relative group">
                    <MapPin className={`absolute ${isAr ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors z-10`} size={20} />
                    <select
                      required={orderType === "delivery"}
                      value={selectedArea?._id || ""}
                      onChange={(e) => {
                        const area = locations.find((loc) => loc._id === e.target.value);
                        setSelectedArea(area);
                      }}
                      className={`w-full bg-white/5 border border-white/10 p-5 ${isAr ? "pl-12 text-right" : "pr-12 text-left"} rounded-2xl outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer text-white`}
                    >
                      <option value="" className="bg-black">{t("select_area")}</option>
                      {locations.map((loc) => (
                        <option key={loc._id} value={loc._id} className="bg-black">
                          {loc.name} — (+{loc.deliveryCost} {t("currency")})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 pointer-events-none text-gray-600`} />
                  </div>
                </div>
              )}

              <div className="relative group">
                <Phone className={`absolute ${isAr ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors`} size={20} />
                <input required type="tel" className={`w-full bg-white/5 border border-white/10 p-5 ${isAr ? "pl-12 text-left" : "pr-12 text-right"} rounded-2xl outline-none focus:border-orange-500/50 transition-all font-mono`} placeholder="07XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-white/5 space-y-3 font-bold">
               <div className="flex justify-between text-sm text-gray-500 italic">
                 <span>{t("meals_price")}:</span>
                 <span>{total.toFixed(2)} {t("currency")}</span>
               </div>
               {orderType === "delivery" && selectedArea && (
                 <div className="flex justify-between text-sm text-gray-500 italic">
                    <span>{t("delivery_fee")}:</span>
                    <span className="text-orange-500/80">+{selectedArea.deliveryCost.toFixed(2)} {t("currency")}</span>
                 </div>
               )}
               <div className="flex justify-between items-center bg-orange-500/5 p-5 rounded-2xl border border-orange-500/10">
                  <span className="text-gray-200">{t("total_amount")}:</span>
                  <span className="text-3xl font-black text-orange-500 italic">
                    {(total + (orderType === "delivery" ? (selectedArea?.deliveryCost || 0) : 0)).toFixed(2)} {t("currency")}
                  </span>
               </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-[#050505] font-black py-7 rounded-[2.5rem] transition-all flex items-center justify-center gap-4 text-2xl shadow-2xl disabled:opacity-50">
            {loading ? t("processing_order") : t("confirm_order_btn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;