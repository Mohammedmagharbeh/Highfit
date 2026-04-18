import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  User,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

export default function StaffLoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_BASE_URL;
  const isAr = i18n.language === "ar";

  useEffect(() => {
    if (Cookies.get("staffToken") || Cookies.get("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedStaffUser");
    if (savedUsername) {
      setFormData((prev) => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.username || formData.password.length < 3) {
      toast.error(t("staff_toast_empty_fields"));
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading(t("staff_toast_authenticating"));

    try {
      const response = await axios.post(
        `${API_URL}/staff-secure-login`,
        formData,
      );

      if (response.status === 200) {
        if (rememberMe) {
          localStorage.setItem("rememberedStaffUser", formData.username);
        } else {
          localStorage.removeItem("rememberedStaffUser");
        }

        Cookies.set("staffToken", response.data.token, { expires: 7 });
        Cookies.set("staffUser", JSON.stringify(response.data.user), {
          expires: 7,
        });

        toast.success(t("staff_toast_login_success"), { id: loadingToast });

        const { role } = response.data.user;
        if (role === "admin") {
          navigate("/admin/users");
        } else if (role === "chef") {
          navigate("/chef");
        } else if (role === "trainer_lead" || role === "coach") {
          navigate("/plans");
        } else {
          navigate("/Home");
        }
      }
    } catch (error) {
      const serverMessage =
        error.response?.data?.msg || error.response?.data?.message;
      setError(serverMessage || t("staff_login_failed"));
      toast.error(serverMessage || t("staff_toast_login_fail"), {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <div className="relative w-full lg:w-1/2 h-[30vh] lg:h-screen p-8 lg:p-16 flex flex-col justify-between border-r border-white/5">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070"
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
          alt="staff-bg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent" />

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
          <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
            STAFF <br />
            <span className="text-orange-500">PORTAL</span>
          </h1>
          <div className="h-1.5 w-16 bg-orange-500 mt-4" />
        </div>
      </div>

      <div
        className="relative flex-1 flex items-center justify-center p-6 lg:p-16"
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Shield size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                {t("authorized_personnel_only")}
              </span>
            </div>
            <h2 className="text-3xl font-black italic uppercase">
              {t("staff_authentication_title")}
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/40 tracking-widest px-1">
                {t("username_label")}
              </label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl focus-within:border-orange-500 transition-all">
                <User size={18} className="text-white/20" />
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t("username_placeholder")}
                  className="bg-transparent outline-none flex-1 text-lg font-bold text-white placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/40 tracking-widest px-1">
                {t("password_label")}
              </label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl focus-within:border-orange-500 transition-all">
                <Lock size={18} className="text-white/20" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-transparent outline-none flex-1 text-lg font-bold text-white placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 text-[11px] uppercase font-black tracking-widest text-white/40 hover:text-orange-500 transition-colors"
              >
                {rememberMe ? (
                  <CheckSquare size={16} className="text-orange-500" />
                ) : (
                  <Square size={16} />
                )}
                {t("remember_me_label")}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 py-5 rounded-xl font-black italic uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-[0_0_30_rgba(249,115,22,0.2)] active:scale-95 disabled:opacity-40 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {t("authenticating_wait")}
                </>
              ) : (
                t("login_to_system_btn")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
