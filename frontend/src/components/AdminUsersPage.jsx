import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
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
  User,
  Search,
  Loader2,
  Utensils,
  Award,
  Dumbbell,
} from "lucide-react";
import Loading from "../../common/Loading";

const AdminUsersPage = () => {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
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

  // دالة موحدة لجلب التوكن المتاح (أدمن أو موظف)
  const getAuthToken = () =>
    sessionStorage.getItem("token") || sessionStorage.getItem("staffToken");

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

  const handleAddUser = async () => {
    if (!newUser.phone) return toast.error(t("staff_toast_phone_required"));
    if (!newUser.username || !newUser.password)
      return toast.error(t("staff_toast_credentials_required"));

    let formattedPhone = newUser.phone.trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "962" + formattedPhone.substring(1);
    }

    const token = getAuthToken();
    const loadingToast = toast.loading(t("staff_toast_adding_user"));

    try {
      setActionLoading(true);
      await axios.post(
        `${API_URL}/admin/user/add`,
        { ...newUser, phone: formattedPhone },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(t("staff_toast_add_success"), { id: loadingToast });
      setNewUser({ phone: "", role: "admin", username: "", password: "" });
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
      // إذا كان التوكن لشخص مش أدمن (زي الشيف عمر) رح يرفض السيرفر هون
      toast.error(
        err.response?.data?.message || "عذراً، لا تملك صلاحية التعديل",
        { id: loadingToast },
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    let search = searchTerm.toLowerCase().trim();
    return (
      u.phone?.includes(search) || u.username?.toLowerCase().includes(search)
    );
  });

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 md:p-8"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* التوست يظهر تحت الهيدر مباشرة بمسافة أمان */}


      <div className="max-w-6xl mx-auto space-y-6 pt-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black text-white p-8 rounded-[2rem] shadow-2xl border-b-4 border-red-600">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              HIGH FIT <span className="text-red-600">MANAGEMENT</span>
            </h1>
            <p className="text-gray-400 mt-1 font-medium italic">
              {t("staff_mgmt_subtitle")}
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-red-600 px-8 py-3 rounded-2xl text-center min-w-[120px]">
            <p className="text-[10px] font-bold text-red-100 uppercase">
              {t("total_accounts")}
            </p>
            <p className="text-3xl font-black">{users.length}</p>
          </div>
        </div>

        {/* Add Staff Card */}
        <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white relative overflow-hidden">
          <div
            className={`absolute top-0 ${isAr ? "right-0" : "left-0"} w-2 h-full bg-red-600`}
          ></div>
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic text-gray-800 uppercase">
            <UserPlus className="text-red-600" /> {t("add_new_staff")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">
                {t("job_role")}
              </label>
              <Select
                onValueChange={(v) => setNewUser({ ...newUser, role: v })}
                value={newUser.role}
              >
                <SelectTrigger className="rounded-xl h-14 bg-gray-50 border-none font-bold text-gray-700">
                  <SelectValue placeholder={t("job_role")} />
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
                {t("phone_number")}
              </label>
              <Input
                placeholder="07XXXXXXXX"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                className="rounded-xl h-14 bg-gray-50 border-none font-bold text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">
                {t("username_label")}
              </label>
              <Input
                placeholder={t("username_placeholder")}
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="rounded-xl h-14 bg-gray-50 border-none font-bold text-red-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 mx-2 uppercase tracking-widest">
                {t("password_label")}
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="rounded-xl h-14 bg-gray-50 border-none font-bold text-red-600"
              />
            </div>
          </div>

          <Button
            onClick={handleAddUser}
            disabled={actionLoading}
            className="mt-8 w-full lg:w-auto px-12 h-14 bg-black hover:bg-red-600 text-white font-black italic uppercase tracking-widest rounded-xl transition-all shadow-lg flex gap-2"
          >
            {actionLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              t("save_staff_btn")
            )}
          </Button>
        </Card>

        {/* Search */}
        <div className="relative group">
          <Search
            className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors`}
            size={20}
          />
          <Input
            placeholder={t("search_placeholder")}
            className={`${isAr ? "pr-12" : "pl-12"} h-14 rounded-2xl border-none shadow-md bg-white font-bold`}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u) => (
            <Card
              key={u._id}
              className="p-6 border-none shadow-md rounded-[2.5rem] bg-white hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-4 rounded-2xl ${
                    u.role === "admin"
                      ? "bg-red-50 text-red-600"
                      : u.role === "chef"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {u.role === "admin" ? (
                    <Shield size={24} />
                  ) : u.role === "chef" ? (
                    <Utensils size={24} />
                  ) : (
                    <Dumbbell size={24} />
                  )}
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase bg-black text-white">
                  {u.role}
                </span>
              </div>

              <div className="space-y-1">
                {u.username && (
                  <p className="text-sm font-bold text-red-600">
                    @{u.username}
                  </p>
                )}
                <p className="text-xl font-black text-gray-900 italic uppercase">
                  {u.phone?.startsWith("962")
                    ? "0" + u.phone.substring(3)
                    : u.phone}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  {t("joined_at")}:{" "}
                  {new Date(u.createdAt).toLocaleDateString(
                    isAr ? "ar-EG" : "en-US",
                  )}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50">
                <label className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-widest">
                  {t("change_role")}
                </label>
                <Select
                  onValueChange={(v) => handleUpdateRole(u._id, v)}
                  defaultValue={u.role}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl border-none bg-gray-50 font-bold text-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-100 shadow-2xl rounded-xl z-[1000]">
                    <SelectItem value="admin" className="font-bold">
                      Admin
                    </SelectItem>
                    <SelectItem value="chef" className="font-bold">
                      Chef
                    </SelectItem>
                    <SelectItem value="trainer_lead" className="font-bold">
                      Lead
                    </SelectItem>
                    <SelectItem value="coach" className="font-bold">
                      Coach
                    </SelectItem>
                    <SelectItem
                      value="user"
                      className="font-bold text-gray-300"
                    >
                      User
                    </SelectItem>
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
