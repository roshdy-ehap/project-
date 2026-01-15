
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md px-5 py-4 sticky top-0 z-50 flex items-center justify-between border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#1E3A8A] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
          ص
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">صنايعي</h1>
      </div>
      <button className="text-slate-700 relative hover:bg-slate-50 p-2 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white"></span>
      </button>
    </header>
  );
};
