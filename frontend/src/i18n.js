// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
// import Backend from "i18next-http-backend";

// i18n
//   .use(Backend) // load translations from /public/locales
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     fallbackLng: "en",
//     supportedLngs: ["en", "ar"],
//     debug: false,
//     detection: {
//       order: ["localStorage", "navigator", "htmlTag"],
//       caches: ["localStorage"],
//     },
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18n;
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    backend: {
      // السلاش البادئ / ضروري جداً لأنه يشير لمجلد الببلك بعد الـ Build
backend: {
  // السلاش في البداية يعني "ابحث في المجلد العام للمشروع"
  loadPath: '/locales/{{lng}}.json', 
},    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });
