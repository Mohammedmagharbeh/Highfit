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
  Trash2,
  Users,
  User,
  Phone,
  Lock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Loading from "../../common/Loading";
import Cookies from "js-cookie";

const STAFF_ROLES = ["admin", "chef", "trainer_lead", "coach"];

function RoleIcon({ role, size = 24 }) {
  if (role === "admin") return <Shield size={size} />;
  if (role === "chef") return <Utensils size={size} />;
  if (role === "user") return <User size={size} />;
  return <Dumbbell size={size} />;
}

function roleColor(role) {
  if (role === "admin") return "bg-orange-50 text-orange-600";
  if (role === "chef") return "bg-red-50 text-red-600";
  if (role === "user") return "bg-blue-50 text-blue-600";
  if (role === "trainer_lead") return "bg-purple-50 text-purple-600";
  if (role === "coach") return "bg-green-50 text-green-600";
  return "bg-gray-50 text-gray-600";
}

const AdminUsersPage = () => {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customer");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [customerForm, setCustomerForm] = useState({ username: "", phone: "" });
  const [staffForm, setStaffForm] = useState({
    username: "",
    password: "",
    role: "coach",
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddCustomer = async () => {
    if (!customerForm.username.trim())
      return toast.error(isAr ? "اسم المشترك مطلوب" : "Customer name required");
    if (!customerForm.phone.trim())
      return toast.error(isAr ? "رقم الهاتف مطلوب" : "Phone number required");

    const token = getAuthToken();
    const loadingToast = toast.loading(
      isAr ? "جارٍ إضافة المشترك..." : "Adding customer...",
    );

    try {
      setActionLoading(true);
      await axios.post(
        `${API_URL}/admin/user/add`,
        {
          username: customerForm.username.trim(),
          phone: customerForm.phone.trim(),
          role: "user",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(t("staff_toast_add_success"), { id: loadingToast });
      setCustomerForm({ username: "", phone: "" });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || t("staff_toast_add_fail"), {
        id: loadingToast,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!staffForm.username.trim())
      return toast.error(isAr ? "اسم الموظف مطلوب" : "Staff username required");
    if (!staffForm.password || staffForm.password.length < 4)
      return toast.error(
        isAr
          ? "كلمة المرور يجب أن تكون 4 أحرف على الأقل"
          : "Password min 4 chars",
      );

    const token = getAuthToken();
    const loadingToast = toast.loading(
      isAr ? "جارٍ إضافة الموظف..." : "Adding staff member...",
    );

    try {
      setActionLoading(true);
      await axios.post(
        `${API_URL}/admin/user/add`,
        {
          username: staffForm.username.trim(),
          password: staffForm.password,
          role: staffForm.role,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(t("staff_toast_add_success"), { id: loadingToast });
      setStaffForm({ username: "", password: "", role: "coach" });
      fetchUsers();
    } catch (err) {
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(t("staff_toast_update_success"), { id: loadingToast });
      fetchUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "عذراً، لا تملك صلاحية التعديل",
        { id: loadingToast },
      );
    }
  };

  const handleToggleActive = async (user) => {
    const token = getAuthToken();
    const newState = !user.isActive;
    const loadingToast = toast.loading(
      newState
        ? isAr
          ? "جارٍ تفعيل الحساب..."
          : "Activating account..."
        : isAr
          ? "جارٍ إيقاف الحساب..."
          : "Suspending account...",
    );
    try {
      await axios.put(
        `${API_URL}/admin/user/${user._id}`,
        { isActive: newState },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(
        newState
          ? isAr
            ? "تم تفعيل الحساب"
            : "Account activated"
          : isAr
            ? "تم إيقاف الحساب"
            : "Account suspended",
        { id: loadingToast },
      );
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل في تغيير حالة الحساب", {
        id: loadingToast,
      });
    }
  };

  const handleDelete = async (id) => {
    const token = getAuthToken();
    const loadingToast = toast.loading(isAr ? "جارٍ الحذف..." : "Deleting...");
    try {
      await axios.delete(`${API_URL}/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(isAr ? "تم حذف المستخدم بنجاح" : "User deleted", {
        id: loadingToast,
      });
      setConfirmDelete(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل في الحذف", {
        id: loadingToast,
      });
    }
  };

  const filteredUsers = users.filter((u) => {
    if (activeTab === "customer" && u.userType !== "customer") return false;
    if (activeTab === "staff" && u.userType !== "staff") return false;
    if (!u.userType) {
      if (activeTab === "customer" && u.role !== "user") return false;
      if (activeTab === "staff" && u.role === "user") return false;
    }
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    return (
      u.phone?.includes(search) || u.username?.toLowerCase().includes(search)
    );
  });

  const customerCount = users.filter(
    (u) => u.userType === "customer" || (!u.userType && u.role === "user"),
  ).length;
  const staffCount = users.filter(
    (u) => u.userType === "staff" || (!u.userType && u.role !== "user"),
  ).length;

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 md:p-8"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto space-y-6 pt-16 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0a0a0a] text-white p-8 rounded-[2.5rem] shadow-2xl border-b-4 border-orange-600">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-tight">
              HIGH FIT <span className="text-orange-600">PORTAL</span>
            </h1>
            <p className="text-gray-500 mt-1 font-bold italic uppercase text-xs tracking-widest">
              {isAr
                ? "نظام إدارة المشتركين والموظفين"
                : "Members & Staff Management"}
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex gap-4">
            <div className="bg-orange-600/10 border border-orange-600/30 px-8 py-4 rounded-[1.5rem] text-center">
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-tighter">
                {isAr ? "المشتركون" : "Members"}
              </p>
              <p className="text-3xl font-black italic tracking-tighter text-orange-500">
                {customerCount}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-[1.5rem] text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                {isAr ? "الموظفون" : "Staff"}
              </p>
              <p className="text-3xl font-black italic tracking-tighter text-white">
                {staffCount}
              </p>
            </div>
          </div>
        </div>

        <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden">
          <div
            className={`absolute top-0 ${isAr ? "right-0" : "left-0"} w-2 h-full bg-orange-600`}
          />

          <h2 className="text-2xl font-black mb-6 flex items-center gap-3 italic text-gray-800 uppercase tracking-tighter">
            <UserPlus className="text-orange-600" />
            {isAr ? "إضافة مستخدم جديد" : "Add New User"}
          </h2>

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === "customer"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <Users size={16} />
              {isAr ? "مشترك (عميل)" : "Customer (Member)"}
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === "staff"
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <Shield size={16} />
              {isAr ? "موظف (Staff)" : "Staff (Employee)"}
            </button>
          </div>

          {activeTab === "customer" && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
                {isAr
                  ? "المشتركون يسجلون الدخول عبر رقم الهاتف ورمز OTP"
                  : "Customers log in using their phone number and OTP code"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">
                    {isAr ? "اسم المشترك" : "Customer Name"}
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl h-14 px-4 focus-within:ring-2 focus-within:ring-blue-500/20">
                    <User size={18} className="text-gray-400" />
                    <Input
                      placeholder={isAr ? "الاسم الكامل" : "Full name"}
                      value={customerForm.username}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          username: e.target.value,
                        })
                      }
                      className="border-none bg-transparent shadow-none p-0 h-auto font-bold text-gray-800 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">
                    {isAr ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl h-14 px-4 focus-within:ring-2 focus-within:ring-blue-500/20">
                    <Phone size={18} className="text-gray-400" />
                    <Input
                      placeholder="07XXXXXXXX"
                      value={customerForm.phone}
                      maxLength={10}
                      minLength={10}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          phone: e.target.value,
                        })
                      }
                      className="border-none bg-transparent shadow-none p-0 h-auto font-bold text-gray-800 focus-visible:ring-0"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddCustomer}
                disabled={actionLoading}
                className="w-full md:w-auto px-16 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black italic uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <UserPlus size={18} />
                    {isAr ? "إضافة مشترك" : "Add Customer"}
                  </>
                )}
              </Button>
            </div>
          )}

          {activeTab === "staff" && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl">
                {isAr
                  ? "الموظفون يسجلون الدخول عبر اسم المستخدم وكلمة المرور"
                  : "Staff log in using their username and password"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">
                    {isAr ? "الدور الوظيفي" : "Job Role"}
                  </label>
                  <Select
                    onValueChange={(v) =>
                      setStaffForm({ ...staffForm, role: v })
                    }
                    value={staffForm.role}
                  >
                    <SelectTrigger className="rounded-2xl h-14 bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-orange-600/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-100 shadow-2xl rounded-2xl z-[1000]">
                      <SelectItem value="admin" className="font-bold">
                        {t("role_admin")}
                      </SelectItem>
                      <SelectItem value="chef" className="font-bold">
                        {t("role_chef")}
                      </SelectItem>
                      <SelectItem value="trainer_lead" className="font-bold">
                        {t("role_lead")}
                      </SelectItem>
                      <SelectItem value="coach" className="font-bold">
                        {t("role_coach")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">
                    {isAr ? "اسم المستخدم" : "Username"}
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl h-14 px-4 focus-within:ring-2 focus-within:ring-orange-500/20">
                    <User size={18} className="text-gray-400" />
                    <Input
                      placeholder={t("username_placeholder")}
                      value={staffForm.username}
                      onChange={(e) =>
                        setStaffForm({ ...staffForm, username: e.target.value })
                      }
                      className="border-none bg-transparent shadow-none p-0 h-auto font-bold text-gray-800 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">
                    {isAr ? "كلمة المرور" : "Password"}
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl h-14 px-4 focus-within:ring-2 focus-within:ring-orange-500/20">
                    <Lock size={18} className="text-gray-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={staffForm.password}
                      onChange={(e) =>
                        setStaffForm({ ...staffForm, password: e.target.value })
                      }
                      className="border-none bg-transparent shadow-none p-0 h-auto font-bold text-gray-800 focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddStaff}
                disabled={actionLoading}
                className="w-full md:w-auto px-16 h-12 bg-[#0a0a0a] hover:bg-orange-600 text-white font-black italic uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-black/10 active:scale-95 flex gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <UserPlus size={18} />
                    {isAr ? "إضافة موظف" : "Add Staff Member"}
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-md">
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === "customer"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <Users size={14} />
              {isAr ? "المشتركون" : "Customers"} ({customerCount})
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === "staff"
                  ? "bg-orange-600 text-white"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <Shield size={14} />
              {isAr ? "الموظفون" : "Staff"} ({staffCount})
            </button>
          </div>

          <div className="relative flex-1 group">
            <Search
              className={`absolute ${isAr ? "right-5" : "left-5"} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors`}
              size={20}
            />
            <input
              type="text"
              placeholder={
                isAr
                  ? activeTab === "customer"
                    ? "ابحث بالاسم أو الرقم..."
                    : "ابحث باسم الموظف..."
                  : activeTab === "customer"
                    ? "Search by name or phone..."
                    : "Search by staff name..."
              }
              className={`w-full h-14 ${isAr ? "pr-14 pl-5" : "pl-14 pr-5"} rounded-2xl border-none shadow-md bg-white font-bold text-gray-800 outline-none focus:ring-2 focus:ring-orange-600/10`}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-black italic uppercase text-sm tracking-widest">
              {isAr ? "لا يوجد مستخدمون" : "No users found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((u) => (
              <Card
                key={u._id}
                className={`p-6 border-none shadow-md rounded-[2rem] bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${
                  !u.isActive && u.isActive !== undefined ? "opacity-60" : ""
                }`}
              >
                <div
                  className={`absolute top-0 ${isAr ? "left-0" : "right-0"} m-4`}
                >
                  <span
                    className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      u.userType === "staff" ||
                      (!u.userType && u.role !== "user")
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {u.userType === "staff" ||
                    (!u.userType && u.role !== "user")
                      ? isAr
                        ? "موظف"
                        : "Staff"
                      : isAr
                        ? "مشترك"
                        : "Member"}
                  </span>
                </div>

                <div
                  className={`p-4 rounded-2xl w-fit mb-4 ${roleColor(u.role)}`}
                >
                  <RoleIcon role={u.role} size={26} />
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-xs font-black text-orange-600 uppercase italic">
                    @{u.username || "—"}
                  </p>
                  {u.role === "user" || u.userType === "customer" ? (
                    <p
                      className="text-xl font-black text-gray-900 tracking-tighter"
                      dir="ltr"
                    >
                      {u.phone?.startsWith("962")
                        ? "0" + u.phone.substring(3)
                        : u.phone || "—"}
                    </p>
                  ) : (
                    <p className="text-sm font-black text-gray-300 uppercase tracking-[0.15em]">
                      {u.role?.replace("_", " ").toUpperCase()}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        u.isActive !== false ? "bg-green-500" : "bg-red-400"
                      } animate-pulse`}
                    />
                    {u.isActive !== false
                      ? isAr
                        ? "نشط"
                        : "Active"
                      : isAr
                        ? "موقوف"
                        : "Suspended"}
                    &nbsp;·&nbsp;
                    {new Date(u.createdAt).toLocaleDateString(
                      isAr ? "ar-EG" : "en-US",
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="text-[9px] font-black text-gray-400 block mb-2 uppercase tracking-[0.2em]">
                    {t("change_role")}
                  </label>
                  <Select
                    onValueChange={(v) => handleUpdateRole(u._id, v)}
                    defaultValue={u.role}
                  >
                    <SelectTrigger className="h-10 text-xs rounded-xl border-none bg-gray-50 font-black text-gray-600 hover:bg-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-100 shadow-2xl rounded-xl z-[1000]">
                      <SelectItem value="admin" className="font-bold">
                        Administrator
                      </SelectItem>
                      <SelectItem value="chef" className="font-bold">
                        Kitchen Chef
                      </SelectItem>
                      <SelectItem value="trainer_lead" className="font-bold">
                        Lead Trainer
                      </SelectItem>
                      <SelectItem value="coach" className="font-bold">
                        Pro Coach
                      </SelectItem>
                      <SelectItem
                        value="user"
                        className="font-bold text-blue-600"
                      >
                        Regular Member
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleToggleActive(u)}
                    title={
                      u.isActive !== false
                        ? isAr
                          ? "إيقاف الحساب"
                          : "Suspend account"
                        : isAr
                          ? "تفعيل الحساب"
                          : "Activate account"
                    }
                    className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      u.isActive !== false
                        ? "bg-gray-100 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {u.isActive !== false ? (
                      <>
                        <ToggleRight size={14} />
                        {isAr ? "إيقاف" : "Suspend"}
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={14} />
                        {isAr ? "تفعيل" : "Activate"}
                      </>
                    )}
                  </button>

                  {confirmDelete === u._id ? (
                    <div className="flex gap-1.5 flex-1">
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="flex-1 h-10 rounded-xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all"
                      >
                        {isAr ? "تأكيد" : "Confirm"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 h-10 rounded-xl bg-gray-100 text-gray-600 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                      >
                        {isAr ? "إلغاء" : "Cancel"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(u._id)}
                      title={isAr ? "حذف" : "Delete"}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
