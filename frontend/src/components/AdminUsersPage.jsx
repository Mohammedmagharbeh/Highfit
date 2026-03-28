import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  UserPlus,
  Shield,
  Search,
  Loader2,
  Utensils,
  Dumbbell,
} from "lucide-react";
import Loading from "../../common/Loading";
import Cookies from "js-cookie";

const AdminUsersPage = () => {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [hasSubscriptions, setHasSubscriptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    phone: "",
    role: "admin",
    username: "",
    password: "",
  });

  const API_URL = import.meta.env.VITE_BASE_URL;
  const isAr = i18n.language === "ar";

  const getAuthToken = () => Cookies.get("token") || Cookies.get("staffToken");

  const fetchUsers = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error(t("staff_toast_login_required"));
      } else {
        toast.error(err.response?.data?.message || t("staff_toast_fetch_fail"));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasSubscriptions(Array.isArray(res.data) && res.data.length > 0);
    } catch (err) {
      setHasSubscriptions(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSubscriptions();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.username.trim()) return toast.error(isAr ? "اسم المستخدم مطلوب" : "Username required");
    
    // بناء البيانات للإرسال بشكل نظيف
    const payload = {
      username: newUser.username.trim(),
      role: newUser.role,
    };

    if (newUser.role === "user") {
      if (!newUser.phone.trim()) return toast.error(t("staff_toast_phone_required"));
      
      let formattedPhone = newUser.phone.trim();
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "962" + formattedPhone.substring(1);
      }
      payload.phone = formattedPhone;
      // لا نرسل باسوورد لليوزر العادي
    } else {
      if (!newUser.password || newUser.password.length < 4) {
        return toast.error(isAr ? "كلمة السر يجب أن تكون 4 خانات على الأقل" : "Password min 4 chars");
      }
      payload.password = newUser.password;
      // سر النجاح: لا ترسل حقل phone نهائياً للموظفين لتجنب تضارب الـ Unique/Empty String
    }

    const token = getAuthToken();
    const loadingToast = toast.loading(t("staff_toast_adding_user"));

    try {
      setActionLoading(true);
      await axios.post(
        `${API_URL}/admin/user/add`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t("staff_toast_add_success"), { id: loadingToast });
      setNewUser({ phone: "", role: "admin", username: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("DEBUG_ERROR:", err.response?.data);
      toast.error(err.response?.data?.message || t("staff_toast_add_fail"), {
        id: loadingToast,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    const token = getAuthToken();
    const loadingToast = toast.loading(t("staff_toast_updating_role"));
    try {
      await axios.put(
        `${API_URL}/admin/user/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t("staff_toast_update_success"), { id: loadingToast });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "عذراً، لا تملك صلاحية التعديل", { id: loadingToast });
    }
  };

  const filteredUsers = users.filter((u) => {
    let search = searchTerm.toLowerCase().trim();
    return u.phone?.includes(search) || u.username?.toLowerCase().includes(search);
  });

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto space-y-6 pt-16 pb-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0a0a0a] text-white p-8 rounded-[2.5rem] shadow-2xl border-b-4 border-orange-600">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-tight">
              HIGH FIT <span className="text-orange-600">STAFF</span>
            </h1>
            <p className="text-gray-500 mt-1 font-bold italic uppercase text-xs tracking-widest">
              {isAr ? "نظام إدارة الصلاحيات والمستخدمين" : "User & Staff Management System"}
            </p>
          </div>
          <div className="mt-6 md:mt-0 bg-orange-600 px-10 py-4 rounded-[1.5rem] text-center shadow-lg shadow-orange-600/20">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-tighter">{t("total_accounts")}</p>
            <p className="text-4xl font-black italic tracking-tighter">{users.length}</p>
          </div>
        </div>

        {/* Add User Form */}
        <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden group">
          <div className={`absolute top-0 ${isAr ? "right-0" : "left-0"} w-2 h-full bg-orange-600 transition-all duration-500 group-hover:w-3`}></div>
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic text-gray-800 uppercase tracking-tighter">
            <UserPlus className="text-orange-600" /> {t("add_new_staff")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">{t("job_role")}</label>
              <Select onValueChange={(v) => setNewUser({ ...newUser, role: v })} value={newUser.role}>
                <SelectTrigger className="rounded-2xl h-14 bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-orange-600/20 transition-all">
                  <SelectValue placeholder={t("job_role")} />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-100 shadow-2xl rounded-2xl z-[1000]">
                  <SelectItem value="admin" className="font-bold">{t("role_admin")}</SelectItem>
                  <SelectItem value="chef" className="font-bold">{t("role_chef")}</SelectItem>
                  <SelectItem value="trainer_lead" className="font-bold">{t("role_lead")}</SelectItem>
                  <SelectItem value="coach" className="font-bold">{t("role_coach")}</SelectItem>
                  <SelectItem value="user" className="font-bold text-orange-600">{t("role_user")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">{t("username_label")}</label>
              <Input
                placeholder={t("username_placeholder")}
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="rounded-2xl h-14 bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-orange-600/20"
              />
            </div>

            {newUser.role === "user" ? (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">{t("phone_number")}</label>
                <Input
                  placeholder="07XXXXXXXX"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="rounded-2xl h-14 bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-orange-600/20"
                />
              </div>
            ) : (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">{t("password_label")}</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="rounded-2xl h-14 bg-gray-50 border-none font-bold text-orange-600 focus:ring-2 focus:ring-orange-600/20"
                />
              </div>
            )}
          </div>

          <Button
            onClick={handleAddUser}
            disabled={actionLoading}
            className="mt-8 w-full lg:w-auto px-16 h-14 bg-[#0a0a0a] hover:bg-orange-600 text-white font-black italic uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-black/10 active:scale-95 flex gap-2"
          >
            {actionLoading ? <Loader2 className="animate-spin" /> : t("save_staff_btn")}
          </Button>
        </Card>

        {/* Search Bar */}
        <div className="relative group">
          <Search
            className={`absolute ${isAr ? "right-6" : "left-6"} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors duration-300`}
            size={22}
          />
          <Input
            placeholder={t("search_placeholder")}
            className={`${isAr ? "pr-16" : "pl-16"} h-16 rounded-[2rem] border-none shadow-lg bg-white font-bold text-lg text-gray-800 focus:ring-2 focus:ring-orange-600/10 transition-all`}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((u) => (
            <Card key={u._id} className="p-8 border-none shadow-md rounded-[3rem] bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-5 rounded-[1.5rem] ${u.role === "admin" ? "bg-orange-50 text-orange-600" : u.role === "chef" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                  {u.role === "admin" ? <Shield size={28} /> : u.role === "chef" ? <Utensils size={28} /> : <Dumbbell size={28} />}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase bg-[#0a0a0a] text-white tracking-widest">{u.role}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-black text-orange-600 uppercase italic">@{u.username || "no_username"}</p>
                <p className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                  {u.role === 'user' ? (u.phone?.startsWith("962") ? "0" + u.phone.substring(3) : u.phone) : <span className="text-gray-300 text-sm tracking-[0.2em] font-black not-italic">STAFF ACCOUNT</span>}
                </p>
                <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  {t("joined_at")}: {new Date(u.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-US")}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100/50">
                <label className="text-[9px] font-black text-gray-400 block mb-3 uppercase tracking-[0.2em] px-1">{t("change_role")}</label>
                <Select onValueChange={(v) => handleUpdateRole(u._id, v)} defaultValue={u.role}>
                  <SelectTrigger className="h-12 text-xs rounded-2xl border-none bg-gray-50 font-black text-gray-600 hover:bg-gray-100 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-100 shadow-2xl rounded-[1.5rem] z-[1000]">
                    <SelectItem value="admin" className="font-bold">Administrator</SelectItem>
                    <SelectItem value="chef" className="font-bold">Kitchen Chef</SelectItem>
                    <SelectItem value="trainer_lead" className="font-bold">Lead Trainer</SelectItem>
                    <SelectItem value="coach" className="font-bold">Pro Coach</SelectItem>
                    <SelectItem value="user" className="font-bold text-gray-400">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;