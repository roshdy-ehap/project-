
import React from 'react';
import { User } from '../types';

export const ProfileView: React.FC<{ user: User | null }> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="relative">
          <img src={user.avatar} alt="" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-500 font-bold">{user.phone}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
          <span className="font-bold text-slate-800">المحفظة</span>
          <span className="text-blue-600 font-bold">150.00 ج.م</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
            <span>➕</span> شحن
          </button>
          <button className="flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm">
            <span>💸</span> سحب
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y">
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">🛡️</span>
            <span className="font-bold text-slate-700">الأمان والخصوصية</span>
          </div>
          <span className="text-slate-300">←</span>
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">💬</span>
            <span className="font-bold text-slate-700">تحدث مع الدعم</span>
          </div>
          <span className="text-slate-300">←</span>
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">📋</span>
            <span className="font-bold text-slate-700">الشروط والأحكام</span>
          </div>
          <span className="text-slate-300">←</span>
        </button>
        <button className="w-full flex items-center justify-between p-4 text-red-600 hover:bg-red-50 transition-colors">
          <div className="flex items-center gap-3">
            <span>🚪</span>
            <span className="font-bold">تسجيل الخروج</span>
          </div>
        </button>
      </div>
      
      <p className="text-center text-xs text-slate-400 py-4">الإصدار 1.0.0 (MVP)</p>
    </div>
  );
};
