import { useState } from "react";
import TrainingDashboard from "./TrainingDashboard/TrainingDashboard";
import { useUserPrograms } from "../hooks/useUserPrograms";
import { Edit2, Save } from "lucide-react";
import DefaultTemplates from "./DefaultTemplates";
import { useEditablePlans } from "../hooks/useEditablePlans";
import { useEditableNutrition } from "../hooks/useEditableNutrition";
import { Toaster } from "react-hot-toast";

const TrainingNutrition = () => {
  const programHook = useUserPrograms();
  const [isEditMode, setIsEditMode] = useState(false);

  const role = programHook.role;
  const isCoach = role === "coach";
  const isAdminOrLead = role === "trainer_lead" || role === "admin";
  const [activeMainTab, setActiveMainTab] = useState("users");

  const plansHook = useEditablePlans();
  const nutritionHook = useEditableNutrition();

  return (
    <div className="relative pt-6">
      {(isAdminOrLead || isCoach) && (
        <div className="flex justify-center mb-6 relative z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-1 flex shadow-lg flex-row-reverse" dir="rtl">
            <button
              onClick={() => setActiveMainTab("users")}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                activeMainTab === "users"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              برامج المشتركين
            </button>
            <button
              onClick={() => setActiveMainTab("templates")}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                activeMainTab === "templates"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              القوالب الافتراضية
            </button>
          </div>
        </div>
      )}

      {activeMainTab === "users" ? (
        <div className="relative">
      
      <div className="absolute top-4 right-4 md:right-8 z-50 flex gap-3">
        {isEditMode ? (
          <>
            <button
              onClick={() => {
                programHook.resetToOriginal();
                setIsEditMode(false);
              }}
              className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl transition-colors shadow-lg border border-red-500/50 font-bold"
              dir="rtl"
            >
              إلغاء التعديلات
            </button>
            <button
              onClick={async () => {
                await programHook.saveToDatabase();
                setIsEditMode(false);
              }}
              disabled={programHook.isSaving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-colors shadow-lg font-bold disabled:opacity-50"
              dir="rtl"
            >
              <Save className="w-4 h-4" />
              {programHook.isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </>
        ) : (
          isAdminOrLead && (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg border border-neutral-700 font-bold"
              dir="rtl"
            >
              <Edit2 className="w-4 h-4" /> تعديل المحتوى اليدوي
            </button>
          )
        )}
      </div>
      <TrainingDashboard
        title="برامج التدريب والتغذية"
        description="رحلتك في بناء جسم مثالي وصحي مع برامجنا المتكاملة، متابعة من الكوتش الخاص بك."
        isEditMode={isEditMode || false}
        programHook={programHook}
        trainingTemplates={plansHook.data}
        nutritionTemplates={nutritionHook.data}
      />
        </div>
      ) : (
        <DefaultTemplates />
      )}
    </div>
  );
};

export default TrainingNutrition;
