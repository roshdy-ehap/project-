
import React from 'react';

const CATEGORIES = [
  { id: 'plumbing', name: 'سباكة', icon: '🚰', color: 'bg-blue-100 text-blue-600' },
  { id: 'electrical', name: 'كهرباء', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'carpentry', name: 'نجارة', icon: '🪚', color: 'bg-orange-100 text-orange-600' },
  { id: 'painting', name: 'نقاشة', icon: '🎨', color: 'bg-purple-100 text-purple-600' },
  { id: 'ac', name: 'تكييف', icon: '❄️', color: 'bg-cyan-100 text-cyan-600' },
  { id: 'cleaning', name: 'تنظيف', icon: '🧹', color: 'bg-green-100 text-green-600' },
];

export const HomeView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="p-4 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-l from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">محتاج صنايعي؟</h2>
          <p className="text-blue-100 mb-4">اطلب الآن وادفع بأمان داخل التطبيق</p>
          <button 
            onClick={() => onNavigate('explore')}
            className="bg-white text-blue-700 px-6 py-2 rounded-full font-bold shadow-md active:scale-95 transition-transform"
          >
            اكتشف الفنيين حولك
          </button>
        </div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-12 -translate-y-12"></div>
      </div>

      {/* Categories Grid */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">الأقسام</h3>
          <button className="text-blue-600 text-sm font-bold">عرض الكل</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate('explore')}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-slate-100 active:bg-slate-50 transition-colors"
            >
              <div className={`w-12 h-12 ${cat.color} rounded-full flex items-center justify-center text-2xl`}>
                {cat.icon}
              </div>
              <span className="text-sm font-bold text-slate-700">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white p-4 rounded-2xl border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-3">ليه تستخدم صنايعيتي؟</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✅</div>
            <span className="text-sm text-slate-600">هوية موثقة لكل الصنايعية</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">💳</div>
            <span className="text-sm text-slate-600">دفع آمن والمبلغ محفوظ لحين الانتهاء</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">⚖️</div>
            <span className="text-sm text-slate-600">دعم فني وضمان ضد العيوب</span>
          </li>
        </ul>
      </section>
    </div>
  );
};
