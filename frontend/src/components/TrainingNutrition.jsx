import { useState } from "react";
import TrainingDashboard from "./TrainingDashboard/TrainingDashboard";
import { useEditablePlans } from "../hooks/useEditablePlans";
import { useEditableNutrition } from "../hooks/useEditableNutrition";
import { Edit2, Save } from "lucide-react";
import { Toaster } from "react-hot-toast";

const TrainingNutrition = () => {
  const plansHook = useEditablePlans();
  const nutritionHook = useEditableNutrition();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="relative">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute top-4 right-4 md:right-8 z-50 flex gap-3">
        {isEditMode ? (
          <>
            <button
              onClick={() => {
                plansHook.resetToOriginal();
                nutritionHook.resetToOriginal();
                setIsEditMode(false);
              }}
              className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl transition-colors shadow-lg border border-red-500/50 font-bold"
              dir="rtl"
            >
              إلغاء التعديلات
            </button>
            <button
              onClick={async () => {
                await Promise.all([
                  plansHook.saveToDatabase(false),
                  nutritionHook.saveToDatabase(true),
                ]);
                setIsEditMode(false);
              }}
              disabled={plansHook.isSaving || nutritionHook.isSaving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-colors shadow-lg font-bold disabled:opacity-50"
              dir="rtl"
            >
              <Save className="w-4 h-4" />
              {plansHook.isSaving || nutritionHook.isSaving
                ? "جاري الحفظ..."
                : "حفظ التعديلات"}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditMode(true)}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg border border-neutral-700 font-bold"
            dir="rtl"
          >
            <Edit2 className="w-4 h-4" /> تعديل المحتوى
          </button>
        )}
      </div>
      <TrainingDashboard
        title="خطط التدريب والتغذية"
        description="اختر الخطة المناسبة لمستواك وابدأ رحلتك في بناء جسم مثالي وصحي مع برامجنا المتكاملة."
        plansData={plansHook.data}
        nutritionData={nutritionHook.data}
        isEditMode={isEditMode}
        plansHook={plansHook}
        nutritionHook={nutritionHook}
      />
    </div>
  );
};

export default TrainingNutrition;
