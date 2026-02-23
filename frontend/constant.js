import { 
  LayoutDashboard, 
  Dumbbell, 
  ClipboardList, 
  ShoppingCart, 
  UserCircle, 
  LogOut 
} from "lucide-react";

// قمنا بتسميتها NAV_LINKS لتطابق الاستيراد في الهيدر
export const NAV_LINKS = [
  { to: "/", label: "الرئيسية", icon: Dumbbell },
  { to: "/plans", label: "التمارين والتغذية", icon: ClipboardList },
  { to: "/order", label: "الوجبات", icon: ShoppingCart },
  { to: "/cart", label: "السلة", icon: ShoppingCart },
  { to: "/JobsPage", label: "الوظائف", icon: UserCircle },
  { to: "/chef", label: "لوحة الشيف", icon: ClipboardList },
  { to: "/adminjobs", label: "إدارة الوظائف", icon: LayoutDashboard },
];