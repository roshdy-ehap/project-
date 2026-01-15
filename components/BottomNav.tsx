
import React from 'react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    )},
    { id: 'explore', label: 'الخريطة', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
    )},
    { id: 'bookings', label: 'طلباتي', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
    )},
    { id: 'profile', label: 'حسابي', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    )}
  ];

  if (isAdmin) {
    tabs.splice(3, 0, { id: 'admin', label: 'الإدارة', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    )});
  }

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t flex justify-around pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 flex-1 py-1 ${activeTab === tab.id ? 'text-[#1E3A8A]' : 'text-slate-400'}`}
        >
          <div className={`${activeTab === tab.id ? 'scale-110' : 'scale-100'} transition-transform`}>
            {tab.icon}
          </div>
          <span className="text-[10px] font-black">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
