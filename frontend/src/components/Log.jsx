import React, { useState, useRef, useEffect } from "react";
import {
  Shield,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  useEffect(() => {
    if (Cookies.get("token") || Cookies.get("staffToken")) {
      navigate("/plans", { replace: true });
    }
  }, [navigate]);

  const { fetchCart } = useCart();
  const API_URL = import.meta.env.VITE_BASE_URL;
  const isAr = i18n.language === "ar";

  const formatPhoneForServer = (inputPhone) => {
    let clean = inputPhone.replace(/\s/g, "");
    if (clean.startsWith("0")) return "962" + clean.substring(1);
    return clean.startsWith("962") ? clean : "962" + clean;
  };

  useEffect(() => {
    const checkPhone = async () => {
      const cleanPhone = phone.replace(/\s/g, "");
      if (cleanPhone.length >= 9) {
        setIsCheckingPhone(true);
        try {
          const serverPhone = formatPhoneForServer(cleanPhone);
          const res = await axios.post(`${API_URL}/check-phone`, {
            phone: serverPhone,
          });
          if (res.data.exists) {
            setPhoneExists(true);
            setShowUsername(false);
          } else {
            setPhoneExists(false);
            setShowUsername(true);
          }
        } catch (error) {
          console.error(error);
          setPhoneExists(false);
          setShowUsername(true);
        } finally {
          setIsCheckingPhone(false);
        }
      } else {
        setPhoneExists(false);
        setShowUsername(false);
      }
    };

    const timeoutId = setTimeout(checkPhone, 500);
    return () => clearTimeout(timeoutId);
  }, [phone, API_URL]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (phone.length < 9 || isLoading || isCheckingPhone) return;
    if (!phoneExists && !username.trim()) return;

    setIsLoading(true);
    try {
      const serverPhone = formatPhoneForServer(phone);
      await axios.post(`${API_URL}/login`, {
        phone: serverPhone,
        username: phoneExists ? "" : username.trim(),
      });
      setStep("otp");
    } catch (error) {
      alert(error.response?.data?.msg || t("send_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTPCode = async (otpString) => {
    if (otpString.length < 4 || isLoading) return;
    setIsLoading(true);
    try {
      const serverPhone = formatPhoneForServer(phone);
      const response = await axios.post(`${API_URL}/verify-otp`, {
        phone: serverPhone,
        otp: otpString,
      });

      if (response.status === 200) {
        Cookies.set("token", response.data.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 });
        if (fetchCart) await fetchCart();
        navigate("/plans");
      }
    } catch (error) {
      alert(error.response?.data?.msg || t("invalid_otp"));
      setOtp(["", "", "", ""]);
      otpRefs.current[0].focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) otpRefs.current[index + 1].focus();
    const currentOtpString = newOtp.join("");
    if (currentOtpString.length === 4) verifyOTPCode(currentOtpString);
  };

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <div className="relative w-full lg:w-1/2 h-[35vh] lg:h-screen p-8 lg:p-16 flex flex-col justify-between border-r border-white/5">
        <img
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070"
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          alt="gym"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0a0a0a]/40" />
        <div className="relative z-10 text-white/40">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-orange-500 uppercase font-black italic text-[10px] tracking-widest transition-all"
          >
            {isAr ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}{" "}
            {t("back_to_arena")}
          </Link>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl lg:text-8xl font-black italic tracking-tighter uppercase leading-none text-orange-500">
            HIGH <br />
            <span className="text-white">FIT</span>
          </h1>
          <div className="h-2 w-24 bg-orange-500 mt-4" />
        </div>
      </div>

      <div
        className="relative flex-1 flex items-center justify-center p-6 lg:p-16"
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-md space-y-12">
          <div className={`${isAr ? "text-right" : "text-left"} space-y-4`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Shield size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                {t("secure_protocol")}
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black italic uppercase">
              {step === "phone"
                ? isAr
                  ? "تسجيل الدخول"
                  : "Login"
                : t("verify_identity")}
            </h2>
          </div>

          <div className="space-y-6">
            {step === "phone" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div
                  className={`flex items-center gap-3 bg-white/5 border ${isCheckingPhone ? "border-orange-500/50" : "border-white/10"} p-5 rounded-xl focus-within:border-orange-500 transition-all relative`}
                  dir="ltr"
                >
                  <Phone size={20} className="text-white/20" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    className="bg-transparent outline-none flex-1 text-xl font-bold tracking-[0.2em] text-white"
                    required
                  />
                  {isCheckingPhone && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {showUsername && (
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-5 rounded-xl focus-within:border-orange-500 transition-all animate-[fadeIn_0.3s_ease-out]">
                    <UserIcon size={20} className="text-white/20" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={isAr ? "الاسم الكامل" : "Full Name"}
                      className="bg-transparent outline-none flex-1 text-lg font-bold text-white"
                      required={showUsername}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    phone.replace(/\s/g, "").length < 9 ||
                    isCheckingPhone ||
                    (!phoneExists && !username.trim()) ||
                    isLoading
                  }
                  className="w-full bg-orange-500 py-5 rounded-xl font-black italic uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-[0_0_30px_rgba(249,115,22,0.2)] disabled:opacity-40 active:scale-95"
                >
                  {isLoading || isCheckingPhone
                    ? t("initializing")
                    : t("request_code")}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center gap-3" dir="ltr">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0)
                          otpRefs.current[i - 1].focus();
                      }}
                      className="h-14 w-12 rounded-xl border border-white/10 bg-white/5 text-center text-2xl font-black text-orange-500 outline-none focus:border-orange-500 transition-all shadow-lg"
                    />
                  ))}
                </div>
                <button
                  onClick={() => verifyOTPCode(otp.join(""))}
                  disabled={isLoading || otp.join("").length < 4}
                  className="w-full bg-white text-black py-5 rounded-xl font-black italic uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? t("verifying") : t("confirm_enter")}
                </button>
                <button
                  onClick={() => {
                    setStep("phone");
                    setOtp(["", "", "", ""]);
                  }}
                  className="w-full text-[10px] font-bold text-white/20 uppercase hover:text-orange-500 transition-colors"
                >
                  {t("different_number")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
