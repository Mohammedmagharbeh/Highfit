import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  ChevronRight,
  ArrowRight,
  Store,
  Truck,
  ClipboardList,
  CreditCard,
  ChevronDown,
  Info
} from "lucide-react";

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState("delivery"); 

  const [locations, setLocations] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  const sessionData = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  const [userName, setUserName] = useState(sessionData?.name || "");
  const [addressNote, setAddressNote] = useState(""); // ملاحظات العنوان (الشارع/البناية)
  const [phone, setPhone] = useState(sessionData?.phone || "");

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
          toast.error("فشل جلب المناطق");
        }
      };
      fetchLocations();
    }
  }, [orderType, token]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!sessionData || !token) {
      toast.error("انتهت الجلسة، يرجى تسجيل الدخول");
      navigate("/log");
      return;
    }

    if (orderType === "delivery" && !selectedArea) {
      toast.error("يرجى اختيار المنطقة للتوصيل");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("جاري معالجة طلبك...");

    try {
      const deliveryFee = orderType === "delivery" ? (selectedArea?.deliveryCost || 0) : 0;
      
      const orderPayload = {
        userId: sessionData._id,
        userName: userName,
        userPhone: phone,
        orderType: orderType,
        
        // --- التعديل الجوهري هنا ---
        address: orderType === "pickup" ? "استلام من المحل" : selectedArea.name, 
        addressDetails: {
          area: selectedArea?.name || "",
          street: addressNote, // إرسال الملاحظات لحقل street المنفصل
        },

        deliveryCost: deliveryFee, // إرسال سعر التوصيل بشكل صريح للسيرفر
        totalAmount: total + deliveryFee,

        items: cart.products.map((p) => ({
          mealId: p.productId?._id || p.productId,
          mealName: p.productId?.name?.ar || "وجبة صحية",
          mealImage: p.productId?.image || "", // إرسال رابط الصورة ليتخزن في السيرفر
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
        toast.success("تم تأكيد طلبك بنجاح! 🎉", { id: loadingToast });
        await clearCart();
        setTimeout(() => navigate("/order"), 2000);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "حدث خطأ أثناء معالجة الطلب";
      toast.error(msg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (!cart.products || cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white/5 p-8 rounded-full mb-6 animate-pulse">
          <ShoppingBag size={80} className="text-orange-500/20" />
        </div>
        <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">سلتك فارغة</h2>
        <button onClick={() => navigate("/order")} className="bg-orange-500 px-10 py-4 rounded-2xl font-bold">تصفح المنيو</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 pb-32 pt-36" dir="rtl">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white border border-white/5 transition-all">
              <ArrowRight size={24} />
            </button>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Checkout</h1>
          </div>
          <span className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl text-orange-500 font-bold text-sm">
            {cart.products.length} أصناف
          </span>
        </div>

        {/* Order Type Tabs */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setOrderType("delivery")} className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-3 ${orderType === "delivery" ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-xl shadow-orange-500/5" : "border-white/5 bg-[#0a0a0a] text-gray-600"}`}>
            <Truck size={32} />
            <span className="font-black uppercase text-xs tracking-widest">التوصيل</span>
          </button>
          <button onClick={() => setOrderType("pickup")} className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-3 ${orderType === "pickup" ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-xl shadow-orange-500/5" : "border-white/5 bg-[#0a0a0a] text-gray-600"}`}>
            <Store size={32} />
            <span className="font-black uppercase text-xs tracking-widest">من المحل</span>
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
            <h3 className="font-black italic uppercase flex items-center gap-2 text-gray-400 tracking-tighter text-sm">
              <ClipboardList size={20} className="text-orange-500" /> معلومات المستلم
            </h3>

            <div className="space-y-5">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input required className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-2xl outline-none focus:border-orange-500/50 transition-all text-right" placeholder="الاسم بالكامل" value={userName} onChange={(e) => setUserName(e.target.value)} />
              </div>

              {orderType === "delivery" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors z-10" size={20} />
                    <select
                      required={orderType === "delivery"}
                      value={selectedArea?._id || ""}
                      onChange={(e) => {
                        const area = locations.find((loc) => loc._id === e.target.value);
                        setSelectedArea(area);
                      }}
                      className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-2xl outline-none focus:border-orange-500/50 transition-all text-right appearance-none cursor-pointer text-white"
                    >
                      <option value="" className="bg-black">اختر المنطقة (Area)</option>
                      {locations.map((loc) => (
                        <option key={loc._id} value={loc._id} className="bg-black">
                          {loc.name} — (+{loc.deliveryCost} JOD)
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" />
                  </div>

                  {/* <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input required className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-2xl outline-none focus:border-orange-500/50 transition-all text-right" placeholder="الشارع، البناية، رقم الشقة" value={addressNote} onChange={(e) => setAddressNote(e.target.value)} />
                  </div> */}
                </div>
              )}

              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input required type="tel" className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-2xl outline-none focus:border-orange-500/50 transition-all text-left font-mono" placeholder="07XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-white/5 space-y-3 font-bold">
               <div className="flex justify-between text-sm text-gray-500 italic">
                  <span>سعر الوجبات:</span>
                  <span>{total.toFixed(2)} JOD</span>
               </div>
               {orderType === "delivery" && selectedArea && (
                 <div className="flex justify-between text-sm text-gray-500 italic">
                    <span>رسوم التوصيل:</span>
                    <span className="text-orange-500/80">+{selectedArea.deliveryCost.toFixed(2)} JOD</span>
                 </div>
               )}
               <div className="flex justify-between items-center bg-orange-500/5 p-5 rounded-2xl border border-orange-500/10">
                  <span className="text-gray-200">المجموع الكلي:</span>
                  <span className="text-3xl font-black text-orange-500 italic">
                    {(total + (orderType === "delivery" ? (selectedArea?.deliveryCost || 0) : 0)).toFixed(2)} JOD
                  </span>
               </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-[#050505] font-black py-7 rounded-[2.5rem] transition-all flex items-center justify-center gap-4 text-2xl shadow-2xl disabled:opacity-50">
            {loading ? "جاري معالجة الطلب..." : "تأكيد الطلب الآن"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;