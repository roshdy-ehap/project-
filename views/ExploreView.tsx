
import React, { useState } from 'react';
import { Provider } from '../types';

const MOCK_PROVIDERS: Provider[] = [
  { id: 'p1', name: 'الأسطى محمد - كهربائي', phone: '011', role: 'PROVIDER', avatar: 'https://picsum.photos/seed/p1/200', bio: 'خبرة ١٠ سنوات في أعمال تأسيس وصيانة الكهرباء.', services: ['كهرباء'], rating: 4.8, completedJobs: 124, hourlyRate: 150, isVerified: true, location: { lat: 30.0444, lng: 31.2357 } },
  { id: 'p2', name: 'الأسطى علي - سباك', phone: '012', role: 'PROVIDER', avatar: 'https://picsum.photos/seed/p2/200', bio: 'متخصص في إصلاح التسريبات وتركيب الأدوات الصحية.', services: ['سباكة'], rating: 4.5, completedJobs: 89, hourlyRate: 120, isVerified: true, location: { lat: 30.0500, lng: 31.2400 } },
  { id: 'p3', name: 'الأسطى هاني - نجار', phone: '015', role: 'PROVIDER', avatar: 'https://picsum.photos/seed/p3/200', bio: 'تصميم وتنفيذ غرف وفك وتركيب الموبيليا.', services: ['نجارة'], rating: 4.9, completedJobs: 210, hourlyRate: 200, isVerified: true, location: { lat: 30.0400, lng: 31.2300 } },
];

export const ExploreView: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex flex-col relative">
      {/* Search Bar */}
      <div className="p-4 absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="bg-white shadow-lg rounded-xl flex items-center px-4 py-2 border border-slate-100 pointer-events-auto">
          <svg className="text-slate-400 mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="ابحث عن سباك، كهربائي..."
            className="w-full bg-transparent outline-none text-slate-700 font-bold py-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Mock Map Background */}
      <div className="flex-1 bg-slate-200 relative overflow-hidden flex items-center justify-center">
        <div className="text-slate-400 text-center select-none">
          <p className="text-lg font-bold">خريطة تفاعلية للحي الخاص بك</p>
          <p className="text-sm">(تظهر هنا خريطة جوجل)</p>
        </div>
        
        {/* Mock Map Markers */}
        {MOCK_PROVIDERS.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProvider(p)}
            className="absolute p-2 bg-white rounded-full shadow-xl border-2 border-blue-600 animate-bounce active:scale-90 transition-transform"
            style={{ 
              top: `${40 + (p.location.lat - 30.0444) * 500}%`, 
              left: `${50 + (p.location.lng - 31.2357) * 500}%` 
            }}
          >
            <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full" />
          </button>
        ))}
      </div>

      {/* Provider Preview Card (Popup) */}
      {selectedProvider && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 animate-slide-up animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-3">
            <img src={selectedProvider.avatar} alt="" className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-bold text-slate-800">{selectedProvider.name}</h4>
                <div className="flex items-center gap-1 text-orange-500 font-bold">
                  <span>{selectedProvider.rating}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{selectedProvider.bio}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                  {selectedProvider.completedJobs} طلب مكتمل
                </div>
                <div className="text-blue-600 font-bold text-sm">
                  {selectedProvider.hourlyRate} ج.م / ساعة
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
              onClick={() => setSelectedProvider(null)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold"
            >
              إغلاق
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-200 active:scale-95"
              onClick={() => alert('سيتم التواصل مع الفني للمقابلة وحجز الخدمة')}
            >
              مقابلة وحجز
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
