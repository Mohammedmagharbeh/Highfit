import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Dumbbell,
  ClipboardList,
  ShoppingCart,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import NotificationsDropdown from "./NotificationsDropdown";

// استيراد الشعار
import logo from "../assets/Asset 1 (1).png";
import logooo from "../assets/Asset 2 (3).png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token") || !!sessionStorage.getItem("staffToken"),
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const staffUser = sessionStorage.getItem("staffUser")
    ? JSON.parse(sessionStorage.getItem("staffUser"))
    : null;
  const regularUser = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;

  const currentUser = staffUser || regularUser;
  const role = currentUser?.role || "user";

  const isLoginPage =
    location.pathname === "/log" || location.pathname === "/staff";

  useEffect(() => {
    setIsLoggedIn(
      !!sessionStorage.getItem("token") ||
        !!sessionStorage.getItem("staffToken"),
    );
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("staffToken");
    sessionStorage.removeItem("staffUser");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    navigate("/");
  };

  const getLinksForRole = () => {
    switch (role) {
      case "admin":
        return [
          { to: "/admin/users", label: "USERS", icon: ShieldCheck },
          { to: "/plans", label: "plans", icon: ClipboardList },
          { to: "/templates", label: "templates", icon: ClipboardList },
          {
            to: "/admin/subscriptions",
            label: "subscriptions",
            icon: LayoutDashboard,
          },
          { to: "/adminjobs", label: "admin_jobs", icon: UserCircle },
          { to: "/templates", label: "templates", icon: ClipboardList },
        ];
      case "chef":
        return [{ to: "/chef", label: "chef_dashboard", icon: ClipboardList }];
      case "coach":
      case "trainer_lead":
        return [
          { to: "/plans", label: "plans", icon: ClipboardList },
          { to: "/templates", label: "templates", icon: ClipboardList },
        ];
      default: // user
        return [
          // { to: "/", label: "home", icon: Dumbbell },
          { to: "/plans", label: "plans", icon: ClipboardList },
          // { to: "/order", label: "orders", icon: ShoppingCart },
          // { to: "/cart", label: "cart", icon: ShoppingCart },
          // { to: "/JobsPage", label: "jobs", icon: UserCircle },
          // { to: "/plan", label: "Package", icon: ClipboardList },
        ];
    }
  };

  const userLinks = getLinksForRole();

  return (
    <nav className="fixed w-full bg-[#0a0a0a]/95 backdrop-blur-md z-[999] border-b border-white/10 top-0 left-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo - تم استبدال النص بالصورة هنا */}
        <div
          className="cursor-pointer flex items-center hover:scale-105 transition-transform"
          onClick={() => navigate("/")}
        >
          <img
            src={logooo}
            alt="High Fit Logo"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          {/* Desktop Navigation */}
          {!isLoginPage && (
            <div className="hidden md:flex items-center gap-6">
              {!isLoggedIn ? (
                <>
                  <a
                    href="#about"
                    className="text-white/70 hover:text-orange-500 transition-colors font-bold text-sm uppercase tracking-wide"
                  >
                    {t("about")}
                  </a>
                  <a
                    href="#programs"
                    className="text-white/70 hover:text-orange-500 transition-colors font-bold text-sm uppercase tracking-wide"
                  >
                    {t("programs")}
                  </a>
                  <a
                    href="#features"
                    className="text-white/70 hover:text-orange-500 transition-colors font-bold text-sm uppercase tracking-wide"
                  >
                    {t("features")}
                  </a>
                  <a
                    href="#contact"
                    className="text-white/70 hover:text-orange-500 transition-colors font-bold text-sm uppercase tracking-wide"
                  >
                    {t("nav_contact")}
                  </a>

                  <button
                    onClick={() => navigate("/log")}
                    className="bg-orange-600 text-black px-8 py-2.5 rounded-2xl font-black uppercase hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/20 ml-2"
                  >
                    {t("join_now")}
                  </button>
                </>
              ) : (
                <>
                  {/* Dynamic Links Based on Role */}
                  <div className="flex items-center gap-6 bg-white/5 px-6 py-2 rounded-[2rem] border border-white/5">
                    {userLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.to;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={`flex items-center gap-2 font-bold text-sm transition-all relative group ${isActive ? "text-orange-500" : "text-white/70 hover:text-white"}`}
                        >
                          <Icon
                            size={16}
                            className={`${isActive ? "text-orange-500" : "group-hover:text-orange-500 transition-colors"}`}
                          />
                          <span className="uppercase tracking-wide">
                            {t(link.label)}
                          </span>
                          {isActive && (
                            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]"></span>
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4">
                    <NotificationsDropdown />

                    <button
                      onClick={handleLogout}
                      className="group bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white hover:text-red-500 px-6 py-2.5 rounded-[2rem] font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut
                        size={18}
                        className="transition-transform group-hover:-translate-x-1"
                      />
                      <span className="uppercase text-sm tracking-wide">
                        {t("logout")}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Language Switcher */}
          <div
            className={`${!isLoginPage ? "border-l border-white/20 pl-6" : ""}`}
          >
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Toggle */}
          {!isLoginPage && (
            <div className="md:hidden flex items-center gap-4 border-l border-white/20 pl-4">
              {isLoggedIn && <NotificationsDropdown />}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-orange-500 transition-colors bg-white/5 p-2 rounded-xl"
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Content */}
        {!isLoginPage && isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 md:hidden animate-in slide-in-from-top duration-300 shadow-2xl z-[900]">
            <div className="flex flex-col gap-4 p-8">
              {!isLoggedIn ? (
                <>
                  <a
                    href="#about"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl text-white/70 hover:text-orange-500 transition-colors font-bold uppercase"
                  >
                    {t("about")}
                  </a>
                  <a
                    href="#programs"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl text-white/70 hover:text-orange-500 transition-colors font-bold uppercase"
                  >
                    {t("programs")}
                  </a>
                  <a
                    href="#features"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl text-white/70 hover:text-orange-500 transition-colors font-bold uppercase"
                  >
                    {t("features")}
                  </a>
                  <button
                    onClick={() => {
                      navigate("/log");
                      setIsMenuOpen(false);
                    }}
                    className="mt-4 bg-orange-600 text-black w-full py-4 rounded-2xl font-black text-lg uppercase shadow-lg shadow-orange-500/20"
                  >
                    {t("join_now")}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    {userLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.to;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold uppercase ${isActive ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : "bg-white/5 text-white/70 border border-white/5"}`}
                        >
                          <Icon size={20} />
                          {t(link.label)}
                        </Link>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="mt-6 bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white w-full py-4 rounded-2xl font-black text-lg uppercase transition-all flex items-center justify-center gap-3"
                  >
                    <LogOut size={22} />
                    <span>{t("logout")}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
