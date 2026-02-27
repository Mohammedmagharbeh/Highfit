// import { 
//   LayoutDashboard, 
//   Dumbbell, 
//   ClipboardList, 
//   ShoppingCart, 
//   UserCircle, 
//   LogOut 
// } from "lucide-react";

// // قمنا بتسميتها NAV_LINKS لتطابق الاستيراد في الهيدر
// export const NAV_LINKS = [
//   { to: "/", label: "الرئيسية", icon: Dumbbell },
//   { to: "/plans", label: "التمارين والتغذية", icon: ClipboardList },
//   { to: "/order", label: "الوجبات", icon: ShoppingCart },
//   { to: "/cart", label: "السلة", icon: ShoppingCart },
//   { to: "/JobsPage", label: "الوظائف", icon: UserCircle },
//   { to: "/chef", label: "لوحة الشيف", icon: ClipboardList },
//   { to: "/adminjobs", label: "إدارة الوظائف", icon: LayoutDashboard },
// ];
import { 
  LayoutDashboard, 
  Dumbbell, 
  ClipboardList, 
  ShoppingCart, 
  UserCircle, 
} from "lucide-react";

export const NAV_LINKS = [
  { to: "/", label: "home", icon: Dumbbell }, // لاحظ الاسم بالإنجليزية ليطابق الـ JSON
  { to: "/plans", label: "plans", icon: ClipboardList },
  { to: "/order", label: "orders", icon: ShoppingCart },
  { to: "/cart", label: "cart", icon: ShoppingCart },
  { to: "/JobsPage", label: "jobs", icon: UserCircle },
  { to: "/chef", label: "chef_dashboard", icon: ClipboardList },
  { to: "/adminjobs", label: "admin_jobs", icon: LayoutDashboard },
];