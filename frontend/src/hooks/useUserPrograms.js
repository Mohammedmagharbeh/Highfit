import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = `api/user-programs`;

export const useUserPrograms = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  let initialRole = "user";
  let initialUserId = "";

  const staffUserStr = sessionStorage.getItem("staffUser");
  const regularUserStr = sessionStorage.getItem("user");

  if (staffUserStr) {
    const staffUser = JSON.parse(staffUserStr);
    initialRole = staffUser.role;
    initialUserId = staffUser._id || staffUser.id;
  } else if (regularUserStr) {
    const regularUser = JSON.parse(regularUserStr);
    initialRole = regularUser.role || "user";
    initialUserId = regularUser._id || regularUser.id;
  }

  const [role, setRole] = useState(initialRole);
  const [currentUserId, setCurrentUserId] = useState(initialUserId);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (role === "user" && currentUserId) {
        const res = await axios.get(`${API_URL}/user/${currentUserId}`);
        if (res.data) {
          setData({ [currentUserId]: res.data });
        }
      } else if (role === "coach") {
        const res = await axios.get(`${API_URL}`);
        const map = {};
        res.data.forEach((p) => {
          map[p.userId._id] = p;
        });
        setData(map);
      } else if (role === "trainer_lead" || role === "admin") {
        const res = await axios.get(`${API_URL}`);
        const map = {};
        res.data.forEach((p) => {
          map[p.userId._id] = p;
        });
        setData(map);
      }
    } catch (error) {
      console.error("Error fetching user programs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, currentUserId]);

  const saveToDatabase = async (silent = false) => {
    setIsSaving(true);
    let toastId;
    if (!silent) toastId = toast.loading("جار الحفظ...");
    try {
      const updates = Object.values(data).map((program) => {
        return axios.put(`${API_URL}/${program._id}`, {
          trainingPlan: program.trainingPlan,
          nutritionPlan: program.nutritionPlan,
          status: program.status === "rejected" ? "waiting" : program.status,
        });
      });
      await Promise.all(updates);
      if (!silent) toast.success("تم الحفظ بنجاح!", { id: toastId });
      fetchData();
    } catch (error) {
      console.error("Failed to save:", error);
      if (!silent) toast.error("فشل الحفظ", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const submitProgram = async (programId, coachNote = "") => {
    try {
      // Find the program data to save first before submitting
      const programToSave = Object.values(data).find(
        (p) => p._id === programId,
      );
      if (programToSave) {
        await axios.put(`${API_URL}/${programId}`, {
          trainingPlan: programToSave.trainingPlan,
          nutritionPlan: programToSave.nutritionPlan,
          status:
            programToSave.status === "rejected"
              ? "waiting"
              : programToSave.status,
        });
      }

      await axios.post(`${API_URL}/${programId}/submit`, {
        coachId: currentUserId,
        coachNote,
      });
      toast.success("تم التقديم بنجاح");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("فشل التقديم");
    }
  };

  const approveProgram = async (programId) => {
    try {
      // Pre-save any unsaved edits before approving
      const programToSave = Object.values(data).find(
        (p) => p._id === programId,
      );
      if (programToSave) {
        await axios.put(`${API_URL}/${programId}`, {
          trainingPlan: programToSave.trainingPlan,
          nutritionPlan: programToSave.nutritionPlan,
          status: programToSave.status,
        });
      }

      await axios.post(`${API_URL}/${programId}/approve`);
      toast.success("تمت الموافقة بنجاح");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("فشل الموافقة");
    }
  };

  const rejectProgram = async (programId, reason) => {
    try {
      // Pre-save any unsaved edits before rejecting
      const programToSave = Object.values(data).find(
        (p) => p._id === programId,
      );
      if (programToSave) {
        await axios.put(`${API_URL}/${programId}`, {
          trainingPlan: programToSave.trainingPlan,
          nutritionPlan: programToSave.nutritionPlan,
          status: programToSave.status,
        });
      }

      await axios.post(`${API_URL}/${programId}/reject`, {
        rejectionReason: reason,
      });
      toast.success("تم الرفض بنجاح");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("فشل الرفض");
    }
  };

  const updateTraining = (userId, fn) => {
    setData((prev) => {
      const prog = prev[userId];
      if (!prog) return prev;
      const newTraining = fn([...prog.trainingPlan.training]);
      return {
        ...prev,
        [userId]: {
          ...prog,
          trainingPlan: { ...prog.trainingPlan, training: newTraining },
        },
      };
    });
  };

  const updateNutrition = (userId, fn) => {
    setData((prev) => {
      const prog = prev[userId];
      if (!prog) return prev;
      const newMeals = fn([...prog.nutritionPlan.meals]);
      return {
        ...prev,
        [userId]: {
          ...prog,
          nutritionPlan: { ...prog.nutritionPlan, meals: newMeals },
        },
      };
    });
  };

  const addDay = (userId) => {
    updateTraining(userId, (training) => [
      ...training,
      { day: "يوم جديد", focus: "عضلة جديدة", cardio: "بدون", exercises: [] },
    ]);
  };

  const deleteDay = (userId, dayIndex) => {
    updateTraining(userId, (training) => {
      training.splice(dayIndex, 1);
      return training;
    });
  };

  const updateDay = (userId, dayIndex, key, value) => {
    updateTraining(userId, (training) => {
      training[dayIndex] = { ...training[dayIndex], [key]: value };
      return training;
    });
  };

  const addExercise = (userId, dayIndex) => {
    updateTraining(userId, (training) => {
      const ex = {
        name: "تمرين",
        sets: 3,
        reps: "10",
        desc: "",
        video: "",
        images: [],
      };
      training[dayIndex].exercises = [
        ...(training[dayIndex].exercises || []),
        ex,
      ];
      return training;
    });
  };

  const deleteExercise = (userId, dayIndex, exIndex) => {
    updateTraining(userId, (training) => {
      training[dayIndex].exercises.splice(exIndex, 1);
      return training;
    });
  };

  const updateExercise = (userId, dayIndex, exIndex, key, value) => {
    updateTraining(userId, (training) => {
      training[dayIndex].exercises[exIndex] = {
        ...training[dayIndex].exercises[exIndex],
        [key]: value,
      };
      return training;
    });
  };

  const addMeal = (userId) => {
    updateNutrition(userId, (meals) => [
      ...meals,
      { type: "وجبة جديدة", calories: "0", options: [] },
    ]);
  };

  const deleteMeal = (userId, mealIndex) => {
    updateNutrition(userId, (meals) => {
      meals.splice(mealIndex, 1);
      return meals;
    });
  };

  const updateMeal = (userId, mealIndex, key, value) => {
    updateNutrition(userId, (meals) => {
      meals[mealIndex] = { ...meals[mealIndex], [key]: value };
      return meals;
    });
  };

  const addOption = (userId, mealIndex) => {
    updateNutrition(userId, (meals) => {
      const opt = { desc: "خيار جديد", c: 0, p: 0, carbs: 0, f: 0 };
      meals[mealIndex].options = [...(meals[mealIndex].options || []), opt];
      return meals;
    });
  };

  const deleteOption = (userId, mealIndex, optIndex) => {
    updateNutrition(userId, (meals) => {
      meals[mealIndex].options.splice(optIndex, 1);
      return meals;
    });
  };

  const updateOption = (userId, mealIndex, optIndex, key, value) => {
    updateNutrition(userId, (meals) => {
      meals[mealIndex].options[optIndex] = {
        ...meals[mealIndex].options[optIndex],
        [key]: value,
      };
      return meals;
    });
  };

  const updateTrainingInfo = (userId, key, value) => {
    setData((prev) => {
      const prog = prev[userId];
      return {
        ...prev,
        [userId]: {
          ...prog,
          trainingPlan: { ...prog.trainingPlan, [key]: value },
        },
      };
    });
  };

  const updateNutritionInfo = (userId, key, value) => {
    setData((prev) => {
      const prog = prev[userId];
      return {
        ...prev,
        [userId]: {
          ...prog,
          nutritionPlan: { ...prog.nutritionPlan, [key]: value },
        },
      };
    });
  };

  return {
    data,
    loading,
    isSaving,
    role,
    currentUserId,
    saveToDatabase,
    submitProgram,
    approveProgram,
    rejectProgram,
    resetToOriginal: fetchData,

    addDay,
    deleteDay,
    updateDay,
    addExercise,
    deleteExercise,
    updateExercise,
    updateTrainingInfo,

    addMeal,
    deleteMeal,
    updateMeal,
    addOption,
    deleteOption,
    updateOption,
    updateNutritionInfo,
  };
};
