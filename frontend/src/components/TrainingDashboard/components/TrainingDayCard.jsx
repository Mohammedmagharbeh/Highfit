import React, { useState } from "react";
import {
  Check,
  Activity,
  ChevronDown,
  Play,
  ImageIcon,
  Info,
  Trash2,
  Plus,
} from "lucide-react";

const ExerciseItem = ({
  ex,
  index,
  isEditMode,
  planId,
  dayIndex,
  plansHook,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (key, value) => {
    plansHook.updateExercise(planId, dayIndex, index, key, value);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    plansHook.deleteExercise(planId, dayIndex, index);
  };

  return (
    <div
      className={`bg-neutral-900/50 rounded-xl border transition-all duration-300 ${isEditMode ? "border-neutral-700" : "border-neutral-800/80"} overflow-hidden relative group`}
    >
      {isEditMode && (
        <button
          onClick={handleDelete}
          className="absolute left-2 top-3 z-10 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors"
          title="حذف التمرين"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={() => !isEditMode && setIsExpanded(!isExpanded)}
        className={`w-full flex justify-between items-center p-4 transition-colors ${!isEditMode && "hover:bg-neutral-800/50 cursor-pointer"} ${isEditMode ? "pr-12" : ""}`}
      >
        <div className="flex items-center gap-3 flex-1 ml-4 text-right">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-800 text-xs font-bold text-neutral-400 shrink-0">
            {index + 1}
          </span>
          {isEditMode ? (
            <input
              value={ex.name}
              onChange={(e) => handleUpdate("name", e.target.value)}
              className="bg-neutral-950 border border-neutral-700 rounded px-3 py-1 text-white text-right w-full font-bold focus:border-emerald-500 outline-none"
              placeholder="اسم التمرين"
            />
          ) : (
            <span className="text-neutral-200 font-bold group-hover:text-emerald-400 transition-colors text-right leading-tight">
              {ex.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            {isEditMode ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={ex.sets}
                  onChange={(e) =>
                    handleUpdate("sets", parseInt(e.target.value))
                  }
                  className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 w-16 text-center text-white focus:border-emerald-500 outline-none"
                  placeholder="مجموعات"
                />
                <input
                  value={ex.reps}
                  onChange={(e) => handleUpdate("reps", e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 w-24 text-center text-white focus:border-emerald-500 outline-none"
                  placeholder="العدات"
                />
              </div>
            ) : (
              <>
                <span className="text-neutral-500 bg-neutral-950 px-2 py-1 rounded shadow-inner">
                  {ex.sets} مجموعات
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded shadow-inner">
                  {ex.reps}
                </span>
              </>
            )}
          </div>
          {!isEditMode && (
            <ChevronDown
              className={`w-5 h-5 text-neutral-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </button>

      {/* Expanded / Edit Mode Content */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded || isEditMode
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 border-t border-neutral-800/50 mt-2 space-y-4">
            {/* Description */}
            <div
              className={`flex gap-3 text-sm text-neutral-400 bg-neutral-950/50 p-3 rounded-lg border ${isEditMode ? "border-neutral-700" : "border-neutral-800/50"}`}
            >
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
              {isEditMode ? (
                <textarea
                  value={ex.desc}
                  onChange={(e) => handleUpdate("desc", e.target.value)}
                  className="bg-transparent border-none w-full outline-none resize-none h-16 text-right"
                  placeholder="وصف التمرين..."
                />
              ) : (
                <p className="leading-relaxed">{ex.desc}</p>
              )}
            </div>

            {/* Media Inputs for Edit Mode */}
            {isEditMode && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-300">
                    <ImageIcon className="w-4 h-4 text-emerald-400" /> رابط
                    الصورة
                  </div>
                  <input
                    value={ex.images?.[0] || ""}
                    onChange={(e) => handleUpdate("images", [e.target.value])}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none text-left"
                    placeholder="https://example.com/image.jpg"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-300">
                    <Play className="w-4 h-4 text-red-500" /> رابط الفيديو
                    (YouTube)
                  </div>
                  <input
                    value={ex.video || ""}
                    onChange={(e) => handleUpdate("video", e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none text-left"
                    placeholder="https://youtube.com/embed/..."
                    dir="ltr"
                  />
                </div>
              </div>
            )}

            {!isEditMode && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Image */}
                {ex.images && ex.images.length > 0 && ex.images[0] && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-300">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      الشكل التوضيحي
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
                      <img
                        src={ex.images[0]}
                        alt={ex.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) =>
                          (e.target.src =
                            "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80")
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Video */}
                {ex.video && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-300">
                      <Play className="w-4 h-4 text-red-500" />
                      فيديو الشرح
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner">
                      <iframe
                        src={ex.video}
                        title={`شرح تمرين ${ex.name}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TrainingDayCard = ({ day, dayIndex, planId, plansHook, isEditMode }) => (
  <div
    className={`bg-neutral-950 rounded-2xl p-6 border transition-colors flex flex-col h-full shadow-xl relative ${isEditMode ? "border-neutral-700" : "border-neutral-800/50 hover:border-neutral-700"}`}
  >
    {isEditMode && (
      <button
        onClick={() => plansHook.deleteDay(planId, dayIndex)}
        className="absolute left-4 top-4 z-10 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors"
        title="حذف القسم / اليوم"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    )}

    <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
      <h3 className="text-xl font-bold text-white flex items-center gap-2 flex-1">
        <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
          <Check className="w-5 h-5 text-emerald-500" />
        </div>
        {isEditMode ? (
          <input
            value={day.day}
            onChange={(e) =>
              plansHook.updateDay(planId, dayIndex, "day", e.target.value)
            }
            className="bg-transparent border-b-2 border-dashed border-neutral-600 px-1 py-1 focus:border-emerald-500 outline-none text-white w-2/3"
            placeholder="اسم اليوم (مثال: اليوم الأول)"
          />
        ) : (
          day.day
        )}
      </h3>
      {isEditMode ? (
        <input
          value={day.focus}
          onChange={(e) =>
            plansHook.updateDay(planId, dayIndex, "focus", e.target.value)
          }
          className="bg-neutral-900 border border-neutral-700 rounded-full px-4 py-1.5 text-sm text-emerald-100 font-medium focus:border-emerald-500 outline-none w-1/3 text-center"
          placeholder="التركيز"
        />
      ) : (
        <span className="text-sm px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-emerald-100 font-medium whitespace-nowrap shadow-sm">
          {day.focus}
        </span>
      )}
    </div>

    <div className="space-y-4 mb-6 flex-grow">
      {day.exercises.map((ex, eIdx) => (
        <ExerciseItem
          key={eIdx}
          ex={ex}
          index={eIdx}
          planId={planId}
          dayIndex={dayIndex}
          plansHook={plansHook}
          isEditMode={isEditMode}
        />
      ))}
      {isEditMode && (
        <button
          onClick={() => plansHook.addExercise(planId, dayIndex)}
          className="w-full flex items-center justify-center gap-2 py-4 mt-4 border-2 border-dashed border-neutral-700 hover:border-emerald-500 text-neutral-400 hover:text-emerald-400 rounded-xl transition-colors font-bold"
        >
          <Plus className="w-5 h-5" />
          إضافة تمرين جديد
        </button>
      )}
    </div>

    <div className="mt-auto bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-4 flex items-center justify-between gap-3 text-blue-300 font-medium overflow-hidden relative group">
      <div className="flex items-center gap-3 w-full relative z-10">
        <Activity className="w-5 h-5 shrink-0" />
        {isEditMode ? (
          <input
            value={day.cardio}
            onChange={(e) =>
              plansHook.updateDay(planId, dayIndex, "cardio", e.target.value)
            }
            className="bg-transparent border-b border-dashed border-blue-500/50 w-full outline-none text-blue-200"
            placeholder="نوع الكارديو"
          />
        ) : (
          <span className="relative z-10">{day.cardio}</span>
        )}
      </div>
      {!isEditMode && (
        <div className="absolute inset-0 bg-blue-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
      )}
    </div>
  </div>
);

export default TrainingDayCard;
