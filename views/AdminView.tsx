
import React, { useState } from 'react';

interface Stats {
  totalUsers: number;
  activeProviders: number;
  pendingVerifications: number;
  activeDisputes: number;
  totalRevenue: number;
}

export const AdminView: React.FC = () => {
  const [commission, setCommission] = useState(15);
  const [stats] = useState<Stats>({
    totalUsers: 1450,
    activeProviders: 85,
    pendingVerifications: 12,
    activeDisputes: 3,
    totalRevenue: 45200
  });

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">لوحة تحكم الإدارة</h2>
        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
          تنبيه: {stats.activeDisputes} نزاعات نشطة
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 mb-1">إجمالي الإيرادات</p>
          <p className="text-lg font-bold text-blue-600">{stats.totalRevenue.toLocaleString()} ج.م</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 mb-1">الصنايعية النشطين</p>
          <p className="text-lg font-bold text-slate-800">{stats.activeProviders}</p>
        </div>
      </div>

      {/* Commission Control */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>⚙️</span> إعدادات العمولة
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">نسبة التطبيق الحالية</span>
            <span className="font-bold text-blue-600">{commission}%</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="30" 
            value={commission} 
            onChange={(e) => setCommission(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform">
            حفظ التعديلات
          </button>
        </div>
      </section>

      {/* Pending Verifications */}
      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center justify-between">
          <span>🆔 توثيق الهوية</span>
          <span className="text-xs text-blue-600 font-bold">{stats.pendingVerifications} طلب</span>
        </h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div>
                  <p className="text-sm font-bold text-slate-700">الأسطى محمود سعيد</p>
                  <p className="text-[10px] text-slate-400">سباك • مقدم منذ ساعتين</p>
                </div>
              </div>
              <button className="text-blue-600 text-xs font-bold border border-blue-600 px-3 py-1 rounded-lg">
                مراجعة
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Dispute Management */}
      <section>
        <h3 className="font-bold text-slate-800 mb-3">⚖️ النزاعات الحالية</h3>
        <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
          <div className="p-3 bg-red-50 text-red-700 text-xs font-bold flex justify-between">
            <span>طلب #4492 - سباكة</span>
            <span>بانتظار الإدارة</span>
          </div>
          <div className="p-3 space-y-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>العميل:</strong> السباك لم يكمل تركيب الخلاط وطلب مبلغ إضافي.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>الفني:</strong> الخلاط قديم جداً ويحتاج قطع غيار غير متوفرة.
            </p>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold">رد المبلغ للعميل</button>
              <button className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-xs font-bold">تحويل للفني</button>
            </div>
          </div>
        </div>
      </section>

      {/* Withdraw Profits */}
      <section className="bg-slate-800 text-white p-5 rounded-2xl shadow-xl">
        <h3 className="font-bold mb-1">أرباح المنصة القابلة للسحب</h3>
        <p className="text-2xl font-bold mb-4">12,450.00 ج.م</p>
        <button className="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-transform">
          سحب الأرباح للحساب البنكي
        </button>
      </section>
    </div>
  );
};
