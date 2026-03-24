import React, { useState } from "react";
import DashboardTabs from "./components/DashboardTabs";
import TrainingDayCard from "./components/TrainingDayCard";
import NutritionMealCard from "./components/NutritionMealCard";
import { Send, CheckCircle, XCircle, Search, Filter, MessageSquare } from "lucide-react";

const TrainingDashboard = ({ title, description, isEditMode, programHook, trainingTemplates, nutritionTemplates }) => {
  const {
    data,
    loading,
    role,
    currentUserId,
    submitProgram,
    approveProgram,
    rejectProgram,
    updateTrainingInfo,
    updateNutritionInfo,
  } = programHook;

  const users = Object.values(data);
  const userKeys = Object.keys(data);
  const [activeUserId, setActiveUserId] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("training");
  const [rejectionReason, setRejectionReason] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = Object.entries(data).filter(([userId, uProg]) => {
    const nameMatch = uProg.userId?.username
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const phoneMatch = uProg.userId?.phone?.includes(searchQuery);
    const matchesSearch = !searchQuery || nameMatch || phoneMatch;
    const matchesStatus =
      statusFilter === "all" || uProg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div
        className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-8 text-xl animate-pulse"
        dir="rtl"
      >
        جاري التحميل...
      </div>
    );
  }

  let safeUserId = activeUserId;
  if (role === "user") {
    safeUserId = currentUserId;
  } else if (!activeUserId && userKeys.length > 0) {
    safeUserId = userKeys[0];
  }

  const activeProgram = data[safeUserId];

  if (role === "user") {
    if (!activeProgram || activeProgram.status !== "approved") {
      return (
        <div
          className="min-h-[60vh] bg-neutral-950 text-white flex items-center justify-center"
          dir="rtl"
        >
          <div className="text-xl md:text-2xl text-emerald-400 font-bold bg-neutral-900 border border-emerald-500/50 p-8 rounded-3xl shadow-lg text-center">
            {activeProgram?.status === "submitted"
              ? "برنامجك الآن قيد المراجعة من قبل الإدارة"
              : activeProgram?.status === "rejected"
                ? "يتم الآن تعديل برنامجك من قبل الكوتش"
                : "أنت الآن في قائمة الانتظار، سيقوم الكوتش بوضع برنامجك قريباً"}
          </div>
        </div>
      );
    }
  }

  if (!activeProgram && role !== "user") {
    return (
      <div
        className="min-h-[60vh] bg-neutral-950 text-white flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-xl text-neutral-400">لا يوجد متدربين حالياً</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-4 md:p-8"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          {title}
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Coach / Admin: User Selector */}
        {role !== "user" && users.length > 0 && (
          <div className="w-full mb-8 space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو رقم الهاتف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pr-10 pl-4 text-white focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
              <div className="md:w-64 relative">
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pr-10 pl-4 text-white focus:border-emerald-500 outline-none transition-colors appearance-none"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="waiting">بانتظار الإعداد</option>
                  <option value="submitted">قيد المراجعة</option>
                  <option value="approved">تمت الموافقة</option>
                  <option value="rejected">مرفوض</option>
                </select>
              </div>
            </div>

            <div className="w-full bg-neutral-900 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-center border border-neutral-800 max-h-64 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-neutral-500 py-4 font-bold">
                  لا يوجد متدربين يطابقون البحث
                </div>
              ) : (
                filteredUsers.map(([userId, uProg]) => {
                  const isActive = safeUserId === userId;
                  return (
                    <button
                      key={userId}
                      onClick={() => setActiveUserId(userId)}
                      className={`px-6 py-3 rounded-xl font-bold transition-colors border flex flex-col items-center gap-1 ${
                        isActive
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {uProg.userId?.username || "بدون اسم"}
                        <span
                          className="text-xs opacity-70 bg-black/20 px-2 py-0.5 rounded-full"
                          dir="ltr"
                        >
                          {uProg.userId?.phone || "بدون رقم"}
                        </span>
                      </div>
                      <span className="text-[10px] opacity-70">
                        (
                        {uProg.status === "approved"
                          ? "تمت الموافقة"
                          : uProg.status === "submitted"
                            ? "قيد المراجعة"
                            : uProg.status === "rejected"
                              ? "مرفوض"
                              : "بانتظار الإعداد"}
                        )
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Coach / Lead Coach actions */}
        {role !== "user" && activeProgram && (
          <div className="w-full bg-neutral-900 p-6 rounded-2xl border border-neutral-800 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <span className="text-neutral-400 ml-2">حالة البرنامج:</span>
              <span
                className={`font-bold ${
                  activeProgram.status === "approved"
                    ? "text-emerald-400"
                    : activeProgram.status === "submitted"
                      ? "text-yellow-400"
                      : activeProgram.status === "rejected"
                        ? "text-red-400"
                        : "text-blue-400"
                }`}
              >
                {activeProgram.status}
              </span>
              {activeProgram.status === "rejected" &&
                activeProgram.rejectionReason && (
                  <div className="text-red-400 mt-2 text-sm bg-red-500/10 p-2 rounded">
                    سبب الرفض: {activeProgram.rejectionReason}
                  </div>
                )}
              {activeProgram.coachNote && (role === "trainer_lead" || role === "admin" || role === "coach") && (
                <div className="mt-4 bg-blue-500/10 border border-blue-500/30 p-5 rounded-2xl flex items-start gap-4 w-full">
                  <div className="bg-blue-500/20 p-2 rounded-xl shrink-0 mt-0.5">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="font-extrabold text-blue-400 mb-2 text-sm">ملاحظة الكوتش لمسؤول التدريب:</div>
                    <div className="text-neutral-300 leading-relaxed whitespace-pre-wrap text-sm break-words w-full">
                      {activeProgram.coachNote}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              {(role === "coach" || role === "trainer_lead" || role === "admin") &&
                activeProgram.status !== "approved" &&
                activeProgram.status !== "submitted" && (
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl w-full mt-4 shadow-xl">
                    <h3 className="text-xl font-extrabold text-white mb-6 border-b border-neutral-800 pb-4">
                      {role === "coach" ? "تجهيز وتقديم البرنامج" : "إعداد القالب الافتراضي"}
                    </h3>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3 flex flex-col gap-3">
                        <label className="text-sm font-bold text-neutral-400 block">قم باختيار باقة المتدرب (القالب):</label>
                        <select
                          onChange={(e) => {
                            const id = e.target.value;
                            if (!id) return;
                            
                            // Assign Training
                            if (programHook.updateTrainingInfo) {
                              const t = trainingTemplates?.[id];
                              if (t) {
                                programHook.updateTrainingInfo(safeUserId, "training", t.training || []);
                                programHook.updateTrainingInfo(safeUserId, "title", t.arabicTitle || t.title || id);
                                programHook.updateTrainingInfo(safeUserId, "desc", t.desc || "");
                              }
                            }
                            
                            // Assign Nutrition
                            if (programHook.updateNutritionInfo) {
                              const n = nutritionTemplates?.[id];
                              if (n) {
                                programHook.updateNutritionInfo(safeUserId, "meals", n.meals || []);
                                programHook.updateNutritionInfo(safeUserId, "title", n.title || id);
                                programHook.updateNutritionInfo(safeUserId, "desc", n.desc || "");
                              }
                            }
                          }}
                          className="bg-neutral-950 border border-neutral-700 text-white rounded-xl p-4 text-sm focus:border-blue-500 hover:border-blue-500/50 outline-none w-full shadow-inner font-bold transition-all cursor-pointer"
                          defaultValue=""
                        >
                          <option value="" disabled>-- اضغط لاختيار القالب --</option>
                          {Array.from(new Set([
                            ...(trainingTemplates ? Object.keys(trainingTemplates) : []),
                            ...(nutritionTemplates ? Object.keys(nutritionTemplates) : [])
                          ])).map((id) => {
                            const name = trainingTemplates?.[id]?.arabicTitle || trainingTemplates?.[id]?.title || nutritionTemplates?.[id]?.title || id;
                            return <option key={id} value={id}>{name}</option>;
                          })}
                        </select>
                        <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mt-1">
                          سيتم تلقائياً تذويق برنامج التدريب والتغذية للمشترك وتعبئة كافة الجداول.
                        </p>
                      </div>

                      {role === "coach" && (
                        <div className="w-full md:w-2/3 flex flex-col gap-3 pl-0 md:border-r border-neutral-800 md:pr-6">
                          <label className="text-sm font-bold text-neutral-400 block mb-1">
                            هل لديك ملاحظات أو طلبات خاصة للـ Lead Coach حول هذا المتدرب؟ (اختياري)
                          </label>
                          <textarea
                            id={`coachNote-${activeProgram._id}`}
                            placeholder="اكتب ملاحظاتك هنا..."
                            className="bg-neutral-950 border border-neutral-700 text-neutral-200 rounded-xl p-4 text-sm focus:border-blue-500 hover:border-blue-500/50 transition-all outline-none w-full resize-none min-h-[100px] leading-relaxed shadow-inner"
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => {
                                const noteInput = document.getElementById(`coachNote-${activeProgram._id}`);
                                submitProgram(activeProgram._id, noteInput?.value || "");
                                if (noteInput) noteInput.value = "";
                              }}
                              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 font-bold w-full md:w-auto hover:scale-105"
                            >
                              <Send className="w-5 h-5" /> 
                              <span>تقديم لـ (Lead Coach)</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {(role === "trainer_lead" || role === "admin") &&
                activeProgram.status === "submitted" && (
                  <>
                    <button
                      onClick={() => approveProgram(activeProgram._id)}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-colors shadow-lg font-bold"
                    >
                      <CheckCircle className="w-4 h-4" /> موافقة
                    </button>
                    <div className="flex bg-neutral-950 border border-neutral-700 rounded-xl overflow-hidden">
                      <input
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="سبب الرفض..."
                        className="bg-transparent text-white px-3 py-2 outline-none w-48 text-sm"
                      />
                      <button
                        onClick={() => {
                          if (!rejectionReason)
                            return alert("يرجى كتابة سبب الرفض");
                          rejectProgram(activeProgram._id, rejectionReason);
                          setRejectionReason("");
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-2 transition-colors font-bold text-sm"
                      >
                        <XCircle className="w-4 h-4" /> رفض
                      </button>
                    </div>
                  </>
                )}
            </div>
          </div>
        )}

        <div className="w-full bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
          <DashboardTabs
            activeTab={activeSubTab}
            onTabChange={setActiveSubTab}
          />

          <div className="p-6 md:p-8 min-h-[50vh]">
            {activeSubTab === "training" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row items-center justify-between bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                  <div className="w-full">
                    {isEditMode ? (
                      <>
                        <input
                          value={activeProgram?.trainingPlan?.title || ""}
                          onChange={(e) =>
                            updateTrainingInfo(
                              safeUserId,
                              "title",
                              e.target.value,
                            )
                          }
                          className="text-2xl font-bold mb-2 bg-transparent border-b-2 border-dashed border-blue-500/50 px-2 py-1 focus:border-blue-500 outline-none w-full text-white"
                          placeholder="عنوان البرنامج (مثال: برنامج المبتدئين)"
                        />
                        <textarea
                          value={activeProgram?.trainingPlan?.desc || ""}
                          onChange={(e) =>
                            updateTrainingInfo(
                              safeUserId,
                              "desc",
                              e.target.value,
                            )
                          }
                          className="text-neutral-400 w-full bg-transparent border-b-2 border-dashed border-neutral-700 px-2 py-1 mt-2 focus:border-blue-500 outline-none resize-none"
                          placeholder="وصف البرنامج"
                          rows={2}
                        />
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold mb-2 text-white">
                          {activeProgram?.trainingPlan?.title ||
                            "برنامج التدريب"}
                        </h2>
                        <p className="text-neutral-400">
                          {activeProgram?.trainingPlan?.desc}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 items-stretch">
                  {activeProgram?.trainingPlan?.training?.map((day, dIdx) => (
                    <TrainingDayCard
                      key={dIdx}
                      day={day}
                      dayIndex={dIdx}
                      planId={safeUserId}
                      isEditMode={isEditMode}
                      plansHook={programHook}
                    />
                  ))}
                  {isEditMode && (
                    <button
                      onClick={() => programHook.addDay(safeUserId)}
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
                        value={activeProgram?.nutritionPlan?.title || ""}
                        onChange={(e) =>
                          updateNutritionInfo(
                            safeUserId,
                            "title",
                            e.target.value,
                          )
                        }
                        className="text-2xl font-bold mb-2 bg-transparent border-b-2 border-dashed border-emerald-500/50 px-2 py-1 focus:border-emerald-500 outline-none w-full text-white"
                        placeholder="عنوان برنامج التغذية"
                      />
                      <textarea
                        value={activeProgram?.nutritionPlan?.desc || ""}
                        onChange={(e) =>
                          updateNutritionInfo(
                            safeUserId,
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
                      <h2 className="text-2xl font-bold mb-2 text-white">
                        {activeProgram?.nutritionPlan?.title ||
                          "برنامج التغذية"}
                      </h2>
                      <p className="text-neutral-400">
                        {activeProgram?.nutritionPlan?.desc}
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  {activeProgram?.nutritionPlan?.meals?.map((meal, mIdx) => (
                    <NutritionMealCard
                      key={mIdx}
                      meal={meal}
                      mealIndex={mIdx}
                      planId={safeUserId}
                      isEditMode={isEditMode}
                      nutritionHook={programHook}
                    />
                  ))}
                  {isEditMode && (
                    <button
                      onClick={() => programHook.addMeal(safeUserId)}
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
