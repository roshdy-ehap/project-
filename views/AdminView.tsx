
import React, { useState, useMemo } from 'react';
import { Category, AdminLog } from '../App';
import { User, Provider, Job, JobStatus, VerificationStatus, InterviewStatus } from '../types';

interface AdminViewProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  commission: number;
  setCommission: (val: number) => void;
  adminCreds: { phone: string; otp: string };
  setAdminCreds: (creds: { phone: string; otp: string }) => void;
  users: (User | Provider)[];
  adminLogs: AdminLog[];
  jobs: Job[];
  onVerificationDecision: (providerId: string, decision: 'VERIFIED' | 'REJECTED', notes: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
  categories, 
  setCategories, 
  commission, 
  setCommission,
  users,
  jobs,
  onVerificationDecision
}) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'interviews' | 'verification' | 'settings'>('kpis');
  const [selectedRequest, setSelectedRequest] = useState<Provider | null>(null);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const pendingRequests = useMemo(() => {
    return users.filter(u => u.role === 'PROVIDER' && (u as Provider).verificationStatus !== 'VERIFIED' && (u as Provider).verificationStatus !== 'REJECTED') as Provider[];
  }, [users]);

  const dailyInterviews = useMemo(() => {
    return users
      .filter(u => u.role === 'PROVIDER' && (u as Provider).interview && (u as Provider).verificationStatus !== 'VERIFIED')
      .map(u => (u as Provider))
      .sort((a, b) => (a.interview?.time || '').localeCompare(b.interview?.time || ''));
  }, [users]);

  const kpis = useMemo(() => {
    const totalJobs = jobs.length;
    const gmv = jobs.filter(j => j.status === JobStatus.COMPLETED).reduce((acc, curr) => acc + curr.price, 0);
    return {
      revenue: gmv * (commission / 100),
      orders: totalJobs,
      providers: users.filter(u => u.role === 'PROVIDER').length,
      pendingVerifications: pendingRequests.length,
      todayInterviews: dailyInterviews.length
    };
  }, [jobs, users, commission, pendingRequests, dailyInterviews]);

  const handleDecision = (status: 'VERIFIED' | 'REJECTED') => {
    if (selectedRequest) {
      onVerificationDecision(selectedRequest.id, status, adminNotes);
      setSelectedRequest(null);
      setIsInterviewing(false);
      setAdminNotes('');
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#F8FAFC] min-h-full pb-32">
      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white p-2 rounded-3xl shadow-sm overflow-x-auto no-scrollbar border border-slate-100 sticky top-0 z-40">
        <button onClick={() => setActiveTab('kpis')} className={`px-5 py-3 rounded-2xl font-black text-[12px] transition-all whitespace-nowrap ${activeTab === 'kpis' ? 'bg-[#1E3A8A] text-white' : 'text-slate-400'}`}>الرئيسية 📈</button>
        <button onClick={() => setActiveTab('interviews')} className={`px-5 py-3 rounded-2xl font-black text-[12px] transition-all whitespace-nowrap ${activeTab === 'interviews' ? 'bg-[#1E3A8A] text-white' : 'text-slate-400'}`}>المقابلات ({kpis.todayInterviews}) 📅</button>
        <button onClick={() => setActiveTab('verification')} className={`px-5 py-3 rounded-2xl font-black text-[12px] transition-all whitespace-nowrap ${activeTab === 'verification' ? 'bg-[#1E3A8A] text-white' : 'text-slate-400'}`}>التوثيق ({kpis.pendingVerifications}) 🛡️</button>
        <button onClick={() => setActiveTab('settings')} className={`px-5 py-3 rounded-2xl font-black text-[12px] transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-[#1E3A8A] text-white' : 'text-slate-400'}`}>الإعدادات ⚙️</button>
      </div>

      {activeTab === 'kpis' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h2 className="text-2xl font-black text-slate-900 border-r-8 border-blue-600 pr-4">لوحة تحكم الإدارة</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#1E3A8A] p-6 rounded-[32px] text-white shadow-xl flex flex-col justify-between h-32">
                <p className="text-[10px] font-black opacity-60 uppercase">الإيرادات</p>
                <p className="text-2xl font-black">{kpis.revenue.toFixed(0)} <span className="text-xs">ج.م</span></p>
             </div>
             <div className="bg-white p-6 rounded-[32px] border-2 border-slate-50 shadow-sm flex flex-col justify-between h-32">
                <p className="text-[10px] font-black text-slate-400 uppercase">مقابلات اليوم</p>
                <p className="text-2xl font-black text-purple-600">{kpis.todayInterviews}</p>
             </div>
             <div className="bg-white p-6 rounded-[32px] border-2 border-slate-50 shadow-sm flex flex-col justify-between h-32">
                <p className="text-[10px] font-black text-slate-400 uppercase">توثيق معلق</p>
                <p className="text-2xl font-black text-orange-600">{kpis.pendingVerifications}</p>
             </div>
             <div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-sm flex flex-col justify-between h-32">
                <p className="text-[10px] font-black text-slate-400 uppercase">إجمالي الفنيين</p>
                <p className="text-2xl font-black">{kpis.providers}</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[40px] border-2 border-slate-50">
            <h3 className="font-black text-slate-800 mb-4">حالة الطلبات (الشهر الحالي)</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>مقابلات مكتملة</span>
                <span>63%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[63%]"></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mt-4">
                <span>معدل قبول الفنيين</span>
                <span>85%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'interviews' && (
        <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900">مقابلات اليوم - الأحد ٢٠ يناير</h2>
            <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-black">٨ مقابلات</span>
          </div>
          <div className="space-y-4">
            {dailyInterviews.map((prov) => (
              <div key={prov.id} className="bg-white p-6 rounded-[32px] border-2 border-slate-50 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden">
                    <img src={prov.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-black text-slate-900">{prov.name}</h4>
                      <span className="text-blue-600 font-black text-sm">{prov.interview?.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-bold">{prov.services[0]} • {prov.location.lat > 30.04 ? 'مدينة نصر' : 'المعادي'}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg font-black">📹 فيديو</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSelectedRequest(prov); setIsInterviewing(true); }}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-2xl font-black text-xs shadow-lg"
                  >
                    ابدأ المقابلة
                  </button>
                  <button className="px-6 py-3 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs">تأجيل</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'verification' && !selectedRequest && (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
          <h2 className="text-2xl font-black text-slate-900">طلبات التوثيق</h2>
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <button 
                key={req.id} 
                onClick={() => setSelectedRequest(req)}
                className="w-full bg-white p-5 rounded-[32px] border-2 border-slate-50 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all text-right"
              >
                <div className="flex items-center gap-4">
                  <img src={req.avatar} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-black text-slate-900">{req.name}</h4>
                    <p className="text-xs text-slate-400 font-bold">{req.services[0]} • خبرة {req.verificationDetails?.birthDate || '٥'} سنوات</p>
                  </div>
                </div>
                <div className="text-left">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${req.verificationStatus === 'INTERVIEW_COMPLETED' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                    {req.verificationStatus === 'INTERVIEW_COMPLETED' ? '🔴 منتظر قرار' : '⏳ معلق'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'verification' && selectedRequest && !isInterviewing && (
        <div className="space-y-8 animate-in slide-in-from-left duration-500 pb-20">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedRequest(null)} className="text-[#1E3A8A] font-black flex items-center gap-2"><span>→</span> رجوع</button>
            <h2 className="text-xl font-black">تفاصيل طلب التوثيق</h2>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 space-y-6">
            <div className="flex items-center gap-6">
              <img src={selectedRequest.avatar} className="w-24 h-24 rounded-[30px] border-4 border-slate-50 shadow-md" />
              <div>
                <h3 className="text-2xl font-black text-slate-900">{selectedRequest.name}</h3>
                <p className="font-bold text-slate-400" dir="ltr">{selectedRequest.phone}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-[10px] font-black">{selectedRequest.services.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-50">
              <div className="space-y-4">
                <h4 className="font-black text-slate-800">🆔 بيانات البطاقة</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div className="bg-slate-50 p-4 rounded-2xl">
                     <p className="text-[10px] font-black text-slate-400 mb-1">الرقم القومي</p>
                     <p className="font-black">{selectedRequest.verificationDetails?.idNumber || '٢٩٥٠١٠١٢٣٤٥٦٧٨'}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl">
                     <p className="text-[10px] font-black text-slate-400 mb-1">تاريخ الانتهاء</p>
                     <p className="font-black text-green-600">✅ سارية</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-slate-800">📸 صور البطاقة والتحقق</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200">
                         <img src="https://picsum.photos/seed/id_f/400/250" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[10px] text-center font-black text-slate-400">الوجه الأمامي</p>
                   </div>
                   <div className="space-y-2">
                      <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200">
                         <img src="https://picsum.photos/seed/id_b/400/250" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[10px] text-center font-black text-slate-400">الوجه الخلفي</p>
                   </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-3xl border-2 border-blue-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-full overflow-hidden border-2 border-blue-200">
                         <img src={selectedRequest.avatar} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-blue-900">مطابقة الوجه بالـ AI</p>
                        <p className="text-[10px] font-bold text-blue-600">نسبة التطابق: ٩٥٪</p>
                      </div>
                   </div>
                   <span className="bg-green-500 text-white p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-slate-800">📅 المقابلة الشخصية</h4>
                <div className="bg-purple-50 p-5 rounded-3xl border-2 border-purple-100 flex items-center justify-between">
                   <div>
                      <p className="text-sm font-black text-purple-900">{selectedRequest.interview?.date} - {selectedRequest.interview?.time}</p>
                      <p className="text-[10px] font-bold text-purple-600">الحالة: تمت في الموعد ✅</p>
                   </div>
                   <button onClick={() => setIsInterviewing(true)} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-[10px] font-black">مراجعة التسجيل</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 space-y-6">
             <h4 className="font-black text-slate-800">📝 ملاحظات الإدارة</h4>
             <textarea 
               placeholder="اكتب ملاحظاتك هنا..." 
               value={adminNotes}
               onChange={(e) => setAdminNotes(e.target.value)}
               className="w-full p-6 bg-slate-50 rounded-[32px] border-2 border-slate-100 font-bold min-h-[120px] outline-none focus:border-blue-200"
             />
             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleDecision('REJECTED')} className="py-5 bg-red-50 text-red-600 rounded-[30px] font-black border-2 border-red-100 active:scale-95 transition-all">رفض الطلب ❌</button>
                <button onClick={() => handleDecision('VERIFIED')} className="py-5 bg-green-600 text-white rounded-[30px] font-black shadow-xl shadow-green-100 active:scale-95 transition-all">قبول وتفعيل ✅</button>
             </div>
          </div>
        </div>
      )}

      {isInterviewing && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col p-6 space-y-6 overflow-y-auto">
           <div className="flex justify-between items-center text-white">
              <h3 className="font-black text-xl">🎥 مقابلة توثيق: {selectedRequest.name}</h3>
              <button onClick={() => setIsInterviewing(false)} className="bg-white/10 p-3 rounded-full text-2xl font-light">&times;</button>
           </div>
           
           <div className="flex-1 min-h-[400px] bg-slate-800 rounded-[40px] relative overflow-hidden flex items-center justify-center border-2 border-white/10 shadow-2xl">
              <img src={selectedRequest.avatar} className="w-full h-full object-cover blur-sm opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-center p-10 text-center">
                 <div className="w-32 h-32 bg-white rounded-full mx-auto border-4 border-blue-500 overflow-hidden shadow-2xl mb-6">
                    <img src={selectedRequest.avatar} className="w-full h-full object-cover" />
                 </div>
                 <h4 className="text-white text-3xl font-black mb-2">{selectedRequest.name}</h4>
                 <div className="flex items-center gap-2 text-blue-400 font-black text-sm">
                    <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                    <span>مباشر | ١٥:٢٣ ⏱️</span>
                 </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                <div className="w-20 h-28 bg-slate-700 rounded-2xl border-2 border-white/20 overflow-hidden shadow-xl">
                   <div className="w-full h-full flex items-center justify-center text-white font-black text-[10px]">أنت 🧔</div>
                </div>
                <div className="flex gap-4">
                   <button className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">🎤</button>
                   <button onClick={() => setIsInterviewing(false)} className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl">📞</button>
                   <button className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">📹</button>
                </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] space-y-6">
              <h4 className="font-black text-slate-900">📋 نموذج التقييم السريع</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-6 h-6 rounded-lg accent-blue-600" />
                    <span className="font-bold text-slate-700">مطابقة الوجه للبطاقة الأصلية</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-6 h-6 rounded-lg accent-blue-600" />
                    <span className="font-bold text-slate-700">البطاقة أصلية وسارية</span>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase">المهارة المهنية</p>
                    <div className="flex gap-2">
                       {[1,2,3,4,5].map(s => <button key={s} className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${s === 4 ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>{s}</button>)}
                    </div>
                 </div>
                 <textarea placeholder="ملاحظات فنية..." className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 font-bold text-sm min-h-[80px]" />
              </div>
              <button onClick={() => setIsInterviewing(false)} className="w-full py-5 bg-[#1E3A8A] text-white rounded-[32px] font-black shadow-xl active:scale-95">حفظ التقييم وإنهاء المقابلة</button>
           </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-10 text-center opacity-40 font-black">إعدادات النظام المتقدمة... ⚙️</div>
      )}
    </div>
  );
};
