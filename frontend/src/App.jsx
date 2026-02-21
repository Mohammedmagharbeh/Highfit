import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AdminJobs from "./components/Adminjob";
import JobsPage from "./components/JobPage";
import LoginPage from "./components/Log";
import TrainingNutrition from "./components/TrainingNutrition";
import ChefDashboard from "./components/ChefDashboard";
import UserOrder from "./components/UserOrder";
import "./index.css";
import ProtectedRoute from "./ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminjobs" element= {<AdminJobs />} />
        <Route path="/JobsPage" element={<JobsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/plans" element={<TrainingNutrition />} />
        <Route path="/order" element={<UserOrder />} />
        <Route path="/chef" element={<ChefDashboard />} />

        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
