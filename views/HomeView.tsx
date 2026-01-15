
import React from 'react';
import { Category } from '../App';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  categories: Category[];
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, categories }) => {
  return (
    <div className="p-6 space-y-10 bg-[#F8FAFC] min-h-full">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-slate-200 flex items-center gap-4 px-6">
        <span className="text-slate-600 text-2xl">🔍</span>
        <input 
          type="text" 
          placeholder="إيه الخدمة اللي محتاجها؟" 
          className="flex-1 py-1 bg-transparent outline-none text-xl font-bold text-slate-900 placeholder:text-slate-400" 
        />
      </div>

      {/* Hero Banner */}
      <div className="bg-[#1E3A8A] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4 leading-tight">بيتك فـي أيدي أمينة</h2>
          <p className="text-blue-50 text-xl mb-8 font-bold leading-relaxed opacity-95">اطلب صنايعي موثوق بضمان "صنايعي"، وادفع بأمان داخل التطبيق.</p>
          <button 
            onClick={() => onNavigate('explore')}
            className="bg-[#F97316] text-white px-12 py-4 rounded-2xl font-black text-xl shadow-2xl active:scale-95 transition-all hover:bg-orange-600 border-b-4 border-orange-800"
          >
            اطلب دلوقتي
          </button>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10 text-[120px]">🛠️</div>
      </div>

      {/* Categories Grid */}
      <section>
        <div className="flex justify-between items-end mb-8 px-2">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">الأقسام</h3>
          <button className="text-[#1E3A8A] text-lg font-black border-b-4 border-blue-100 pb-1">عرض الكل</button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate('explore')}
              className="group flex flex-col items-center gap-4 p-6 bg-white rounded-[32px] shadow-md border-2 border-slate-100 active:scale-95 transition-all hover:shadow-xl hover:border-blue-300"
            >
              <div className={`w-20 h-20 ${cat.color} rounded-[28px] flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-xl font-black text-slate-900">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white p-8 rounded-[40px] border-2 border-slate-200 shadow-lg space-y-8">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <span className="text-blue-600 text-3xl">🛡️</span> ليه تختار "صنايعي"؟
        </h3>
        <div className="space-y-8">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-3xl shadow-sm shrink-0 font-black">💵</div>
            <div>
              <p className="font-black text-slate-900 text-xl mb-2">ضمان أمان فلوسك</p>
              <p className="text-lg text-slate-700 font-bold leading-relaxed">المبلغ بيتحجز عندنا، ومش بيوصل للصنايعي إلا لما تأكد إن الشغل خلص تمام.</p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-800 flex items-center justify-center text-3xl shadow-sm shrink-0 font-black">✅</div>
            <div>
              <p className="font-black text-slate-900 text-xl mb-2">فنيين معتمدين</p>
              <p className="text-lg text-slate-700 font-bold leading-relaxed">كل فني بيتم مراجعته وتوثيق هويته ببطاقة الرقم القومي لضمان أمان بيتك.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-12 text-center">
        <p className="text-lg text-slate-400 font-black">صنايعي - الإصدار 1.0.0</p>
      </div>
    </div>
  );
};
