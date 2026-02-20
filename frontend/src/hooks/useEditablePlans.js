import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Fetch endpoints using env or fallback to localhost
const API_URL = "http://localhost:5000/api/plans";

export const useEditablePlans = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const dbData = response.data;

      if (dbData && Object.keys(dbData).length > 0) {
        setData(dbData);
      } else {
        // If the database is empty, start with empty data
        setData({});
      }
    } catch (error) {
      console.error("Error fetching from DB:", error);
      setData({});
    } finally {
      setLoading(false);
    }
  };

  // Load purely from database on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const resetToOriginal = () => {
    fetchPlans();
  };

  // Explicit Save Function to push changes entirely to the DB
  const saveToDatabase = async (silent = false) => {
    setIsSaving(true);
    let toastId;
    if (!silent)
      toastId = toast.loading("جار حفظ الپيانات في قاعدة البيانات...");
    try {
      await axios.post(`${API_URL}/bulk`, data);
      if (!silent) toast.success("تم الحفظ بنجاح!", { id: toastId });
    } catch (error) {
      console.error("Failed to save to database:", error);
      if (!silent)
        toast.error("فشل الحفظ. يرجى المحاولة مرة اخرى", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const timerRef = useRef({});

  // Debounced auto-sync specifically for a given plan
  const autoSyncToDB = (planId, updatedPlan) => {
    if (timerRef.current[planId]) {
      clearTimeout(timerRef.current[planId]);
    }
    timerRef.current[planId] = setTimeout(async () => {
      try {
        await axios.put(`${API_URL}/${planId}`, updatedPlan);
      } catch (error) {
        console.error("Autosave failed DB Sync:", error);
      }
    }, 1000); // Wait 1s after the user stops typing
  };

  const addDay = (planId) => {
    setData((prev) => {
      const plan = prev[planId];
      if (!plan) return prev;
      const newDay = {
        day: "يوم جديد",
        focus: "تركيز جديد",
        exercises: [],
        cardio: "بدون كارديو",
      };

      const updatedPlan = {
        ...plan,
        training: [...(plan.training || []), newDay],
      };
      autoSyncToDB(planId, updatedPlan);

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const deleteDay = (planId, dayIndex) => {
    setData((prev) => {
      const plan = prev[planId];
      const newTraining = [...plan.training];
      newTraining.splice(dayIndex, 1);

      const updatedPlan = { ...plan, training: newTraining };
      autoSyncToDB(planId, updatedPlan);

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const updateDay = (planId, dayIndex, key, value) => {
    setData((prev) => {
      const plan = prev[planId];
      const newTraining = [...plan.training];
      newTraining[dayIndex] = { ...newTraining[dayIndex], [key]: value };

      const updatedPlan = { ...plan, training: newTraining };
      autoSyncToDB(planId, updatedPlan);

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const addExercise = (planId, dayIndex) => {
    setData((prev) => {
      const plan = prev[planId];
      const newTraining = [...plan.training];
      const newEx = {
        name: "تمرين جديد",
        sets: 3,
        reps: "10 عدات",
        desc: "وصف التمرين",
        video: "",
        images: [""],
      };
      newTraining[dayIndex] = {
        ...newTraining[dayIndex],
        exercises: [...(newTraining[dayIndex].exercises || []), newEx],
      };

      const updatedPlan = { ...plan, training: newTraining };
      autoSyncToDB(planId, updatedPlan);

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const deleteExercise = (planId, dayIndex, exIndex) => {
    setData((prev) => {
      const plan = prev[planId];
      const newTraining = [...plan.training];
      const newExercises = [...newTraining[dayIndex].exercises];
      newExercises.splice(exIndex, 1);
      newTraining[dayIndex] = {
        ...newTraining[dayIndex],
        exercises: newExercises,
      };

      const updatedPlan = { ...plan, training: newTraining };
      autoSyncToDB(planId, updatedPlan);

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const updateExercise = (planId, dayIndex, exIndex, key, value) => {
    setData((prev) => {
      const plan = prev[planId];
      const newTraining = [...plan.training];
      const newExercises = [...newTraining[dayIndex].exercises];
      newExercises[exIndex] = { ...newExercises[exIndex], [key]: value };
      newTraining[dayIndex] = {
        ...newTraining[dayIndex],
        exercises: newExercises,
      };

      const updatedPlan = { ...plan, training: newTraining };
      autoSyncToDB(planId, updatedPlan);

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  return {
    data,
    loading,
    isSaving,
    saveToDatabase,
    resetToOriginal,
    addDay,
    deleteDay,
    updateDay,
    addExercise,
    deleteExercise,
    updateExercise,
  };
};
