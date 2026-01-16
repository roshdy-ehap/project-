
import React, { useState, useMemo } from 'react';
import { Provider, User } from '../types';

const MOCK_PROVIDERS: Provider[] = [
  { 
    id: 'p1', name: 'الأسطى محمد أحمد', phone: '011', role: 'PROVIDER', avatar: 'https://picsum.photos/seed/p1/200', 
    bio: 'خبرة ١٠ سنوات في أعمال تأسيس وصيانة الكهرباء بمدينة نصر.', services: ['كهرباء'], 
    rating: { average: 4.8, count: 127, breakdown: { 5: 98, 4: 22, 3: 5, 2: 1, 1: 1 } },
    completedJobs: 156, hourlyRate: 200, isVerified: true, location: { lat: 30.0444, lng: 31.2357 }, walletBalance: 450 
  },
  { 
    id: 'p2', name: 'الأسطى علي حسن', phone: '012', role: 'PROVIDER', avatar: 'https://picsum.photos/seed/p2/200', 
    bio: 'متخصص في إصلاح التسريبات وتركيب الأدوات الصحية الحديثة.', services: ['سباكة'], 
    rating: { average: 4.5, count: 89, breakdown: { 5: 60, 4: 15, 3: 10, 2: 2, 1: 2 } },
    completedJobs: 89, hourlyRate: 180, isVerified: true, location: { lat: 30.0500, lng: 31.2400 }, walletBalance: 120 
  },
  { 
    id: 'p3', name: 'الأسطى هاني - نجار', phone: '015', role: 'PROVIDER', avatar: 'https://picsum.photos/seed/p3/200', 
    bio: 'فك وتركيب موبيليا وتصليح أبواب وشبابيك بسرعه ودقة.', services: ['نجارة'], 
    rating: { average: 4.9, count: 210, breakdown: { 5: 180, 4: 20, 3: 10, 2: 0, 1: 0 } },
    completedJobs: 210, hourlyRate: 150, isVerified: true, location: { lat: 30.0400, lng: 31.2300 }, walletBalance: 890 
  },
];

interface ExploreViewProps {
  onBook: (provider: Provider) => void;
  currentUser: User;
  initialCategory?: string | null;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onBook, currentUser, initialCategory }) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [filter, setFilter] = useState<string>(initialCategory || '');
  const isProvider = currentUser.role === 'PROVIDER';

  const filteredProviders = useMemo(() => {
    if (!filter) return MOCK_PROVIDERS;
    return MOCK_PROVIDERS.filter(p => p.services.some(s => s.includes(filter)));
  }, [filter]);

  return (
    <div className="h-full flex flex-col relative bg-slate-100 overflow-hidden">
      {/* Header Info */}
      <div className="p-4 absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur shadow-lg rounded-[24px] px-6 py-4 border border-white/50 pointer-events-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl">📍</div>
             <div>
               <h4 className="font-black text-slate-800 text-sm leading-none">{isProvider ? 'وضع الصنايعي' : 'اكتشف الصنايعية'}</h4>
               <p className="text-[10px] text-slate-500 font-bold mt-1">
                 {filter ? `فلترة: ${filter}` : 'ابحث عن أقرب فني لموقعك'}
               </p>
             </div>
           </div>
           {filter && (
             <button 
               onClick={() => setFilter('')}
               className="bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-[10px] font-black active:scale-90"
             >
               مسح الفلتر ×
             </button>
           )}
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 bg-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.google.com/maps/about/images/home/home-maps-icon.svg')] bg-repeat bg-[length:100px]"></div>
        
        {filteredProviders.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProvider(p)}
            className={`absolute pointer-events-auto p-1.5 bg-white rounded-full shadow-2xl border-2 ${isProvider ? 'border-[#F97316]' : 'border-[#1E3A8A]'} hover:scale-110 active:scale-90 transition-all z-20 animate-bounce`}
            style={{ 
              top: `${45 + (p.location.lat - 30.0444) * 1500}%`, 
              left: `${50 + (p.location.lng - 31.2357) * 1500}%` 
            }}
          >
            <div className="relative">
              <img src={p.avatar} alt={p.name} className="w-14 h-14 rounded-full object-cover" />
              <div className={`absolute -bottom-1 -right-1 ${isProvider ? 'bg-[#F97316]' : 'bg-[#1E3A8A]'} text-white w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold`}>
                {isProvider ? '🤝' : '⭐'}
              </div>
            </div>
          </button>
        ))}

        {/* User Location Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-10 h-10 bg-[#1E3A8A]/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-5 h-5 bg-[#1E3A8A] rounded-full border-2 border-white shadow-xl"></div>
          </div>
        </div>
      </div>

      {/* Provider Details Card */}
      {selectedProvider && (
        <div className="absolute bottom-6 left-4 right-4 bg-white rounded-[40px] p-6 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-10 duration-500 z-30">
          <div className="flex items-start gap-5">
            <div className="relative">
              <img src={selectedProvider.avatar} alt="" className="w-24 h-24 rounded-[32px] object-cover shadow-xl border-4 border-white" />
              {selectedProvider.isVerified && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-black text-slate-800 text-xl leading-tight">{selectedProvider.name}</h4>
                <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-2xl font-black text-sm">
                  <span>{selectedProvider.rating.average}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-bold line-clamp-2 leading-relaxed">{selectedProvider.bio}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                 <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-black">⭐ {selectedProvider.rating.count} تقييم</span>
                 <span className="text-[10px] bg-green-50 text-green-600 px-3 py-1 rounded-full font-black">+{selectedProvider.completedJobs} خدمة</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              onClick={() => setSelectedProvider(null)}
              className="px-6 py-4 bg-slate-50 text-slate-400 rounded-3xl font-black text-sm active:scale-95 transition-all"
            >
              إلغاء
            </button>
            <button 
              className={`px-6 py-4 ${isProvider ? 'bg-[#F97316]' : 'bg-[#1E3A8A]'} text-white rounded-3xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2`}
              onClick={() => onBook(selectedProvider)}
            >
              <span>{isProvider ? 'تواصل للتعاون' : 'مقابلة وحجز'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      )}

      {filteredProviders.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none">
          <div className="bg-white/90 backdrop-blur p-8 rounded-[40px] text-center shadow-2xl border-2 border-slate-100 animate-in zoom-in duration-300">
             <span className="text-6xl mb-4 block">🔍</span>
             <h4 className="text-2xl font-black text-slate-900 mb-2">مفيش صنايعية هنا</h4>
             <p className="text-slate-500 font-bold">جرب تبحث في قسم تاني أو تغير مكانك.</p>
          </div>
        </div>
      )}
    </div>
  );
};
