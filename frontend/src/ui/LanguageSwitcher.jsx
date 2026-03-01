

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  useEffect(() => {
    const dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = dir;
    
    if (isAr) {
      document.documentElement.style.fontFamily = "'STC', sans-serif";
    } else {
      document.documentElement.style.fontFamily = "'Baloo Tammudu 2', sans-serif";
    }
  }, [i18n.language, isAr]);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <div className="flex items-center gap-2 bg-[#0f0f0f] border border-white/10 p-1 rounded-full shadow-2xl group">
      {/* أيقونة الكرة الأرضية */}
      <div className="pl-2 pr-1 border-r border-white/5">
        <Globe 
          size={14} 
          className={`transition-colors duration-500 ${isAr ? 'text-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'text-white'}`} 
        />
      </div>

      <div className="flex items-center gap-1">
        {/* English Button */}
        <button
          onClick={() => changeLang("en")}
          className={`px-3 py-1 rounded-full text-[10px] font-black transition-all duration-300 tracking-tighter
            ${!isAr 
              ? "text-orange-500 bg-orange-500/10 shadow-[0_0_10px_rgba(249,115,22,0.15)]" 
              : "text-white hover:text-orange-400"
            }`}
        >
          EN
        </button>

        {/* Arabic Button */}
        <button
          onClick={() => changeLang("ar")}
          className={`px-3 py-1 rounded-full text-[10px] font-black transition-all duration-300
            ${isAr 
              ? "text-orange-500 bg-orange-500/10 shadow-[0_0_10px_rgba(249,115,22,0.15)]" 
              : "text-white hover:text-orange-400"
            }`}
        >
          ع
        </button>
      </div>
    </div>
  );
}

export default React.memo(LanguageSwitcher);