
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md px-5 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 sticky top-0 z-50 flex items-center justify-between border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 bg-[#1E3A8A] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 overflow-hidden">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M14.5 12.5l-5 5" stroke="#F97316" strokeWidth="3" />
            <circle cx="14.5" cy="12.5" r="1.5" fill="#F97316" stroke="none" />
            <path d="M9.5 17.5l-1.5 1.5" stroke="#F97316" strokeWidth="3" />
          </svg>
        </div>
        <div className="flex flex-col -space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">صنايعيتي</h1>
          <span className="text-[10px] text-[#F97316] font-black uppercase tracking-widest">Sana'eyeti</span>
        </div>
      </div>
      <button className="text-slate-700 relative hover:bg-slate-50 p-2 rounded-full transition-colors active:scale-90">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white"></span>
      </button>
    </header>
  );
};
