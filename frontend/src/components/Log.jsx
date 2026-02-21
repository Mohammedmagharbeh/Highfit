
import React, { useState, useRef } from "react";
import { Shield, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // استيراد أكسيوس

export default function LoginPage() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // استخدام المسار من ملف الـ .env
  const API_URL = import.meta.env.VITE_BASE_URL;

  // 1. فنكشن إرسال الرمز (Login)
  const handleSendOTP = async () => {
    if (phone.length < 9) return;
    setIsLoading(true);
    
    try {
      const cleanPhone = `962${phone.replace(/\s/g, "")}`;
      
      // تحويل لـ axios.post
      const response = await axios.post(`${API_URL}/login`, { 
        phone: cleanPhone 
      });

      if (response.status === 200) {
        setStep("otp");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.msg || "خطأ في إرسال الرمز");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. فنكشن التحقق من الرمز (Verify)
  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 4) return; 
    setIsLoading(true);

    try {
      const cleanPhone = `962${phone.replace(/\s/g, "")}`;
      
      // تحويل لـ axios.post
      const response = await axios.post(`${API_URL}/verify-otp`, {
        phone: cleanPhone,
        otp: otpString
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/Home"); 
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert(error.response?.data?.msg || "الرمز غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) { 
      otpRefs.current[index + 1].focus();
    }
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
        <div className="relative z-10">
           <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-orange-500 transition-colors uppercase font-black italic text-[10px] tracking-[0.3em]">
            <ChevronLeft size={16} /> Back to Arena
          </Link>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl lg:text-8xl font-black italic tracking-tighter uppercase leading-none">
            <span className="text-orange-500">HIGH</span><br />FIT
          </h1>
          <div className="h-1 lg:h-2 w-16 lg:w-24 bg-orange-500 mt-4" />
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Shield size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Secure Protocol</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black italic uppercase">
              {step === "phone" ? "Welcome Back" : "Verify Identity"}
            </h2>
          </div>

          <div className="space-y-6">
            {step === "phone" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl focus-within:border-orange-500">
                  <span className="text-white/40 font-bold border-r border-white/10 pr-3">+962</span>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="7XXXXXXXX" 
                    className="bg-transparent outline-none flex-1 text-lg font-bold tracking-widest" 
                  />
                </div>
                <button 
                  onClick={handleSendOTP} 
                  disabled={phone.length < 9 || isLoading} 
                  className="w-full bg-orange-500 py-5 rounded-xl font-black italic uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-40"
                >
                  {isLoading ? "INITIALIZING..." : "Request Access Code"}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center gap-2" dir="ltr">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => e.key === "Backspace" && !otp[i] && i > 0 && otpRefs.current[i - 1].focus()}
                      className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border border-white/10 bg-white/5 text-center text-xl font-bold text-orange-500 outline-none focus:border-orange-500"
                    />
                  ))}
                </div>
                <button 
                  onClick={handleVerify} 
                  disabled={isLoading} 
                  className="w-full bg-white text-black py-5 rounded-xl font-black italic uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {isLoading ? "VERIFYING..." : "Confirm & Enter"}
                </button>
                <button onClick={() => setStep("phone")} className="w-full text-[10px] font-bold text-white/20 uppercase hover:text-orange-500">
                  Try Different Number
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}