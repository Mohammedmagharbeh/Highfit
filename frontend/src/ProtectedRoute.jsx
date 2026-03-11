// import { Navigate } from "react-router-dom";
// import { useUser } from "./context/userContext"; // تأكد من المسار
// import toast from "react-hot-toast";
// import { useTranslation } from "react-i18next";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { isAuthenticated, user, loading } = useUser();
//   const { t } = useTranslation();

//   // --- التعديل الجوهري هنا ---
//   // نتحقق من وجود التوكن في السشن ستورج مباشرة كخط دفاع أول
//   const sessionToken = sessionStorage.getItem("token");

//   // 1. إذا كان التطبيق لسه بيحمل بيانات اليوزر
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//         <span className="mr-3 text-white">جاري التحميل...</span>
//       </div>
//     );
//   }

//   // 2. التحقق المزدوج: إذا الـ Context حكى مش مسجل وكمان السشن فاضي
//   // ملاحظة: أضفنا فحص السشن عشان نضمن إنه لو الـ Context لسه ما تحدث، السشن يعطينا الضوء الأخضر
//   if (!isAuthenticated && !sessionToken) {
//     return <Navigate to="/" replace />;
//   }

//   // 3. إذا كان اليوزر مسجل دخول بس ما عنده صلاحية (للرتب الخاصة مثل الآدمن)
//   if (allowedRoles && user && !allowedRoles.includes(user?.role)) {
//     toast.error(t("no_permission") || "ليس لديك صلاحية لدخول هذه الصفحة");
//     return <Navigate to="/Home" replace />; 
//   }

//   // 4. إذا كل الأمور تمام
//   return <>{children}</>;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useUser } from "./context/userContext"; 
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user: contextUser, loading } = useUser();
  const { t } = useTranslation();

  // 1. جلب بيانات الموظف من السشن (Staff System)
  const staffToken = sessionStorage.getItem("staffToken");
  const staffUser = sessionStorage.getItem("staffUser") ? JSON.parse(sessionStorage.getItem("staffUser")) : null;

  // 2. جلب بيانات المشترك العادي (User System)
  const userToken = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // 3. التحقق: هل هو موظف أم مشترك؟
  const isStaff = !!staffToken;
  const isNormalUser = isAuthenticated || !!userToken;
  const currentUser = staffUser || contextUser;

  if (!isStaff && !isNormalUser) {
    return <Navigate to="/staff" replace />;
  }

  // 4. فحص الصلاحيات (Roles)
  // إذا كانت الصفحة تطلب "admin" واليوزر الحالي (سواء موظف أو مشترك) دوره مش أدمن
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    toast.error(t("no_permission") || "ليس لديك صلاحية");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;