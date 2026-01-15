
import React, { useState } from 'react';
import { Job, JobStatus, Message } from '../types';

interface BookingsViewProps {
  jobs: Job[];
  updateStatus: (jobId: string, newStatus: JobStatus) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ jobs, updateStatus }) => {
  const [activeChat, setActiveChat] = useState<Job | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const getStatusInfo = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED: return { text: 'تم الانتهاء ✅', style: 'bg-green-100 text-green-900' };
      case JobStatus.DEPOSIT_PAID: return { text: 'جاري العمل 🛠️', style: 'bg-[#1E3A8A] text-white shadow-xl' };
      case JobStatus.INTERVIEWING: return { text: 'مرحلة المعاينة 💬', style: 'bg-purple-100 text-purple-900' };
      case JobStatus.ESTIMATE_PROVIDED: return { text: 'بانتظار موافقتك 💰', style: 'bg-orange-100 text-orange-900 border-4 border-orange-200' };
      case JobStatus.PENDING: return { text: 'بانتظار الصنايعي', style: 'bg-yellow-100 text-yellow-900' };
      default: return { text: 'ملغي', style: 'bg-slate-200 text-slate-700' };
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    if (/\d{8,}/.test(newMessage)) {
      alert('⚠️ تنبيه: ممنوع تبادل أرقام الموبايل في الدردشة. برجاء استخدام التطبيق لضمان حقوقك المالية.');
      return;
    }
    setNewMessage('');
  };

  return (
    <div className="p-6 space-y-8 bg-[#F8FAFC] min-h-full">
      <div className="flex items-center justify-between border-r-[12px] border-[#1E3A8A] pr-5 py-3 bg-white rounded-l-2xl shadow-sm">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">طلباتي الجارية</h2>
        <span className="text-lg bg-slate-100 px-5 py-1.5 rounded-full text-slate-800 font-black border-2 border-slate-200">{jobs.length} طلب</span>
      </div>
      
      {jobs.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[40px] border-4 border-dashed border-slate-200 shadow-inner">
          <div className="text-8xl mb-8 opacity-20">📦</div>
          <p className="font-black text-slate-600 text-2xl">لا توجد طلبات حالية</p>
          <p className="text-xl text-slate-400 mt-4 font-bold">اطلب فني من الخريطة وابدأ الآن!</p>
        </div>
      )}

      {jobs.map(job => {
        const status = getStatusInfo(job.status);
        return (
          <div key={job.id} className="bg-white rounded-[40px] p-8 shadow-xl border-2 border-slate-100 space-y-8 transition-all hover:border-blue-200">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-black px-5 py-2.5 rounded-2xl ${status.style}`}>
                {status.text}
              </span>
              <span className="text-sm text-slate-500 font-black tracking-widest">{job.createdAt}</span>
            </div>
            
            <div className="flex gap-8 items-center">
              <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center text-5xl shadow-inner border-2 border-slate-200">
                 {job.serviceType === 'كهرباء' ? '⚡' : job.serviceType === 'سباكة' ? '🚰' : '🪚'}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-black text-slate-900 text-2xl">{job.serviceType}</h4>
                <p className="text-lg text-slate-700 font-bold line-clamp-2 leading-relaxed opacity-90">{job.description}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t-2 border-slate-50">
              <div className="flex flex-col">
                 <span className="text-sm text-slate-500 font-black mb-2">التكلفة الإجمالية</span>
                 <span className="text-[#1E3A8A] font-black text-3xl">{job.price} <span className="text-lg">ج.م</span></span>
              </div>
              
              <div className="flex gap-4">
                {(job.status === JobStatus.INTERVIEWING || job.status === JobStatus.ESTIMATE_PROVIDED) && (
                  <button 
                    onClick={() => setActiveChat(job)}
                    className="bg-[#1E3A8A] text-white text-lg px-8 py-4 rounded-3xl font-black shadow-2xl active:scale-95 transition-all"
                  >
                    فتح المحادثة
                  </button>
                )}
                {job.status === JobStatus.DEPOSIT_PAID && (
                  <button 
                    onClick={() => updateStatus(job.id, JobStatus.COMPLETED)}
                    className="bg-green-600 text-white text-lg px-8 py-4 rounded-3xl font-black shadow-2xl active:scale-95 transition-all"
                  >
                    تأكيد الاستلام
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Chat / Negotiation - Extra Readable Interface */}
      {activeChat && (
        <div className="fixed inset-0 bg-slate-900/95 z-[100] flex items-end animate-in fade-in duration-300 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto bg-white rounded-t-[60px] p-8 pb-14 space-y-8 animate-in slide-in-from-bottom-full duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[95vh]">
            <div className="flex justify-between items-center border-b-4 border-slate-50 pb-8 shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-100 rounded-[32px] flex items-center justify-center text-5xl shadow-inner border-2 border-blue-200">👷</div>
                <div>
                  <h3 className="font-black text-slate-900 text-2xl">المعاينة والاتفاق</h3>
                  <p className="text-base text-slate-600 font-black mt-2">تواصل مباشر مع الصنايعي</p>
                </div>
              </div>
              <button onClick={() => setActiveChat(null)} className="bg-slate-100 text-slate-600 w-14 h-14 rounded-full flex items-center justify-center font-black text-4xl hover:bg-slate-200 transition-all shadow-sm">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6 p-6 bg-slate-50 rounded-[40px] border-4 border-slate-200 scroll-smooth shadow-inner">
               <div className="bg-orange-50 text-orange-950 text-lg p-6 rounded-[32px] border-4 border-orange-200 leading-relaxed font-bold text-center shadow-sm">
                 🛡️ <span className="font-black text-orange-900">نصيحة أمان:</span> ماتدفعش كاش بره التطبيق لضمان استرداد فلوسك لو حصلت مشكلة.
               </div>

               <div className="bg-white p-6 rounded-[28px] text-xl font-bold shadow-lg w-[90%] float-right border-2 border-slate-100 leading-relaxed text-slate-900">
                 يا فندم، أنا ممكن أجيلك المعاينة النهاردة الساعة ٦ مساءً. هل الموقع في التجمع؟
               </div>
               
               <div className="bg-[#1E3A8A] p-6 rounded-[28px] text-xl font-bold text-white shadow-2xl w-[90%] float-left clear-both mt-4 leading-relaxed">
                 أيوة، العنوان دقيق جداً. مستنيك للمعاينة عشان نحدد السعر النهائي.
               </div>

               {activeChat.status === JobStatus.ESTIMATE_PROVIDED && (
                 <div className="bg-white border-[6px] border-orange-500 p-8 rounded-[48px] w-full float-right space-y-8 clear-both mt-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-500">
                   <div className="flex items-center gap-4">
                     <span className="text-4xl">💰</span>
                     <p className="text-2xl font-black text-slate-900 tracking-tight">عرض السعر النهائي:</p>
                   </div>
                   <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[32px] border-2 border-slate-200">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-600 font-black mb-2">إجمالي التكلفة المتفق عليها</span>
                        <span className="text-4xl font-black text-[#1E3A8A]">320 <span className="text-xl">ج.م</span></span>
                      </div>
                      <div className="bg-green-100 text-green-900 px-5 py-2 rounded-full text-sm font-black border-2 border-green-300 shadow-sm">
                        ضمان 100% ✅
                      </div>
                   </div>
                   <button 
                     onClick={() => {
                       updateStatus(activeChat.id, JobStatus.DEPOSIT_PAID);
                       setActiveChat(null);
                       alert('تم حجز المبلغ بنجاح! الصنايعي هيبدأ شغل دلوقتي.');
                     }}
                     className="w-full bg-[#1E3A8A] text-white py-6 rounded-[32px] font-black text-2xl shadow-2xl active:scale-95 transition-all hover:bg-blue-800 border-b-8 border-blue-900"
                   >
                     موافقة وحجز المبلغ الآمن 🔒
                   </button>
                 </div>
               )}
            </div>

            <div className="relative pt-6 shrink-0">
              <input 
                type="text" 
                placeholder="اكتب رسالتك هنا..."
                className="w-full bg-slate-50 border-4 border-slate-200 rounded-[32px] px-8 py-6 outline-none focus:ring-8 focus:ring-blue-100 text-2xl font-bold text-slate-900 transition-all placeholder:text-slate-400"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                onClick={handleSendMessage}
                className="absolute left-4 top-10 bottom-4 bg-[#1E3A8A] text-white px-10 rounded-2xl font-black text-lg shadow-xl active:scale-90 transition-all hover:bg-blue-800"
              >
                إرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
