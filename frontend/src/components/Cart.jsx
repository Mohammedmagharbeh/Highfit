// import React from 'react';
// import { useCart } from '../context/CartContext';
// import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Cart = () => {
//   const { cart, total, removeFromCart } = useCart();

//   if (cart.products.length === 0) {
//     return (
//       <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
//         <ShoppingBag size={80} className="text-gray-800 mb-6" />
//         <h2 className="text-2xl font-bold italic">سلتك فارغة يا بطل!</h2>
//         <Link to="/menu" className="mt-4 text-orange-500 underline">ابدأ بتجهيز وجبتك</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#050505] text-white p-6 pt-24" dir="rtl">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-black italic mb-10 border-r-4 border-orange-500 pr-4">سلة الوجبات الصحية</h1>
        
//         <div className="space-y-4">
//           {cart.products.map((item) => (
//             <div key={item.productId._id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] flex items-center gap-4">
//               <img src={item.productId.image} className="w-20 h-20 rounded-2xl object-cover" />
//               <div className="flex-1">
//                 <h3 className="font-bold text-lg">{item.productId.name.ar}</h3>
//                 <p className="text-orange-500 font-bold">{item.productId.price} JOD</p>
//                 {item.notes && <p className="text-xs text-gray-500 italic">"{item.notes}"</p>}
//               </div>
//               <div className="flex items-center gap-4">
//                 <span className="bg-white/5 px-4 py-2 rounded-xl font-black text-orange-500">x{item.quantity}</span>
//                 <button onClick={() => removeFromCart(item.productId._id)} className="text-gray-600 hover:text-red-500">
//                   <Trash2 size={20} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-10 bg-[#0a0a0a] p-8 rounded-[3rem] border border-orange-500/20 shadow-2xl">
//           <div className="flex justify-between items-center mb-6">
//             <span className="text-gray-400 font-bold">المجموع الكلي:</span>
//             <span className="text-3xl font-black text-orange-500">{total.toFixed(2)} JOD</span>
//           </div>
//           <Link to="/checkout">
//             <button className="w-full bg-orange-600 text-black py-5 rounded-[2rem] font-black text-xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
//               الانتقال للدفع <ArrowRight size={24} />
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ChevronLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  // حساب المجموع الكلي
  const totalPrice = cart?.products?.reduce((acc, item) => {
    return acc + (item.productId.price * item.quantity);
  }, 0) || 0;

  // دالة لتعديل الكمية (زيادة أو نقصان)
  const updateQuantity = async (mealId, currentQty, delta, notes) => {
    const newQty = delta; // هنا نرسل الفرق أو القيمة الجديدة حسب تصميم الـ API عندك
    // ملاحظة: في الـ Controller اللي عملناه، الـ addToCart بتزيد الكمية
    // إذا نقصنا، بنبعت قيمة سالبة أو بنعدل الـ Controller
    try {
      await addToCart(mealId, delta, notes);
    } catch (err) {
      toast.error("فشل تحديث الكمية");
    }
  };

  if (!cart || cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6" dir="rtl">
        <div className="bg-white/5 p-8 rounded-full mb-6">
          <ShoppingCart size={60} className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">عربتك فارغة</h2>
        <p className="text-gray-500 mb-8 text-center">يبدو أنك لم تضف أي وجبات لذيذة بعد!</p>
        <Link to="/order" className="bg-orange-600 text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2">
          تصفح المنيو <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32" dir="rtl">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-md z-10">
        <button onClick={() => navigate('/order')} className="p-2 bg-white/5 rounded-xl text-gray-400">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black">عربة التسوق ({cart.products.length})</h1>
        <div className="w-10"></div> {/* للموازنة */}
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {cart.products.map((item) => (
          <div key={item.productId._id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] flex items-center gap-4">
            {/* صورة الوجبة */}
            <img 
              src={item.productId.image} 
              alt={item.productId.name.ar} 
              className="w-20 h-20 rounded-2xl object-cover border border-white/10"
            />

            {/* تفاصيل الوجبة */}
            <div className="flex-1">
              <h3 className="font-bold text-lg">{item.productId.name.ar}</h3>
              <p className="text-orange-500 font-black mb-2">{item.productId.price} <small>JOD</small></p>
              
              {/* التحكم بالكمية */}
              <div className="flex items-center gap-4 bg-white/5 w-fit px-3 py-1.5 rounded-xl border border-white/5">
                <button 
                  onClick={() => updateQuantity(item.productId._id, item.quantity, -1, item.notes)}
                  className="text-gray-400 hover:text-white"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold min-w-[20px] text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.productId._id, item.quantity, 1, item.notes)}
                  className="text-orange-500 hover:text-orange-400"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* زر الحذف */}
            <button 
              onClick={() => removeFromCart(item.productId._id)}
              className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* ملخص السعر والطلب */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0c0c0c] border-t border-white/10 p-6 rounded-t-[2.5rem] shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-between items-center text-gray-400">
            <span>المجموع الفرعي</span>
            <span className="text-white font-bold">{totalPrice.toFixed(2)} JOD</span>
          </div>
          <div className="flex justify-between items-center text-xl font-black">
            <span>الإجمالي الإجمالي</span>
            <span className="text-orange-500">{totalPrice.toFixed(2)} JOD</span>
          </div>
          
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-orange-600 hover:bg-orange-500 text-black font-black py-5 rounded-3xl flex items-center justify-center gap-3 text-lg transition-transform active:scale-95 shadow-lg shadow-orange-600/20"
          >
            الانتقال للدفع
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;