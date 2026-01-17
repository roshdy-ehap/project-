
import React, { useState, useEffect, useRef } from 'react';
// Fix: Removed non-existent QuoteItem member from imports
import { Job, JobStatus, Message, User } from '../types';

interface BookingsViewProps {
  jobs: Job[];
  updateStatus: (jobId: string, newStatus: JobStatus, extraData?: Partial<Job>) => void;
  currentUser: User;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ jobs, updateStatus, currentUser }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [waitingTimer, setWaitingTimer] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeChat = jobs.find(j => j.id === activeChatId) || null;
  const isProvider = currentUser.role === 'PROVIDER';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // مؤقت الانتظار لسيناريوهات الوصول (Edge Case 2)
  useEffect(() => {
    let interval: any;
    if (waitingTimer !== null && waitingTimer > 0) {
      interval = setInterval(() => setWaitingTimer(prev => (prev && prev > 0) ? prev - 1 : 0), 1000);
    }
    return () => clearInterval(interval);
  }, [waitingTimer]);

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED: return { text: 'مكتمل ✅', class: 'bg-green-100 text-green-700' };
      case JobStatus.ARRIVED: return { text: 'الفني وصل 📍', class: 'bg-blue-600 text-white animate-pulse' };
      case JobStatus.IN_PROGRESS: return { text: 'جاري العمل ⚙️', class: 'bg-indigo-600 text-white' };
      case JobStatus.DEPOSIT_PAID: return { text: 'مدفوع 💵', class: 'bg-green-600 text-white' };
      case JobStatus.ESTIMATE_PROVIDED: return { text: 'بانتظار الدفع 💰', class: 'bg-orange-100 text-orange-700 border-2 border-orange-200' };
      case JobStatus.INTERVIEWING: return { text: 'معاينة 💬', class: 'bg-purple-100 text-purple-700' };
      case JobStatus.CANCELLED: return { text: 'ملغي ❌', class: 'bg-red-50 text-red-700' };
      default: return { text: 'معلق ⏳', class: 'bg-slate-100 text-slate-500' };
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    
    // AI Filter: منع مشاركة أرقام الهواتف (سيناريو 6)
    if (/\d{8,}/.test(newMessage)) {
      alert('⛔ حجب: ممنوع مشاركة أرقام الموبايل لضمان حقك وحماية حسابك.');
      return;
    }

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    updateStatus(activeChat.id, activeChat.status, { 
      messages: [...(activeChat.messages || []), userMsg] 
    });
    setNewMessage('');
  };

  const sendQuote = (jobId: string) => {
    const amount = Number(quoteAmount);
    if (!amount || amount <= 0) return;
    updateStatus(jobId, JobStatus.ESTIMATE_PROVIDED, { 
      price: amount,
      messages: [...(jobs.find(j=>j.id===jobId)?.messages||[]), {
        id: 'sys-'+Date.now(), senderId: 'system', text: `أرسل الفني عرض سعر: ${amount} ج.م`, timestamp: new Date().toISOString(), isSystem: true
      }]
    });
    setQuoteAmount('');
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-full pb-32">
      <h2 className="text-3xl font-black text-slate-900 mb-8">إدارة الطلبات</h2>
      
      {jobs.length === 0 && (
        <div className="text-center py-20 opacity-40">
           <span className="text-6xl mb-4 block">📭</span>
           <p className="font-black">لا توجد طلبات جارية حالياً</p>
        </div>
      )}

      {jobs.map(job => (
        <div key={job.id} className="bg-white rounded-[40px] p-8 shadow-xl border-2 border-slate-50 space-y-6 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <span className={`px-5 py-2 rounded-2xl font-black text-xs ${getStatusBadge(job.status).class}`}>
              {getStatusBadge(job.status).text}
            </span>
            <span className="text-slate-400 font-black text-xs">{job.createdAt}</span>
          </div>
          
          <div className="flex gap-4 items-center">
             <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-3xl shadow-sm">🛠️</div>
             <div>
               <h4 className="font-black text-xl text-slate-900">{job.serviceType}</h4>
               <p className="text-sm text-slate-500 font-bold">{job.price} ج.م • بانتظار الاتفاق</p>
             </div>
          </div>

          {/* واجهة الصنايعي للتحكم في الحالة */}
          {isProvider && job.status !== JobStatus.COMPLETED && job.status !== JobStatus.CANCELLED && (
            <div className="pt-4 border-t space-y-4">
              {job.status === JobStatus.INTERVIEWING && (
                <div className="flex gap-2">
                   <input type="number" placeholder="أدخل السعر المتفق عليه" className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold" value={quoteAmount} onChange={e=>setQuoteAmount(e.target.value)} />
                   <button onClick={() => sendQuote(job.id)} className="bg-orange-500 text-white px-6 rounded-2xl font-black shadow-lg shadow-orange-200">إرسال عرض</button>
                </div>
              )}
              {job.status === JobStatus.DEPOSIT_PAID && (
                <button onClick={() => { updateStatus(job.id, JobStatus.ARRIVED); setWaitingTimer(600); }} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl">لقد وصلت للموقع 📍</button>
              )}
              {job.status === JobStatus.ARRIVED && (
                <div className="space-y-3">
                   <button onClick={() => updateStatus(job.id, JobStatus.IN_PROGRESS)} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black">بدء العمل فعلياً 🛠️</button>
                   {waitingTimer === 0 && (
                     <button onClick={() => updateStatus(job.id, JobStatus.CANCELLED, { cancelledBy: 'PROVIDER' })} className="w-full bg-red-100 text-red-600 py-4 rounded-2xl font-black">العميل لم يظهر؟ مغادرة مع رسوم 🏃</button>
                   )}
                </div>
              )}
              {job.status === JobStatus.IN_PROGRESS && (
                <button onClick={() => updateStatus(job.id, JobStatus.COMPLETED)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">تأكيد إنهاء العمل ✅</button>
              )}
            </div>
          )}

          {/* واجهة العميل للدفع والإلغاء */}
          {!isProvider && job.status !== JobStatus.COMPLETED && job.status !== JobStatus.CANCELLED && (
            <div className="pt-4 border-t space-y-4">
               {job.status === JobStatus.ESTIMATE_PROVIDED && (
                 <button onClick={() => updateStatus(job.id, JobStatus.DEPOSIT_PAID)} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black shadow-xl">موافق، ادفع واحجز الموعد 💵</button>
               )}
               {job.status === JobStatus.ARRIVED && (
                 <div className="bg-blue-50 p-4 rounded-3xl border-2 border-blue-100 text-center">
                    <p className="text-blue-800 font-black text-sm">الفني ينتظرك بالخارج! ⌛</p>
                    {waitingTimer !== null && <p className="text-blue-600 font-bold text-xl mt-1">{Math.floor(waitingTimer/60)}:{waitingTimer%60}</p>}
                 </div>
               )}
               <button onClick={() => updateStatus(job.id, JobStatus.CANCELLED)} className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black border-2 border-transparent hover:border-red-100 hover:text-red-500 transition-all">إلغاء الطلب</button>
            </div>
          )}

          <button onClick={() => setActiveChatId(job.id)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black mt-2">فتح الدردشة 💬</button>
        </div>
      ))}

      {/* نافذة الدردشة */}
      {activeChat && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-in slide-in-from-bottom">
           <div className="p-6 bg-[#1E3A8A] text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                 <button onClick={() => setActiveChatId(null)} className="text-2xl font-black">🏢</button>
                 <div>
                    <h3 className="font-black text-lg">دردشة الطلب</h3>
                    <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">{activeChat.serviceType}</p>
                 </div>
              </div>
              <button onClick={() => setActiveChatId(null)} className="text-3xl font-light">&times;</button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
             {activeChat.messages?.map(m => (
               <div key={m.id} className={`max-w-[85%] p-4 rounded-3xl font-bold shadow-sm ${m.isSystem ? 'bg-slate-200 text-slate-600 mx-auto text-center text-xs' : (m.senderId === currentUser.id ? 'bg-[#1E3A8A] text-white mr-auto rounded-tr-none' : 'bg-white border-2 ml-auto rounded-tl-none')}`}>
                 {m.text}
               </div>
             ))}
             <div ref={messagesEndRef} />
           </div>

           <div className="p-4 bg-white border-t flex gap-2">
             <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSendMessage()} placeholder="اكتب رسالة..." className="flex-1 bg-slate-100 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-200 transition-all" />
             <button onClick={handleSendMessage} className="bg-[#1E3A8A] text-white px-8 rounded-2xl font-black shadow-lg">إرسال</button>
           </div>
        </div>
      )}
    </div>
  );
};
