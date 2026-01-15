
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          ص
        </div>
        <h1 className="text-xl font-bold text-slate-800">صنايعيتي</h1>
      </div>
      <button className="text-slate-500 relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
    </header>
  );
};
