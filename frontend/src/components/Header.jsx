import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { NAV_LINKS } from "../../constant";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../ui/LanguageSwitcher";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isLoginPage = location.pathname === "/log";

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem("token"));
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/log");
  };

  return (
    <nav className="fixed w-full bg-[#0a0a0a]/95 backdrop-blur-md z-[999] border-b border-white/10 top-0 left-0">
      <div className="max-w-7xl mx-auto px-6 py-3 lg:py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-3xl font-bold tracking-tighter cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-orange-500">HIGH</span>
          <span className="text-white"> FIT</span>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-8">
          
          {/* Desktop Navigation */}
          {!isLoginPage && (
            <div className="hidden md:flex items-center gap-6">
              {!isLoggedIn ? (
                <>
                  <a href="#about" className="text-white/80 hover:text-orange-500 transition">{t("about")}</a>
                  <a href="#programs" className="text-white/80 hover:text-orange-500 transition">{t("programs")}</a>
                  <a href="#features" className="text-white/80 hover:text-orange-500 transition">{t("features")}</a>
                  <a href="#contact" className="text-white/80 hover:text-orange-500 transition">{t("nav_contact")}</a>
                  
                  {/* زر Join Now بيضاوي */}
                  <button
                    onClick={() => navigate("/log")}
                    className="bg-orange-500 text-white px-8 py-2.5 rounded-full font-bold hover:opacity-90 transition shadow-lg shadow-orange-500/10"
                  >
                    {t("join_now")}
                  </button>
                </>
              ) : (
                <>
                  {NAV_LINKS.map((link) => (
                    <Link 
                      key={link.to} 
                      to={link.to} 
                      className={`text-white/80 hover:text-orange-500 transition ${location.pathname === link.to ? "text-orange-500" : ""}`}
                    >
                      {t(link.label)}
                    </Link>
                  ))}
                  {/* زر Logout بيضاوي */}
                  <button
                    onClick={handleLogout}
                    className="bg-orange-500 text-white px-8 py-2.5 rounded-full font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    <span>{t("logout")}</span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Language Switcher */}
          <div className={`${!isLoginPage ? "border-l border-white/20 pl-4" : ""}`}>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Toggle */}
          {!isLoginPage && (
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-orange-500 p-2">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Content */}
        {!isLoginPage && isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-white/10 md:hidden animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-6 p-8 bg-[#0a0a0a]">
              {!isLoggedIn ? (
                <>
                  <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-xl text-white/80 font-bold">{t("about")}</a>
                  <a href="#programs" onClick={() => setIsMenuOpen(false)} className="text-xl text-white/80 font-bold">{t("programs")}</a>
                  <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-xl text-white/80 font-bold">{t("features")}</a>
                  <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-xl text-white/80 font-bold">{t("nav_contact")}</a>
                  <hr className="border-white/10" />
                  {/* زر Join Now بيضاوي في الموبايل */}
                  <button
                    onClick={() => { navigate("/log"); setIsMenuOpen(false); }}
                    className="bg-orange-500 text-white w-full py-4 rounded-full font-bold text-lg shadow-lg shadow-orange-500/20"
                  >
                    {t("join_now")}
                  </button>
                </>
              ) : (
                <>
                  {NAV_LINKS.map((link) => (
                    <Link 
                      key={link.to} 
                      to={link.to} 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xl text-white/80 font-bold"
                    >
                      {t(link.label)}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="bg-orange-500 text-white w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
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