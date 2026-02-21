// import { Navigate } from "react-router-dom";
// // import Loading from "./componenet/common/Loading";
// import { useUser } from "../src/components/../context/userContext"
// import toast from "react-hot-toast";
// import { useTranslation } from "react-i18next";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { isAuthenticated, user, loading } = useUser();
//   const { t } = useTranslation();

//   if (loading) return <Loading />;

//   if (!isAuthenticated) return <Navigate to="/" replace />;

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     toast.error(t("no_permission"));

//     return <Navigate to="/products" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import { useUser } from "./context/userContext"; // تأكد من صحة المسار هنا
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useUser();
  const { t } = useTranslation();

  // 1. إذا كان التطبيق لسه بيحمل بيانات اليوزر من الكوكيز
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span className="ml-3">جاري التحميل...</span>
      </div>
    );
  }

  // 2. إذا كان اليوزر مش مسجل دخول
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. إذا كان اليوزر مسجل دخول بس ما عنده صلاحية (الرتبة غلط)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // استخدمنا user?.role للحماية من الـ undefined
    toast.error(t("no_permission") || "ليس لديك صلاحية لدخول هذه الصفحة");
    
    // وجهه لصفحة الأوردر أو الهوم بدلاً من /products إذا لم تكن موجودة
    return <Navigate to="/order" replace />; 
  }

  // 4. إذا كل الأمور تمام، اعرض الصفحة المطلوبة
  return <>{children}</>;
};

export default ProtectedRoute;