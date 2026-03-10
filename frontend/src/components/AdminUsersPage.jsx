import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UserPlus, Shield, User, Search, Loader2 } from "lucide-react";
import Loading from "../../common/Loading";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({ phone: "", role: "user" });

  const API_URL = import.meta.env.VITE_BASE_URL;

  // 1. جلب المستخدمين من السيرفر
  const fetchUsers = async () => {
    const storedToken = sessionStorage.getItem("token");
    if (!storedToken) return toast.error("لا يوجد توكن، سجل دخولك");

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { authorization: `Bearer ${storedToken}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل جلب المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. إضافة مستخدم جديد مع تحويل الصفر لـ 962
  const handleAddUser = async () => {
    if (!newUser.phone) return toast.error("دخل رقم التلفون يا وحش");

    let formattedPhone = newUser.phone.trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "962" + formattedPhone.substring(1);
    }

    const storedToken = sessionStorage.getItem("token");
    try {
      setActionLoading(true);
      await axios.post(
        `${API_URL}/admin/user/add`,
        { ...newUser, phone: formattedPhone },
        { headers: { authorization: `Bearer ${storedToken}` } },
      );
      toast.success("تم إضافة المستخدم بنجاح");
      setNewUser({ phone: "", role: "user" });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل الإضافة");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. تحديث الصلاحية
  const handleUpdateRole = async (id, newRole) => {
    const storedToken = sessionStorage.getItem("token");
    try {
      await axios.put(
        `${API_URL}/admin/user/${id}`,
        { role: newRole },
        {
          headers: { authorization: `Bearer ${storedToken}` },
        },
      );
      toast.success("تم تحديث الصلاحية");
      fetchUsers();
    } catch (err) {
      toast.error("فشل التحديث");
    }
  };

  // 4. منطق البحث الذكي (لو كتب 07 يحولها لـ 9627 بالبحث)
  const filteredUsers = users.filter((u) => {
    let search = searchTerm.trim();
    if (search.startsWith("0")) {
      search = "962" + search.substring(1);
    }
    return u.phone?.includes(search);
  });

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black text-white p-8 rounded-[2rem] shadow-2xl border-b-4 border-red-600">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter">
              HIGH FIT <span className="text-red-600">ADMIN</span>
            </h1>
            <p className="text-gray-400 mt-1 font-medium">
              نظام إدارة الصلاحيات والأعضاء
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-red-600 px-8 py-3 rounded-2xl">
            <p className="text-xs font-bold text-red-100 uppercase">
              إجمالي الأعضاء
            </p>
            <p className="text-3xl font-black">{users.length}</p>
          </div>
        </div>

        {/* Add User Card */}
        <Card className="p-6 border-none shadow-xl rounded-[2rem] bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-red-600"></div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 italic text-gray-800">
            <UserPlus className="text-red-600" /> إضافة حساب جديد
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="رقم الهاتف (مثلاً 079...)"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
              className="rounded-xl h-12 border-gray-200 focus:ring-red-600"
            />
            <Select
              onValueChange={(v) => setNewUser({ ...newUser, role: v })}
              defaultValue="user"
            >
              <SelectTrigger className="rounded-xl h-12">
                <SelectValue placeholder="اختر الصلاحية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">عضو (User)</SelectItem>
                <SelectItem value="employee">موظف (Employee)</SelectItem>
                <SelectItem value="admin">أدمن (Admin)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddUser}
              disabled={actionLoading}
              className="h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
            >
              {actionLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "تفعيل الحساب"
              )}
            </Button>
          </div>
        </Card>

        {/* Smart Search Bar */}
        <div className="relative group">
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors"
            size={20}
          />
          <Input
            placeholder="ابحث بـ 079 أو 962..."
            className="pr-12 h-14 rounded-2xl border-none shadow-md focus-visible:ring-2 focus-visible:ring-red-600 bg-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <Card
                key={u._id}
                className="p-6 border-none shadow-md rounded-[2rem] bg-white hover:shadow-xl transition-all group border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-4 rounded-2xl ${u.role === "admin" ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"}`}
                  >
                    {u.role === "admin" ? (
                      <Shield size={28} />
                    ) : (
                      <User size={28} />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${u.role === "admin" ? "bg-red-600 text-white" : "bg-black text-white"}`}
                  >
                    {u.role}
                  </span>
                </div>

                <div className="space-y-1">
                  {/* عرض الرقم بصيغة 07 للأدمن لسهولة القراءة */}
                  <p className="text-xl font-black text-gray-900 tracking-tight">
                    {u.phone?.startsWith("962")
                      ? "0" + u.phone.substring(3)
                      : u.phone}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    انضم في: {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50">
                  <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase tracking-widest text-center">
                    تعديل الصلاحية
                  </label>
                  <Select
                    onValueChange={(v) => handleUpdateRole(u._id, v)}
                    defaultValue={u.role}
                  >
                    <SelectTrigger className="h-10 text-xs rounded-xl border-gray-100 bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400 font-bold italic">
              لا يوجد مستخدمين يطابقون بحثك..
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
