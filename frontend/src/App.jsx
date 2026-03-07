
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./components/Home";
// import AdminJobs from "./components/Adminjob";
// import JobsPage from "./components/JobPage";
// import LoginPage from "./components/Log";
// import TrainingNutrition from "./components/TrainingNutrition";
// import ChefDashboard from "./components/ChefDashboard";
// import UserOrder from "./components/UserOrder";
// import ProtectedRoute from "./ProtectedRoute";
// import Cart from "./components/Cart";
// import Checkout from "./components/Checkout";
// import Header from "./components/Header"; 
// import SubscriptionCard from "./components/SubscriptionCard";
// import AdminSubs from "./components/AdminSubs";
// import Plans from "./components/Plans";
// import { CartProvider } from "./context/CartContext"; 
// import { UserProvider } from "./context/userContext";
// import { useTranslation } from "react-i18next";

// import "./index.css";
// import "./i18n"; 

// function AppContent() {
//   const { i18n } = useTranslation();
//   const isAr = i18n.language === "ar";

//   return (
//     <div dir={isAr ? "rtl" : "ltr"} className={isAr ? "font-arabic" : "font-sans"}>
//       <Header />
      
//       <main className="pt-24 min-h-screen bg-[#0a0a0a]">
//         <Routes>
//           <Route path="/subscriptions" element={<SubscriptionCard />} />
// <Route path="/plan" element={<Plans />} />
//           <Route path="/admin/subscriptions" element={<AdminSubs />} />
//           <Route path="/log" element={<LoginPage />} /> 
//           <Route path="/" element={<Home />} /> 
//           <Route path="/adminjobs" element={<ProtectedRoute><AdminJobs /></ProtectedRoute>} />
//           <Route path="/JobsPage" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
//           <Route path="/plans" element={<ProtectedRoute><TrainingNutrition /></ProtectedRoute>} />
//           <Route path="/order" element={<ProtectedRoute><UserOrder /></ProtectedRoute>} />
//           <Route path="/chef" element={<ProtectedRoute><ChefDashboard /></ProtectedRoute>} />
//           <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
//           <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
//           <Route path="*" element={<Home />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// function App() {
//   return (
//     <UserProvider>
//       <CartProvider>
//         <BrowserRouter>
//           <AppContent />
//         </BrowserRouter>
//       </CartProvider>
//     </UserProvider>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AdminJobs from "./components/Adminjob";
import JobsPage from "./components/JobPage";
import LoginPage from "./components/Log";
import TrainingNutrition from "./components/TrainingNutrition";
import ChefDashboard from "./components/ChefDashboard";
import UserOrder from "./components/UserOrder";
import ProtectedRoute from "./ProtectedRoute";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Header from "./components/Header"; 
import SubscriptionCard from "./components/SubscriptionCard";
import AdminSubscriptions from "./components/AdminSubscriptions";
import Plans from "./components/Plans";
import { CartProvider } from "./context/CartContext"; 
import { UserProvider } from "./context/userContext";
import { useTranslation } from "react-i18next";

import "./index.css";
import "./i18n"; 

function AppContent() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div 
      dir={isAr ? "rtl" : "ltr"} 
className={`${isAr ? "font-arabic" : "font-sans"} overflow-x-hidden w-full min-h-screen bg-[#0a0a0a]`}    >
      {/* الهيدر ثابت في الأعلى */}
      <Header />
      
      
      {/* الـ Main هو الحاوية لكل الصفحات:
          - pt-32: تعطي مسافة علوية كافية للموبايل (تحت الهيدر).
          - md:pt-40: تعطي مسافة أكبر للشاشات الكبيرة.
          - w-full: يضمن استهلاك العرض الكامل المتاح.
      */}
<main className="pt-24 md:pt-28 pb-10 w-full relative z-10">  
        <Routes>
          <Route path="/subscriptions" element={<SubscriptionCard />} />
          <Route path="/plan" element={<Plans />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/log" element={<LoginPage />} /> 
          <Route path="/" element={<Home />} /> 
          <Route path="/adminjobs" element={<ProtectedRoute><AdminJobs /></ProtectedRoute>} />
          <Route path="/JobsPage" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
          <Route path="/plans" element={<ProtectedRoute><TrainingNutrition /></ProtectedRoute>} />
          <Route path="/order" element={<ProtectedRoute><UserOrder /></ProtectedRoute>} />
          <Route path="/chef" element={<ProtectedRoute><ChefDashboard /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
}

// تصدير الافتراضي مهم جداً لإنهاء خطأ SyntaxError
export default App;