// // // import React, { useEffect } from "react";
// // // import { useTranslation } from "react-i18next";

// // // function LanguageSwitcher() {
// // //   const { i18n } = useTranslation();

// // //   useEffect(() => {
// // //     // set document direction and lang attr whenever language changes
// // //     const dir = i18n.language === "ar" ? "rtl" : "ltr";
// // //     document.documentElement.lang = i18n.language;
// // //     document.documentElement.dir = dir;
// // //     // optional: change font for Arabic
// // //     if (i18n.language === "ar") {
// // //       document.documentElement.style.fontFamily = "'STC', sans-serif";
// // //     } else {
// // //       document.documentElement.style.fontFamily = "'Baloo Tammudu 2'";
// // //     }
// // //   }, [i18n.language]);

// // //   const changeLang = (lng) => {
// // //     i18n.changeLanguage(lng);
// // //     localStorage.setItem("i18nextLng", lng);
// // //   };

// // //   return (
// // //     <div className="flex items-center gap-1.5 sm:gap-2">
// // //       <div className="flex items-center gap-1 bg-white rounded-lg p-1 border-2 border-red-600 shadow-md">
// // //         <button
// // //           onClick={() => changeLang("en")}
// // //           className={`
// // //             px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 
// // //             text-xs sm:text-sm md:text-base font-bold 
// // //             rounded-md transition-all duration-300
// // //             ${
// // //               i18n.language === "en"
// // //                 ? "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg scale-105"
// // //                 : "bg-transparent text-red-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-red-50"
// // //             }
// // //           `}
// // //           aria-label="Switch to English"
// // //         >
// // //           EN
// // //         </button>

// // //         <div className="w-px h-6 bg-red-300" />

// // //         <button
// // //           onClick={() => changeLang("ar")}
// // //           className={`
// // //             px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 
// // //             text-xs sm:text-sm md:text-base font-bold 
// // //             rounded-md transition-all duration-300
// // //             ${
// // //               i18n.language === "ar"
// // //                 ? "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg scale-105"
// // //                 : "bg-transparent text-red-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-red-50"
// // //             }
// // //           `}
// // //           aria-label="التبديل إلى العربية"
// // //         >
// // //           ع
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default React.memo(LanguageSwitcher);

// // import React, { useEffect } from "react";
// // import { useTranslation } from "react-i18next";
// // import { Globe } from "lucide-react"; // اختيارية لإضافة لمسة جمالية

// // function LanguageSwitcher() {
// //   const { i18n } = useTranslation();
// //   const isAr = i18n.language === "ar";

// //   useEffect(() => {
// //     const dir = isAr ? "rtl" : "ltr";
// //     document.documentElement.lang = i18n.language;
// //     document.documentElement.dir = dir;
    
// //     // إدارة الخطوط بناءً على اللغة
// //     if (isAr) {
// //       document.documentElement.style.fontFamily = "'STC', sans-serif";
// //     } else {
// //       document.documentElement.style.fontFamily = "'Baloo Tammudu 2', sans-serif";
// //     }
// //   }, [i18n.language, isAr]);

// //   const toggleLang = () => {
// //     const nextLang = isAr ? "en" : "ar";
// //     i18n.changeLanguage(nextLang);
// //     localStorage.setItem("i18nextLng", nextLang);
// //   };

// //   return (
// //     <div className="flex items-center gap-2 group">
// //       {/* حاوية السويتش الخارجية */}
// //       <div 
// //         onClick={toggleLang}
// //         className="relative w-20 h-9 bg-white/5 border border-white/10 rounded-full cursor-pointer p-1 transition-all duration-500 hover:border-orange-500/50 shadow-inner"
// //       >
// //         {/* المؤشر المتحرك (Slider) */}
// //         <div 
// //           className={`absolute top-1 bottom-1 w-8 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
// //             ${isAr ? 'left-1' : 'left-[calc(100%-2.25rem)]'}`}
// //         />

// //         {/* النصوص فوق السويتش */}
// //         <div className="absolute inset-0 flex justify-between items-center px-3 select-none pointer-events-none">
// //           <span className={`text-[10px] font-black transition-opacity duration-300 ${isAr ? 'text-black' : 'text-white/40'}`}>
// //             AR
// //           </span>
// //           <span className={`text-[10px] font-black transition-opacity duration-300 ${!isAr ? 'text-black' : 'text-white/40  '}`}>
// //             EN
// //           </span>
// //         </div>
// //       </div>

//     //   <Globe size={14} className="text-white/20 group-hover:text-orange-500 transition-colors duration-300" />
// //     </div>
// //   );
// // }

// // export default React.memo(LanguageSwitcher);
// import React, { useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Globe } from "lucide-react"; // اختيارية لإضافة لمسة جمالية


// function LanguageSwitcher() {
//   const { i18n } = useTranslation();
//   const isAr = i18n.language === "ar";

//   useEffect(() => {
//     const dir = isAr ? "rtl" : "ltr";
//     document.documentElement.lang = i18n.language;
//     document.documentElement.dir = dir;
    
//     if (isAr) {
//       document.documentElement.style.fontFamily = "'STC', sans-serif";
//     } else {
//       document.documentElement.style.fontFamily = "'Baloo Tammudu 2', sans-serif";
//     }
//   }, [i18n.language, isAr]);

//   const changeLang = (lng) => {
//     i18n.changeLanguage(lng);
//     localStorage.setItem("i18nextLng", lng);
//   };

//   return (
//     <div className="flex items-center gap-1 bg-[#111] border border-white/10 p-1 rounded-full w-fit shadow-lg">
//       {/* English Button */}
//       <button
//         onClick={() => changeLang("en")}
//         className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all duration-300 tracking-tighter
//           ${!isAr 
//             ? "text-orange-500 bg-orange-500/10 shadow-[0_0_12px_rgba(249,115,22,0.2)]" 
//             : "text-white hover:text-orange-400"
//           }`}
//       >
//         EN
//       </button>

//       {/* Arabic Button */}
//       <button
//         onClick={() => changeLang("ar")}
//         className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all duration-300
//           ${isAr 
//             ? "text-orange-500 bg-orange-500/10 shadow-[0_0_12px_rgba(249,115,22,0.2)]" 
//             : "text-white hover:text-orange-400"
//           }`}
//       >
//         Ar
//       </button>
//       <Globe size={14} className="text-white/20 group-hover:text-orange-500 transition-colors duration-300" />

//     </div>
    
//   );
// }

// export default React.memo(LanguageSwitcher);

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
          Ar
        </button>
      </div>
    </div>
  );
}

export default React.memo(LanguageSwitcher);