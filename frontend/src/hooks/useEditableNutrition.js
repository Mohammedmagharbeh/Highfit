import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = `${process.env.VITE_BASE_URL}/nutrition`;

export const useEditableNutrition = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchNutrition = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const dbData = response.data;

      if (dbData && Object.keys(dbData).length > 0) {
        const formattedData = {};
        for (const [key, value] of Object.entries(dbData)) {
          if (Array.isArray(value)) {
            formattedData[key] = {
              title: "برنامج التخسيس 1500 - 1900 سعرة",
              desc: "خيارات متعددة لوجبات متوازنة يومياً. قم باختيار وجبة واحدة من كل قسم للحفاظ على سعراتك.",
              meals: value,
            };
          } else {
            formattedData[key] = value;
          }
        }
        setData(formattedData);
      } else {
        setData({});
      }
    } catch (error) {
      console.error("Error fetching from DB:", error);
      setData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutrition();
  }, []);

  const resetToOriginal = () => {
    fetchNutrition();
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

  const addMeal = (planId) => {
    setData((prev) => {
      const planData = prev[planId] || { title: "", desc: "", meals: [] };
      const currentMeals = planData.meals || [];
      const newMeal = {
        type: "وجبة جديدة",
        calories: "0 - 0 سعرة",
        options: [],
      };
      const updatedMeals = [...currentMeals, newMeal];
      const updatedPlan = { ...planData, meals: updatedMeals };

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const deleteMeal = (planId, mealIndex) => {
    setData((prev) => {
      const planData = prev[planId] || { title: "", desc: "", meals: [] };
      const currentMeals = planData.meals || [];
      const updatedMeals = [...currentMeals];
      updatedMeals.splice(mealIndex, 1);
      const updatedPlan = { ...planData, meals: updatedMeals };

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const updateMeal = (planId, mealIndex, key, value) => {
    setData((prev) => {
      const planData = prev[planId] || { title: "", desc: "", meals: [] };
      const currentMeals = planData.meals || [];
      const updatedMeals = [...currentMeals];
      updatedMeals[mealIndex] = { ...updatedMeals[mealIndex], [key]: value };
      const updatedPlan = { ...planData, meals: updatedMeals };

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const addOption = (planId, mealIndex) => {
    setData((prev) => {
      const planData = prev[planId] || { title: "", desc: "", meals: [] };
      const currentMeals = planData.meals || [];
      const updatedMeals = [...currentMeals];
      const newOption = {
        desc: "وصف الخيار الجديد",
        c: 0,
        p: 0,
        carbs: 0,
        f: 0,
      };

      updatedMeals[mealIndex] = {
        ...updatedMeals[mealIndex],
        options: [...(updatedMeals[mealIndex].options || []), newOption],
      };

      const updatedPlan = { ...planData, meals: updatedMeals };

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const deleteOption = (planId, mealIndex, optionIndex) => {
    setData((prev) => {
      const planData = prev[planId] || { title: "", desc: "", meals: [] };
      const currentMeals = planData.meals || [];
      const updatedMeals = [...currentMeals];
      const newOptions = [...updatedMeals[mealIndex].options];
      newOptions.splice(optionIndex, 1);

      updatedMeals[mealIndex] = {
        ...updatedMeals[mealIndex],
        options: newOptions,
      };

      const updatedPlan = { ...planData, meals: updatedMeals };

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const updateOption = (planId, mealIndex, optionIndex, key, value) => {
    setData((prev) => {
      const planData = prev[planId] || { title: "", desc: "", meals: [] };
      const currentMeals = planData.meals || [];
      const updatedMeals = [...currentMeals];
      const newOptions = [...updatedMeals[mealIndex].options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], [key]: value };

      updatedMeals[mealIndex] = {
        ...updatedMeals[mealIndex],
        options: newOptions,
      };

      const updatedPlan = { ...planData, meals: updatedMeals };

      return {
        ...prev,
        [planId]: updatedPlan,
      };
    });
  };

  const updateNutritionInfo = (planId, key, value) => {
    setData((prev) => {
      const planData = prev[planId] || { title: "", desc: "", meals: [] };
      const updatedPlan = { ...planData, [key]: value };

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
    addMeal,
    deleteMeal,
    updateMeal,
    addOption,
    deleteOption,
    updateOption,
    updateNutritionInfo,
  };
};
