
import React, { useState } from 'react';
import { Category } from '../App';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onCategorySelect: (catId: string) => void;
  categories: Category[];
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onCategorySelect, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches] = useState(['سباك شاطر', 'تركيب تكييف', 'نقاش رخيص']);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onCategorySelect(searchTerm);
    }
  };

  return (
    <div className="p-6 space-y-10 bg-[#F8FAFC] min-h-full pb-20">
      {/* Search Bar */}
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-3xl shadow-lg border-2 border-slate-100 flex items-center gap-4 px-6 focus-within:border-[#1E3A8A] transition-all">
          <button type="submit" className="text-slate-400 text-2xl hover:text-[#1E3A8A] transition-colors">🔍</button>
          <input 
            type="text" 
            placeholder="إيه الخدمة اللي محتاجها؟" 
            className="flex-1 py-1 bg-transparent outline-none text-xl font-bold text-slate-900 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
           {recentSearches.map((s, i) => (
             <button key={i} onClick={() => onCategorySelect(s)} className="shrink-0 bg-white px-4 py-2 rounded-full border border-slate-100 text-xs font-black text-slate-500 shadow-sm active:scale-95 transition-all">
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#1E3A8A] rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4 leading-tight">بيتك فـي أيدي أمينة</h2>
          <p className="text-blue-50 text-xl mb-8 font-bold leading-relaxed opacity-95">اطلب صنايعي موثوق بضمان "صنايعي"، وادفع بأمان داخل التطبيق.</p>
          <button 
            onClick={() => onNavigate('explore')}
            className="bg-[#F97316] text-white px-12 py-5 rounded-3xl font-black text-2xl shadow-2xl active:scale-95 transition-all hover:bg-orange-600 border-b-8 border-orange-800"
          >
            اطلب دلوقتي
          </button>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10 text-[160px] group-hover:scale-110 transition-transform -mr-10 -mt-10">🛠️</div>
      </div>

      {/* Special Offers Horizontal Scroll */}
      <section>
        <h3 className="text-2xl font-black text-slate-900 mb-6 px-2 flex items-center gap-2">
          <span>🎁</span> عروض حصرية
        </h3>
        <div className="flex gap-6 overflow-x-auto pb-4 px-2 scrollbar-hide">
          <div className="shrink-0 w-72 bg-gradient-to-br from-orange-400 to-orange-600 p-6 rounded-[32px] text-white shadow-lg flex flex-col justify-between">
            <h4 className="font-black text-2xl">خصم ٣٠٪</h4>
            <p className="text-sm font-bold opacity-90 mt-2">على أول خدمة سباكة تطلبها النهاردة.</p>
            <button onClick={() => onCategorySelect('سباكة')} className="mt-4 bg-white text-orange-600 py-3 rounded-2xl font-black text-sm shadow-md active:scale-95 transition-all">احجز دلوقتي</button>
          </div>
          <div className="shrink-0 w-72 bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-[32px] text-white shadow-lg flex flex-col justify-between">
            <h4 className="font-black text-2xl">كشف مجاني</h4>
            <p className="text-sm font-bold opacity-90 mt-2">على أجهزة التكييف قبل دخول الصيف.</p>
            <button onClick={() => onCategorySelect('تكييف')} className="mt-4 bg-white text-blue-700 py-3 rounded-2xl font-black text-sm shadow-md active:scale-95 transition-all">احجز دلوقتي</button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex justify-between items-end mb-8 px-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">الأقسام</h3>
          <button 
            onClick={() => onNavigate('explore')}
            className="text-[#1E3A8A] text-lg font-black border-b-4 border-blue-50 pb-1 active:scale-90 transition-all"
          >
            عرض الكل
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.name)}
              className="group flex flex-col items-center gap-4 p-8 bg-white rounded-[40px] shadow-md border-2 border-slate-50 active:scale-95 transition-all hover:shadow-xl hover:border-[#1E3A8A]"
            >
              <div className={`w-20 h-20 ${cat.color} rounded-[30px] flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white p-8 rounded-[48px] border-2 border-slate-100 shadow-xl space-y-8 mb-10">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <span className="text-blue-600 text-3xl">🛡️</span> ليه تختار "صنايعي"؟
        </h3>
        <div className="space-y-8">
          <div className="flex items-start gap-6 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-3xl shadow-sm shrink-0 font-black group-hover:rotate-12 transition-transform">💵</div>
            <div>
              <p className="font-black text-slate-900 text-xl mb-2">ضمان أمان فلوسك</p>
              <p className="text-lg text-slate-700 font-bold leading-relaxed">المبلغ بيتحجز عندنا، ومش بيوصل للصنايعي إلا لما تأكد إن الشغل خلص تمام.</p>
            </div>
          </div>
          <div className="flex items-start gap-6 group">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-800 flex items-center justify-center text-3xl shadow-sm shrink-0 font-black group-hover:rotate-12 transition-transform">✅</div>
            <div>
              <p className="font-black text-slate-900 text-xl mb-2">فنيين معتمدين</p>
              <p className="text-lg text-slate-700 font-bold leading-relaxed">كل فني بيتم مراجعته وتوثيق هويته ببطاقة الرقم القومي لضمان أمان بيتك.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 text-center">
        <p className="text-lg text-slate-300 font-black">صنايعي - صنع في مصر بكل فخر 🇪🇬</p>
      </div>
    </div>
  );
};
