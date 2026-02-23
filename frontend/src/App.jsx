

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
import Header from "./components/Header"; // استيراد الهيدر الجديد
import { CartProvider } from "./context/CartContext"; 
import { UserProvider } from "./context/userContext";
import "./index.css";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          {/* الهيدر سيظهر في جميع الصفحات ما عدا /log */}
          <Header />
          
<main className="pt-24 min-h-screen bg-[#0a0a0a]">
              <Routes>
              {/* صفحة تسجيل الدخول */}
              <Route path="/log" element={<LoginPage />} /> 
              
              {/* الصفحات المحمية */}
              <Route path="/" element={<Home />} /> {/* عادة الرئيسية تكون عامة أو محمية حسب رغبتك */}
              
              <Route path="/adminjobs" element={<ProtectedRoute><AdminJobs /></ProtectedRoute>} />
              <Route path="/JobsPage" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
              <Route path="/plans" element={<ProtectedRoute><TrainingNutrition /></ProtectedRoute>} />
              <Route path="/order" element={<ProtectedRoute><UserOrder /></ProtectedRoute>} />
              <Route path="/chef" element={<ProtectedRoute><ChefDashboard /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
}

export default App;