
import React from 'react';

export const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications] = React.useState([
    { id: 1, type: 'alert', text: '⚠️ توثيقك ينتهي بعد ١٥ يوم! جدد فوراً علشان ما تتوقفش عن الشغل.', time: 'منذ دقيقتين' },
    { id: 2, type: 'danger', text: '🚨 توثيقك ينتهي بعد أسبوع! لو ما جددتش هنوقف حسابك.', time: 'منذ ساعة' },
    { id: 3, type: 'warning', text: '⚠️ تحذير: تم رصد محاولة مخالفة (مشاركة رقم هاتف). هذا تحذيرك الأول.', time: 'منذ ٣ ساعات' },
    { id: 4, type: 'danger', text: '🚫 تم إيقاف حسابك لمدة ٧ أيام. السبب: بلاغ جدي من عميل.', time: 'منذ يوم' }
  ]);

  const getNotifStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-blue-50 border-blue-500 text-blue-900';
      case 'warning': return 'bg-orange-50 border-orange-500 text-orange-900';
      case 'alert': return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      case 'danger': return 'bg-red-50 border-red-500 text-red-900';
      default: return 'bg-slate-50 border-slate-500 text-slate-900';
    }
  };

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
      <div className="relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="text-slate-700 relative hover:bg-slate-50 p-2 rounded-full transition-colors active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white"></span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute left-0 mt-4 w-80 bg-white rounded-[32px] shadow-2xl border-2 border-slate-50 p-5 animate-in slide-in-from-top-2 duration-300 z-[60] max-h-[80vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                <span className="font-black text-slate-900 text-lg">التنبيهات</span>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 text-sm font-black">مسح الكل</button>
             </div>
             <div className="space-y-4">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-4 rounded-2xl border-r-8 shadow-sm ${getNotifStyles(n.type)}`}>
                    <p className="text-xs font-black leading-relaxed">{n.text}</p>
                    <span className="text-[9px] opacity-60 font-black mt-2 block uppercase">{n.time}</span>
                  </div>
                ))}
             </div>
             <button className="w-full mt-6 py-3 text-[#1E3A8A] font-black text-xs border-t border-slate-50">عرض سجل التنبيهات الكامل</button>
          </div>
        )}
      </div>
    </header>
  );
};
