

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { NAV_LINKS } from "../../constant"; 

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem("token"));
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/log");
  };

  if (location.pathname === "/log") return null;

  return (
   <nav className="fixed w-full bg-[#0a0a0a]/95 backdrop-blur-md z-50 border-b border-white/10">
      {/* تم زيادة الـ py إلى 8 ليعطيك عرض (ارتفاع عمودي) واضح وفخم */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        
        {/* Logo - كبّرنا الخط شوي ليناسب العرض الجديد */}
        <div className="text-3xl font-bold tracking-tighter">
          <span className="text-orange-500">HIGH</span>
          <span className="text-white"> FIT</span>
        </div>
        
        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-orange-500">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links Container */}
        <div className={`absolute md:static top-16 left-0 right-0 md:right-auto bg-[#0a0a0a] md:bg-transparent border-b md:border-b-0 border-white/10 md:border-0 ${isMenuOpen ? "block" : "hidden"} md:flex gap-8`}>
          <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 md:p-0">
            
            {!isLoggedIn ? (
              // وضع الزوار: الروابط + زر Join Now الأصلي
              <>
                <a href="#about" className="text-white/80 hover:text-orange-500 transition">About</a>
                <a href="#programs" className="text-white/80 hover:text-orange-500 transition">Programs</a>
                <a href="#features" className="text-white/80 hover:text-orange-500 transition">Features</a>
                <a href="#contact" className="text-white/80 hover:text-orange-500 transition">Contact</a>
                <button
                  onClick={() => navigate("/log")}
                  className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
                >
                  Join Now
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
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;