import React from "react";
import { Utensils, Trash2, Plus } from "lucide-react";

const NutritionOption = ({
  opt,
  oIdx,
  isEditMode,
  numOptions,
  onDelete,
  onUpdate,
}) => {
  return (
    <div
      className={`relative flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-neutral-900/50 hover:bg-neutral-800/80 transition-colors border ${isEditMode ? "border-neutral-700" : "border-transparent hover:border-neutral-700"}`}
    >
      {isEditMode && (
        <button
          onClick={onDelete}
          className="absolute -right-2 -top-2 z-10 p-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded-lg transition-colors shadow-lg"
          title="حذف الخيار"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      <div
        className={`text-neutral-200 font-medium md:flex-1 mb-4 md:mb-0 pl-4 leading-relaxed ${isEditMode ? "pr-4" : ""}`}
      >
        {isEditMode ? (
          <textarea
            value={opt.desc}
            onChange={(e) => onUpdate("desc", e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none resize-none h-16"
            placeholder="وصف مكونات الوجبة..."
          />
        ) : (
          opt.desc
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-sm justify-start md:justify-end">
        {isEditMode ? (
          <>
            <div className="flex flex-col gap-1 w-20">
              <span className="text-xs text-emerald-400 font-bold">سعرة</span>
              <input
                type="number"
                value={opt.c}
                onChange={(e) => onUpdate("c", Number(e.target.value))}
                className="w-full bg-neutral-950 border border-emerald-500/30 rounded px-2 py-1 focus:border-emerald-500 outline-none text-center"
              />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <span className="text-xs text-blue-400 font-bold">بروتين</span>
              <input
                type="number"
                value={opt.p}
                onChange={(e) => onUpdate("p", Number(e.target.value))}
                className="w-full bg-neutral-950 border border-blue-500/30 rounded px-2 py-1 focus:border-blue-500 outline-none text-center"
              />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <span className="text-xs text-yellow-500 font-bold">كارب</span>
              <input
                type="number"
                value={opt.carbs}
                onChange={(e) => onUpdate("carbs", Number(e.target.value))}
                className="w-full bg-neutral-950 border border-yellow-500/30 rounded px-2 py-1 focus:border-yellow-500 outline-none text-center"
              />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <span className="text-xs text-red-500 font-bold">دهون</span>
              <input
                type="number"
                value={opt.f}
                onChange={(e) => onUpdate("f", Number(e.target.value))}
                className="w-full bg-neutral-950 border border-red-500/30 rounded px-2 py-1 focus:border-red-500 outline-none text-center"
              />
            </div>
          </>
        ) : (
          <>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {opt.c} سعرة
            </span>
            <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
              {opt.p}غ بروتين
            </span>
            <span className="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 font-semibold border border-yellow-500/20">
              {opt.carbs}غ كارب
            </span>
            <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 font-semibold border border-red-500/20">
              {opt.f}غ دهون
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const NutritionMealCard = ({
  meal,
  mealIndex,
  planId,
  isEditMode,
  nutritionHook,
}) => (
  <div
    className={`bg-neutral-950 rounded-2xl overflow-hidden border relative ${isEditMode ? "border-neutral-700" : "border-neutral-800"}`}
  >
    {isEditMode && (
      <button
        onClick={() => nutritionHook.deleteMeal(planId, mealIndex)}
        className="absolute left-4 top-4 z-10 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors shadow-lg"
        title="حذف قسم الوجبة"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    )}

    <div className="bg-neutral-900 px-6 py-4 flex justify-between items-center border-b border-neutral-800">
      <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2 flex-1">
        <Utensils className="w-5 h-5" />
        {isEditMode ? (
          <input
            value={meal.type}
            onChange={(e) =>
              nutritionHook.updateMeal(
                planId,
                mealIndex,
                "type",
                e.target.value,
              )
            }
            className="bg-transparent border-b-2 border-dashed border-emerald-500/50 px-2 py-1 focus:border-emerald-500 outline-none w-1/2 text-white"
            placeholder="اسم الوجبة (مثال: وجبة الإفطار)"
          />
        ) : (
          meal.type
        )}
      </h3>
      {isEditMode ? (
        <input
          value={meal.calories}
          onChange={(e) =>
            nutritionHook.updateMeal(
              planId,
              mealIndex,
              "calories",
              e.target.value,
            )
          }
          className="bg-neutral-950 border border-neutral-700 px-3 py-1 text-sm font-medium text-neutral-400 rounded-full w-1/3 text-center focus:border-emerald-500 outline-none"
          placeholder="إجمالي السعرات (مثال: 335 - 430 سعرة)"
        />
      ) : (
        <span className="text-sm font-medium text-neutral-400 bg-neutral-950 px-3 py-1 rounded-full">
          {meal.calories}
        </span>
      )}
    </div>

    <div className="p-6 grid gap-4">
      {meal.options &&
        meal.options.map((opt, oIdx) => (
          <NutritionOption
            key={oIdx}
            opt={opt}
            oIdx={oIdx}
            isEditMode={isEditMode}
            numOptions={meal.options.length}
            onDelete={() => nutritionHook.deleteOption(planId, mealIndex, oIdx)}
            onUpdate={(key, value) =>
              nutritionHook.updateOption(planId, mealIndex, oIdx, key, value)
            }
          />
        ))}

      {isEditMode && (
        <button
          onClick={() => nutritionHook.addOption(planId, mealIndex)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-neutral-700 hover:border-emerald-500 hover:bg-emerald-500/5 text-neutral-400 hover:text-emerald-400 rounded-xl transition-colors font-bold"
        >
          <Plus className="w-4 h-4" /> إضافة خيار جديد للمكونات
        </button>
      )}
    </div>
  </div>
);

export default NutritionMealCard;
