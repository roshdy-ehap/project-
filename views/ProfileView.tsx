
import React from 'react';
import { User } from '../types';

interface ProfileViewProps {
  user: User | null;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className="p-5 space-y-8 bg-[#F8FAFC] min-h-full">
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="relative">
          <img src={user.avatar} alt="" className="w-28 h-28 rounded-full border-[6px] border-white shadow-2xl object-cover" />
          <button className="absolute bottom-1 right-1 bg-[#1E3A8A] text-white p-2.5 rounded-full shadow-xl border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">{user.name}</h2>
          <p className="text-slate-500 font-black text-base mt-1 tracking-wider" dir="ltr">{user.phone}</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-md border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <p className="text-xs font-black text-slate-400 mb-1">رصيد المحفظة</p>
            <span className="text-3xl font-black">150.00 <span className="text-sm">ج.م</span></span>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">💳</div>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-4 bg-blue-50 text-[#1E3A8A] rounded-2xl font-black text-base shadow-sm active:scale-95 transition-all">
            <span className="text-xl">➕</span> شحن
          </button>
          <button className="flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-base shadow-sm active:scale-95 transition-all">
            <span className="text-xl">💸</span> سحب
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-md border border-slate-100 divide-y divide-slate-50">
        <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4">
            <span className="text-blue-600 text-xl">🛡️</span>
            <span className="font-black text-slate-800 text-lg">الأمان والخصوصية</span>
          </div>
          <span className="text-slate-300 font-black text-xl">←</span>
        </button>
        <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4">
            <span className="text-orange-500 text-xl">💬</span>
            <span className="font-black text-slate-800 text-lg">تحدث مع الدعم</span>
          </div>
          <span className="text-slate-300 font-black text-xl">←</span>
        </button>
        <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-xl">📋</span>
            <span className="font-black text-slate-800 text-lg">الشروط والأحكام</span>
          </div>
          <span className="text-slate-300 font-black text-xl">←</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-6 text-red-600 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <span className="text-xl">🚪</span>
            <span className="font-black text-lg">تسجيل الخروج</span>
          </div>
        </button>
      </div>
      
      <p className="text-center text-sm text-slate-400 font-black py-6">صنايعي - الإصدار 1.0.0 (MVP)</p>
    </div>
  );
};
