import React, { useState } from "react";
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
  ReceiptText,
  ClipboardList,
  CreditCard,
} from "lucide-react";

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState("delivery"); // 'delivery' or 'pickup'

  const sessionData = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  // الحقول المسترجعة من الجلسة أو فارغة
  const [userName, setUserName] = useState(sessionData?.name || "");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(sessionData?.phone || "");

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!sessionData || !token) {
      toast.error("انتهت الجلسة، يرجى تسجيل الدخول");
      navigate("/log");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("جاري معالجة طلبك الفخم...");

    try {
      const orderPayload = {
        userId: sessionData._id,
        userName: userName,
        userPhone: phone,
        address: orderType === "pickup" ? "استلام من المحل" : address,
        totalAmount: total,
        items: cart.products.map((p) => ({
          mealId: p.productId?._id || p.productId,
          mealName: p.productId?.name?.ar || "وجبة صحية",
          quantity: p.quantity,
          price: p.productId?.price || 0,
          notes: p.notes || "",
        })),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/orders`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } },
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
        <div className="bg-white/5 p-8 rounded-full mb-6">
          <ShoppingBag size={80} className="text-orange-500/20" />
        </div>
        <h2 className="text-3xl font-black mb-2">سلتك خالية</h2>
        <p className="text-gray-500 mb-8">
          أضف بعض الوجبات الصحية لتبدأ رحلة الرشاقة!
        </p>
        <button
          onClick={() => navigate("/order")}
          className="bg-orange-500 px-10 py-4 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
        >
          تصفح المنيو
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#050505] text-white p-6 pb-32 pt-36"
      dir="rtl"
    >
      <Toaster position="top-center" />

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Checkout
            </h1>
          </div>
          <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-orange-500 font-bold">
            {cart.products.length} وجبات
          </span>
        </div>

        {/* 1. الفاتورة التفصيلية مع الصور */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2 text-orange-500">
              <ReceiptText size={22} />
              <h2 className="font-bold text-lg text-white">ملخص الطلب</h2>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {cart.products.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-3xl border border-white/5"
              >
                <div className="flex items-center gap-4">
                  {/* صورة الوجبة */}
                  <div className="relative">
                    <img
                      src={item.productId?.image}
                      alt={item.productId?.name?.ar}
                      className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                    />
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-black text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">
                      {item.productId?.name?.ar}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.productId?.price} JOD للوحدة
                    </p>
                    {item.notes && (
                      <p className="text-[10px] text-orange-400/70 italic mt-1 font-medium">
                        ملاحظة: {item.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-left font-black text-orange-500 text-lg">
                  {(item.productId?.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-orange-500/10 border-t border-white/10 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-gray-400 font-bold">إجمالي الحساب</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                Total Amount
              </span>
            </div>
            <span className="text-orange-500 font-black text-4xl">
              {total.toFixed(2)} <span className="text-sm">JOD</span>
            </span>
          </div>
        </div>

        {/* 2. خيارات التوصيل أو الاستلام */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setOrderType("delivery")}
            className={`p-6 rounded-[2.5rem] border transition-all duration-300 flex flex-col items-center gap-3 ${orderType === "delivery" ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-lg shadow-orange-500/5" : "border-white/5 bg-[#0a0a0a] text-gray-600 hover:text-gray-400"}`}
          >
            <Truck size={32} />
            <span className="font-black uppercase text-sm tracking-tighter">
              Delivery
            </span>
          </button>
          <button
            onClick={() => setOrderType("pickup")}
            className={`p-6 rounded-[2.5rem] border transition-all duration-300 flex flex-col items-center gap-3 ${orderType === "pickup" ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-lg shadow-orange-500/5" : "border-white/5 bg-[#0a0a0a] text-gray-600 hover:text-gray-400"}`}
          >
            <Store size={32} />
            <span className="font-black uppercase text-sm tracking-tighter">
              Pickup
            </span>
          </button>
        </div>

        {/* 3. فورم البيانات */}
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <h3 className="font-black italic uppercase flex items-center gap-2 mb-2 text-gray-400">
              <ClipboardList size={20} className="text-orange-500" /> Shipping
              Details
            </h3>

            <div className="space-y-4">
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors"
                  size={20}
                />
                <input
                  required
                  className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all text-right"
                  placeholder="الاسم بالكامل"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              {orderType === "delivery" && (
                <div className="relative group animate-in slide-in-from-top-2 duration-300">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors"
                    size={20}
                  />
                  <input
                    required={orderType === "delivery"}
                    className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all text-right"
                    placeholder="العنوان بالتفصيل (المدينة، الحي، الشارع)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}

              <div className="relative group">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors"
                  size={20}
                />
                <input
                  required
                  type="tel"
                  className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all text-left font-mono"
                  placeholder="07XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-[#050505] font-black py-7 rounded-[2.5rem] transition-all flex items-center justify-center gap-4 text-2xl shadow-2xl shadow-orange-500/20 disabled:opacity-50 group"
          >
            {loading ? (
              "جاري المعالجة..."
            ) : (
              <>
                <CreditCard size={28} />
                تأكيد الطلب الآن
                <ChevronRight
                  size={28}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
