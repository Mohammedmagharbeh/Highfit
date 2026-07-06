import React from "react";
import { Activity, Dumbbell, Flame } from "lucide-react";

const icons = {
  activity: <Activity className="w-8 h-8 text-white" />,
  dumbbell: <Dumbbell className="w-8 h-8 text-white" />,
  flame: <Flame className="w-8 h-8 text-white" />,
};

const PlanCard = ({ plan, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`relative overflow-hidden group px-4 py-6 md:px-8 md:py-8 rounded-2xl md:rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-lg ${
      isActive
        ? "border-transparent shadow-2xl scale-105 z-10"
        : "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100"
    }`}
  >
    <div
      className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 transition-opacity duration-300 ${isActive ? "opacity-20" : "group-hover:opacity-10"}`}
    ></div>
    {icons[plan.iconName]}
    <div className="text-center z-10">
      <h3 className="font-bold text-lg md:text-xl">{plan.title}</h3>
      <p
        className={`text-sm mt-1 font-medium ${isActive ? "text-white" : "text-neutral-400"}`}
      >
        {plan.arabicTitle}
      </p>
    </div>
  </button>
);

export default PlanCard;
