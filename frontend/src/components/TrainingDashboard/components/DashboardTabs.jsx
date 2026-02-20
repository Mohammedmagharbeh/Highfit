import React from "react";
import { Dumbbell, Utensils } from "lucide-react";

const DashboardTabs = ({ activeTab, onTabChange }) => (
  <div className="flex border-b border-neutral-800">
    <button
      onClick={() => onTabChange("training")}
      className={`flex-1 py-5 flex items-center justify-center gap-2 font-bold text-lg transition-colors ${
        activeTab === "training"
          ? "bg-neutral-800 text-white"
          : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
      }`}
    >
      <Dumbbell className="w-5 h-5" />
      جدول التدريب
    </button>
    <button
      onClick={() => onTabChange("nutrition")}
      className={`flex-1 py-5 flex items-center justify-center gap-2 font-bold text-lg transition-colors ${
        activeTab === "nutrition"
          ? "bg-neutral-800 text-white"
          : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
      }`}
    >
      <Utensils className="w-5 h-5" />
      النظام الغذائي
    </button>
  </div>
);

export default DashboardTabs;
