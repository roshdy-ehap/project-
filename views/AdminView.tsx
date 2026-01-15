
import React, { useState } from 'react';

interface Stats {
  totalUsers: number;
  activeProviders: number;
  pendingVerifications: number;
  activeDisputes: number;
  platformRevenue: number;
}

export const AdminView: React.FC = () => {
  const [commission, setCommission] = useState(15);
  const [stats] = useState<Stats>({
    totalUsers: 1450,
    activeProviders: 85,
    pendingVerifications: 12,
    activeDisputes: 3,
    platformRevenue: 12450.50
  });

  return (
    <div className="p-4 space-y-6 pb-24 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between border-r-8 border-red-600 pr-4 py-1">
        <h2 className="text-2xl font-black text-slate-800">لوحة التحكم</h2>
        <span className="bg-red-100 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-full animate-pulse shadow-sm">
          {stats.activeDisputes} نزاعات جارية
        </span>
      </div>

      {/* Revenue Card */}
      <section className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-bold mb-1">أرباح المنصة القابلة للسحب</p>
          <p className="text-4xl font-black mb-6">{stats.platformRevenue.toLocaleString()} ج.م</p>
          <button className="w-full bg-green-500 text-white py-4 rounded-[24px] font-black text-lg shadow-xl shadow-green-900/40 active:scale-95 transition-all">
            سحب الأرباح للبنك 💸
          </button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      </section>

      {/* Commission Control */}
      <section className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <span>⚙️</span> نسبة العمولة
          </h3>
          <span className="text-2xl font-black text-[#1E3A8A]">{commission}%</span>
        </div>
        <input 
          type="range" 
          min="5" 
          max="30" 
          value={commission} 
          onChange={(e) => setCommission(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1E3A8A]"
        />
        <p className="text-[10px] text-slate-400 font-bold text-center">العمولة تطبق تلقائياً على كل عملية دفع ناجحة</p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-black mb-1">توثيق معلق</p>
          <p className="text-2xl font-black text-orange-600">{stats.pendingVerifications}</p>
        </div>
        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-black mb-1">الفنيين النشطين</p>
          <p className="text-2xl font-black text-[#1E3A8A]">{stats.activeProviders}</p>
        </div>
      </div>

      {/* Disputed Orders */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-slate-800 px-1">إدارة النزاعات ⚖️</h3>
        <div className="bg-white rounded-[32px] border border-red-100 overflow-hidden shadow-sm">
          <div className="p-4 bg-red-50/50 text-red-700 text-xs font-black flex justify-between items-center">
            <span>طلب #ORD-9902 (سباكة)</span>
            <span className="bg-white px-2 py-1 rounded-lg">عاجل</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-slate-700 leading-relaxed font-bold">
                <span className="text-blue-600">العميل:</span> الفني لم يكمل تركيب الخلاط وطلب مبلغ إضافي خارج التطبيق.
              </p>
              <p className="text-xs text-slate-700 leading-relaxed font-bold">
                <span className="text-orange-600">الفني:</span> الماسورة مكسورة وتحتاج تغيير كامل، وهذا خارج السعر المتفق عليه.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-red-600 text-white py-3 rounded-2xl text-[10px] font-black shadow-lg shadow-red-100">رد المبلغ للعميل</button>
              <button className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-2xl text-[10px] font-black">تحويل للفني</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
