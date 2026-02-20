import React, { useState } from "react";
import PlanCard from "./components/PlanCard";
import DashboardTabs from "./components/DashboardTabs";
import TrainingDayCard from "./components/TrainingDayCard";
import NutritionMealCard from "./components/NutritionMealCard";

const TrainingDashboard = ({
  plansData,
  nutritionData,
  title,
  description,
  isEditMode,
  plansHook,
  nutritionHook,
}) => {
  const [activePlanId, setActivePlanId] = useState(Object.keys(plansData)[0]);
  const [activeSubTab, setActiveSubTab] = useState("training"); // training, nutrition

  const activePlan = plansData[activePlanId] || Object.values(plansData)[0];
  const safePlanId =
    activePlanId && plansData[activePlanId]
      ? activePlanId
      : Object.keys(plansData)[0];

  if (!activePlan) {
    return (
      <div
        className="min-h-screen bg-neutral-950 text-white flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-xl animate-pulse">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-4 md:p-8"
      dir="rtl"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          {title}
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Level Selector */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 w-full md:w-auto">
          {Object.entries(plansData).map(([key, plan]) => (
            <PlanCard
              key={key}
              plan={plan}
              isActive={safePlanId === key}
              onClick={() => setActivePlanId(key)}
            />
          ))}
        </div>

        {/* Selected Plan Details */}
        <div className="w-full bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
          {/* Sub-tab Navigation */}
          <DashboardTabs
            activeTab={activeSubTab}
            onTabChange={setActiveSubTab}
          />

          <div className="p-6 md:p-8 min-h-[50vh]">
            {activeSubTab === "training" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row items-center justify-between bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-white">
                      {activePlan.arabicTitle}
                    </h2>
                    <p className="text-neutral-400">{activePlan.desc}</p>
                  </div>
                  <div className="mt-4 md:mt-0 px-4 py-2 rounded-full border border-neutral-700 bg-neutral-800/50 text-sm font-medium">
                    الالتزام والانضباط مفتاح النجاح
                  </div>
                </div>

                <div className="grid gap-6 items-stretch">
                  {activePlan.training.map((day, dIdx) => (
                    <TrainingDayCard
                      key={dIdx}
                      day={day}
                      dayIndex={dIdx}
                      planId={safePlanId}
                      isEditMode={isEditMode}
                      plansHook={plansHook}
                    />
                  ))}
                  {isEditMode && (
                    <button
                      onClick={() => plansHook.addDay(safePlanId)}
                      className="border-2 border-dashed border-neutral-700 hover:border-emerald-500 hover:bg-emerald-500/5 text-neutral-400 hover:text-emerald-400 rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center gap-3 min-h-[200px]"
                    >
                      <span className="text-4xl">+</span>
                      <span className="font-bold text-lg">
                        أضف قسم / يوم جديد
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeSubTab === "nutrition" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                  {isEditMode ? (
                    <>
                      <input
                        value={nutritionData[safePlanId]?.title || ""}
                        onChange={(e) =>
                          nutritionHook.updateNutritionInfo(
                            safePlanId,
                            "title",
                            e.target.value,
                          )
                        }
                        className="text-2xl font-bold mb-2 bg-transparent border-b-2 border-dashed border-emerald-500/50 px-2 py-1 focus:border-emerald-500 outline-none w-full text-white"
                        placeholder="عنوان برنامج التغذية"
                      />
                      <textarea
                        value={nutritionData[safePlanId]?.desc || ""}
                        onChange={(e) =>
                          nutritionHook.updateNutritionInfo(
                            safePlanId,
                            "desc",
                            e.target.value,
                          )
                        }
                        className="text-neutral-400 w-full bg-transparent border-b-2 border-dashed border-neutral-700 px-2 py-1 mt-2 focus:border-emerald-500 outline-none resize-none"
                        placeholder="وصف البرنامج"
                        rows={2}
                      />
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-2">
                        {nutritionData[safePlanId]?.title}
                      </h2>
                      <p className="text-neutral-400">
                        {nutritionData[safePlanId]?.desc}
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  {(nutritionData[safePlanId]?.meals || []).map(
                    (meal, mIdx) => (
                      <NutritionMealCard
                        key={mIdx}
                        meal={meal}
                        mealIndex={mIdx}
                        planId={safePlanId}
                        isEditMode={isEditMode}
                        nutritionHook={nutritionHook}
                      />
                    ),
                  )}
                  {isEditMode && (
                    <button
                      onClick={() => nutritionHook.addMeal(safePlanId)}
                      className="w-full border-2 border-dashed border-neutral-700 hover:border-emerald-500 hover:bg-emerald-500/5 text-neutral-400 hover:text-emerald-400 rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center gap-3 min-h-[150px]"
                    >
                      <span className="text-4xl">+</span>
                      <span className="font-bold text-lg">
                        أضف قسم وجبة جديد
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;
