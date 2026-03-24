import React, { useState } from "react";
import DashboardTabs from "./TrainingDashboard/components/DashboardTabs";
import TrainingDayCard from "./TrainingDashboard/components/TrainingDayCard";
import NutritionMealCard from "./TrainingDashboard/components/NutritionMealCard";
import { useEditablePlans } from "../hooks/useEditablePlans";
import { useEditableNutrition } from "../hooks/useEditableNutrition";
import { Edit2, Save, PlusCircle, Trash2 } from "lucide-react";

const DefaultTemplates = () => {
  const staffUserStr = sessionStorage.getItem("staffUser");
  let role = "user";
  if (staffUserStr) {
    const staffUser = JSON.parse(staffUserStr);
    role = staffUser.role;
  }

  // Lead coach and admin can edit. Coach can only view.
  const canEdit = role === "trainer_lead" || role === "admin";
  const [isEditMode, setIsEditMode] = useState(false);

  const plansHook = useEditablePlans();
  const nutritionHook = useEditableNutrition();

  const [activeSubTab, setActiveSubTab] = useState("training");
  const [activePlanId, setActivePlanId] = useState("");

  const trainingPlans = plansHook.data;
  const nutritionPlans = nutritionHook.data;
  const trainingKeys = Object.keys(trainingPlans);
  const nutritionKeys = Object.keys(nutritionPlans);

  // Derive unique IDs (assuming same IDs across both, e.g. "beginner", "advanced")
  const allIds = Array.from(new Set([...trainingKeys, ...nutritionKeys]));

  const loading = plansHook.loading || nutritionHook.loading;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-8 text-xl animate-pulse" dir="rtl">
        جاري التحميل...
      </div>
    );
  }

  let safePlanId = activePlanId;
  if (!activePlanId && allIds.length > 0) {
    safePlanId = allIds[0];
  }

  const activeTraining = trainingPlans[safePlanId] || { training: [] };
  const activeNutrition = nutritionPlans[safePlanId] || { meals: [] };

  const handleCreateNewTemplate = () => {
    const newId = prompt("أدخل المعرف للبرنامج الجديد باللغة الإنجليزية (مثال: new_plan):");
    if (!newId) return;
    
    // Check if exists
    if (allIds.includes(newId)) {
      alert("هذا المعرف موجود مسبقاً");
      return;
    }

    const arTitle = prompt("أدخل اسم البرنامج بالعربية:");
    if (!arTitle) return;

    // Create in both structures by directly modifying their state (or exposing an addPlan function)
    plansHook.updateTrainingInfo(newId, "title", newId);
    plansHook.updateTrainingInfo(newId, "arabicTitle", arTitle);
    plansHook.updateTrainingInfo(newId, "planId", newId);
    
    nutritionHook.updateNutritionInfo(newId, "title", arTitle);
    nutritionHook.updateNutritionInfo(newId, "programId", newId);

    setActivePlanId(newId);
    setIsEditMode(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-4 md:p-8" dir="rtl">
      <div className="absolute top-24 right-4 md:right-8 z-50 flex gap-3">
        {isEditMode ? (
          <>
            <button
              onClick={() => {
                plansHook.resetToOriginal();
                nutritionHook.resetToOriginal();
                setIsEditMode(false);
              }}
              className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl transition-colors shadow-lg border border-red-500/50 font-bold"
            >
              إلغاء التعديلات
            </button>
            <button
              onClick={async () => {
                await plansHook.saveToDatabase();
                await nutritionHook.saveToDatabase();
                setIsEditMode(false);
              }}
              disabled={plansHook.isSaving || nutritionHook.isSaving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-colors shadow-lg font-bold disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {plansHook.isSaving || nutritionHook.isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </>
        ) : (
          canEdit && (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg border border-neutral-700 font-bold"
            >
              <Edit2 className="w-4 h-4" /> تعديل القوالب
            </button>
          )
        )}
      </div>

      <div className="max-w-6xl mx-auto mb-12 text-center pt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
          القوالب الافتراضية للبرامج
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
          إدارة القوالب الأساسية للتمارين والتغذية في النادي
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {allIds.length > 0 && (
          <div className="w-full mb-8">
            <div className="w-full bg-neutral-900 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-center border border-neutral-800">
              {allIds.map((id) => {
                const isActive = safePlanId === id;
                const tPlan = trainingPlans[id] || {};
                const nPlan = nutritionPlans[id] || {};
                const name = tPlan.arabicTitle || nPlan.title || id;
                
                return (
                  <div key={id} className="relative">
                    <button
                      onClick={() => setActivePlanId(id)}
                      className={`px-8 py-4 rounded-xl font-bold transition-all border flex flex-col items-center gap-2 w-full h-full ${
                        isActive
                          ? "bg-orange-600 border-orange-500 text-white shadow-lg scale-105"
                          : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{name}</span>
                      <span className="text-xs opacity-50" dir="ltr">id: {id}</span>
                    </button>
                    {isEditMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("هل أنت متأكد من حذف هذا القالب؟")) {
                            plansHook.deleteTemplate(id);
                            nutritionHook.deleteTemplate(id);
                            if (isActive) setActivePlanId("");
                          }
                        }}
                        className="absolute -top-2 -left-2 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full shadow-lg z-10 transition-transform hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
              
              {isEditMode && (
                <button
                  onClick={handleCreateNewTemplate}
                  className="px-8 py-4 rounded-xl font-bold transition-all border border-dashed border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 flex flex-col items-center gap-2"
                >
                  <PlusCircle className="w-6 h-6" />
                  <span>إضافة قالب جديد</span>
                </button>
              )}
            </div>
          </div>
        )}

        {safePlanId && (
          <div className="w-full bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
            <DashboardTabs
              activeTab={activeSubTab}
              onTabChange={setActiveSubTab}
            />

            <div className="p-6 md:p-8 min-h-[50vh]">
              {activeSubTab === "training" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                    {isEditMode ? (
                      <>
                        <input
                          value={activeTraining?.arabicTitle || ""}
                          onChange={(e) => plansHook.updateTrainingInfo(safePlanId, "arabicTitle", e.target.value)}
                          className="text-2xl font-bold mb-2 bg-transparent border-b-2 border-dashed border-orange-500/50 px-2 py-1 focus:border-orange-500 outline-none w-full text-white"
                          placeholder="عنوان برنامج التدريب (بالعربية)"
                        />
                        <textarea
                          value={activeTraining?.desc || ""}
                          onChange={(e) => plansHook.updateTrainingInfo(safePlanId, "desc", e.target.value)}
                          className="text-neutral-400 w-full bg-transparent border-b-2 border-dashed border-neutral-700 px-2 py-1 mt-2 focus:border-orange-500 outline-none resize-none"
                          placeholder="وصف إضافي (اختياري)"
                          rows={2}
                        />
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold mb-2 text-white">
                          {activeTraining?.arabicTitle || "برنامج التدريب"}
                        </h2>
                        <p className="text-neutral-400">{activeTraining?.desc}</p>
                      </>
                    )}
                  </div>

                  <div className="grid gap-6 items-stretch">
                    {activeTraining?.training?.map((day, dIdx) => (
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
                        className="border-2 border-dashed border-neutral-700 hover:border-orange-500 hover:bg-orange-500/5 text-neutral-400 hover:text-orange-400 rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3 min-h-[150px]"
                      >
                        <span className="text-4xl">+</span>
                        <span className="font-bold text-lg">أضف يوم تمرين جديد</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeSubTab === "nutrition" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                    {isEditMode ? (
                      <>
                        <input
                          value={activeNutrition?.title || ""}
                          onChange={(e) => nutritionHook.updateNutritionInfo(safePlanId, "title", e.target.value)}
                          className="text-2xl font-bold mb-2 bg-transparent border-b-2 border-dashed border-orange-500/50 px-2 py-1 focus:border-orange-500 outline-none w-full text-white"
                          placeholder="عنوان برنامج التغذية"
                        />
                        <textarea
                          value={activeNutrition?.desc || ""}
                          onChange={(e) => nutritionHook.updateNutritionInfo(safePlanId, "desc", e.target.value)}
                          className="text-neutral-400 w-full bg-transparent border-b-2 border-dashed border-neutral-700 px-2 py-1 mt-2 focus:border-orange-500 outline-none resize-none"
                          placeholder="وصف البرنامج"
                          rows={2}
                        />
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold mb-2 text-white">
                          {activeNutrition?.title || "برنامج التغذية"}
                        </h2>
                        <p className="text-neutral-400">{activeNutrition?.desc}</p>
                      </>
                    )}
                  </div>

                  <div className="space-y-6">
                    {activeNutrition?.meals?.map((meal, mIdx) => (
                      <NutritionMealCard
                        key={mIdx}
                        meal={meal}
                        mealIndex={mIdx}
                        planId={safePlanId}
                        isEditMode={isEditMode}
                        nutritionHook={nutritionHook}
                      />
                    ))}
                    {isEditMode && (
                      <button
                        onClick={() => nutritionHook.addMeal(safePlanId)}
                        className="w-full border-2 border-dashed border-neutral-700 hover:border-orange-500 hover:bg-orange-500/5 text-neutral-400 hover:text-orange-400 rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3 min-h-[150px]"
                      >
                        <span className="text-4xl">+</span>
                        <span className="font-bold text-lg">أضف وجبة جديدة</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultTemplates;
