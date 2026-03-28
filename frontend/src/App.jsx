import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; // أضفنا useLocation هنا
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
import DefaultTemplates from "./components/DefaultTemplates";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/userContext";
import { useTranslation } from "react-i18next";
import AdminUsersPage from "./components/AdminUsersPage";
import StaffLoginPage from "./components/staffLoginPage";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "./i18n";

function AppContent() {
  const { i18n } = useTranslation();
  const location = useLocation(); // مراقبة المسار الحالي
  const isAr = i18n.language === "ar";

  // قائمة المسارات التي لا تريد ظهور الهيدر فيها
  const hideHeaderPaths = ["/", "/staff"];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className={`${isAr ? "font-arabic" : "font-sans"} overflow-x-hidden w-full min-h-screen bg-[#0a0a0a]`}
    >
      {/* إظهار الهيدر فقط إذا لم يكن المسار الحالي هو تسجيل الدخول */}
      {shouldShowHeader && <Header />}

      <Toaster position="top-center" containerStyle={{ zIndex: 9999999 }} />

      {/* إذا كان الهيدر مخفي (صفحة اللوجن)، نجعل pt-0 لتبدأ الصفحة من الأعلى تماماً
          إذا كان الهيدر ظاهر، نستخدم pt-24/28 المعتاد لترك مسافة تحته
      */}
      <main
        className={`${shouldShowHeader ? "pt-24 md:pt-28" : "pt-0"} pb-10 w-full`}
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/staff" element={<StaffLoginPage />} />

          <Route path="/subscriptions" element={<SubscriptionCard />} />
          <Route path="/plan" element={<Plans />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/Home" element={<Home />} />

          <Route
            path="/adminjobs"
            element={
              <ProtectedRoute>
                <AdminJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/JobsPage"
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plans"
            element={
              <ProtectedRoute>
                <TrainingNutrition />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <DefaultTemplates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <UserOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chef"
            element={
              <ProtectedRoute>
                <ChefDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
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

export default App;
