import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AdminJobs from "./components/Adminjob";
import JobsPage from "./components/JobPage";
import LoginPage from "./components/Log";
import TrainingNutrition from "./components/TrainingNutrition";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminjobs" element={<AdminJobs />} />
        <Route path="/JobsPage" element={<JobsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/plans" element={<TrainingNutrition />} />

        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
