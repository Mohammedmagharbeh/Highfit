
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
import { CartProvider } from "./context/CartContext"; 
import { UserProvider } from "./context/userContext";
import { useTranslation } from "react-i18next";
import "./index.css";
import "./i18n"; 

function AppContent() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div dir={isAr ? "rtl" : "ltr"} className={isAr ? "font-arabic" : "font-sans"}>
      <Header />
      
      <main className="pt-24 min-h-screen bg-[#0a0a0a]">
        <Routes>
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

export default App;