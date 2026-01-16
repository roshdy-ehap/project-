
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface ProfileViewProps {
  user: User | null;
  onLogout: () => void;
  onWalletAction: (type: 'deposit' | 'withdraw', amount: number) => void;
}

type SubPage = 'main' | 'security' | 'support' | 'terms' | 'wallet_op';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onWalletAction }) => {
  const [currentPage, setCurrentPage] = useState<SubPage>('main');
  const [walletOpType, setWalletOpType] = useState<'deposit' | 'withdraw' | null>(null);
  const [amountInput, setAmountInput] = useState('');
  
  // نظام الدردشة للدعم
  const [supportMessages, setSupportMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'أهلاً بك في مركز دعم صنايعيتي، كيف يمكننا مساعدتك اليوم؟', sender: 'bot', time: '١٠:٠٠ ص' }
  ]);
  const [supportInput, setSupportInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [supportMessages]);

  if (!user) return null;

  const handleWalletConfirm = () => {
    const val = Number(amountInput);
    if (!val || val <= 0) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }
    if (walletOpType === 'withdraw' && val > user.walletBalance) {
      alert('رصيدك الحالي لا يسمح بهذا المبلغ');
      return;
    }
    onWalletAction(walletOpType!, val);
    setAmountInput('');
    setWalletOpType(null);
    setCurrentPage('main');
  };

  const sendSupportMessage = () => {
    if (!supportInput.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: supportInput,
      sender: 'user',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    setSupportMessages(prev => [...prev, newMsg]);
    setSupportInput('');

    // رد تلقائي محاكي
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'شكراً لتواصلك معنا. تم تحويل استفسارك لقسم المختصين وسنقوم بالرد عليك في خلال دقائق.',
        sender: 'bot',
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setSupportMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  // شاشة العمليات المالية (شحن / سحب)
  if (currentPage === 'wallet_op') {
    return (
      <div className="p-6 space-y-8 bg-[#F8FAFC] min-h-full animate-in slide-in-from-bottom duration-300">
        <button onClick={() => setCurrentPage('main')} className="flex items-center gap-2 text-[#1E3A8A] font-black">
          <span className="text-2xl">→</span> رجوع
        </button>
        <div className="bg-white p-8 rounded-[40px] shadow-2xl border-2 border-slate-50 space-y-8 text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-5xl">
            {walletOpType === 'deposit' ? '💳' : '💸'}
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            {walletOpType === 'deposit' ? 'شحن رصيد المحفظة' : 'سحب رصيد من المحفظة'}
          </h2>
          <div className="space-y-4">
            <p className="text-slate-500 font-bold">أدخل المبلغ المراد {walletOpType === 'deposit' ? 'إيداعه' : 'سحبه'}</p>
            <div className="relative">
              <input 
                type="number" 
                value={amountInput}
                onChange={e => setAmountInput(e.target.value)}
                placeholder="0.00"
                className="w-full text-center text-5xl font-black py-8 bg-slate-50 rounded-[32px] border-4 border-transparent focus:border-blue-400 outline-none transition-all"
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl">ج.م</span>
            </div>
          </div>
          <button 
            onClick={handleWalletConfirm}
            className="w-full bg-[#1E3A8A] text-white py-6 rounded-[32px] font-black text-2xl shadow-xl active:scale-95 transition-all"
          >
            تأكيد العملية
          </button>
        </div>
      </div>
    );
  }

  // شاشة الدعم الفني (شات حقيقي)
  if (currentPage === 'support') {
    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-left duration-300">
        <div className="p-6 bg-[#1E3A8A] text-white flex items-center gap-4 shrink-0 shadow-lg">
          <button onClick={() => setCurrentPage('main')} className="text-3xl font-black">→</button>
          <div>
            <h2 className="text-xl font-black leading-none">فريق الدعم</h2>
            <p className="text-[10px] text-blue-200 font-bold mt-1 uppercase tracking-widest">متاحين ٢٤/٧ لمساعدتك</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {supportMessages.map(msg => (
            <div key={msg.id} className={`max-w-[85%] flex flex-col ${msg.sender === 'user' ? 'mr-auto items-end' : 'ml-auto items-start'}`}>
              <div className={`p-4 rounded-[24px] font-bold text-sm shadow-sm ${msg.sender === 'user' ? 'bg-[#1E3A8A] text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 font-black mt-1 px-2">{msg.time}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t-2 border-slate-100 flex gap-2">
          <input 
            type="text" 
            value={supportInput}
            onChange={e => setSupportInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendSupportMessage()}
            placeholder="اكتب مشكلتك هنا..."
            className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-blue-200 outline-none"
          />
          <button 
            onClick={sendSupportMessage}
            className="bg-[#1E3A8A] text-white px-6 rounded-2xl font-black shadow-md active:scale-90"
          >
            إرسال
          </button>
        </div>
      </div>
    );
  }

  // شاشة الأمان
  if (currentPage === 'security') {
    return (
      <div className="p-6 space-y-8 bg-[#F8FAFC] min-h-full animate-in slide-in-from-left duration-300">
        <button onClick={() => setCurrentPage('main')} className="flex items-center gap-2 text-[#1E3A8A] font-black mb-4">
          <span className="text-2xl">→</span> رجوع
        </button>
        <h2 className="text-3xl font-black text-slate-900">الأمان والخصوصية</h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-[32px] border-2 border-slate-100 space-y-4 shadow-sm">
            <h4 className="font-black text-slate-800">تغيير كود الـ OTP المفضل</h4>
            <p className="text-xs text-slate-400 font-bold">يمكنك تعيين كود دخول ثابت بدلاً من الـ OTP المتغير.</p>
            <input type="password" placeholder="الكود الجديد" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" />
            <button onClick={() => alert('تم الحفظ')} className="w-full bg-[#1E3A8A] text-white py-4 rounded-2xl font-black">حفظ التغييرات</button>
          </div>
        </div>
      </div>
    );
  }

  // شاشة الشروط
  if (currentPage === 'terms') {
    return (
      <div className="p-6 space-y-8 bg-[#F8FAFC] min-h-full animate-in slide-in-from-left duration-300">
        <button onClick={() => setCurrentPage('main')} className="flex items-center gap-2 text-[#1E3A8A] font-black mb-4">
          <span className="text-2xl">→</span> رجوع
        </button>
        <h2 className="text-3xl font-black text-slate-900">الشروط والأحكام</h2>
        <div className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-sm space-y-6 max-h-[70vh] overflow-y-auto">
          <p className="font-bold text-slate-700 leading-relaxed">تطبيق صنايعيتي يضمن حقوقك المالية بالكامل من خلال حجز المبلغ حتى إتمام العمل.</p>
          <p className="font-bold text-slate-700 leading-relaxed">يمنع التعامل الكاش خارج التطبيق لضمان جودة الخدمة والأمان الشخصي.</p>
        </div>
      </div>
    );
  }

  // الصفحة الرئيسية للملف الشخصي
  return (
    <div className="p-5 space-y-8 bg-[#F8FAFC] min-h-full animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="relative">
          <img src={user.avatar} alt="" className="w-28 h-28 rounded-full border-[6px] border-white shadow-2xl object-cover" />
          <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">{user.name}</h2>
          <p className="text-slate-500 font-black text-base mt-1 tracking-wider" dir="ltr">{user.phone}</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-md border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-black text-slate-400 mb-1 uppercase tracking-widest">رصيد المحفظة</p>
            <span className="text-4xl font-black tracking-tight">{user.walletBalance.toLocaleString()} <span className="text-sm font-bold opacity-70">ج.م</span></span>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-3xl shadow-inner relative z-10">💰</div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full"></div>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <button 
            onClick={() => { setWalletOpType('deposit'); setCurrentPage('wallet_op'); }}
            className="flex items-center justify-center gap-2 py-5 bg-blue-50 text-[#1E3A8A] rounded-2xl font-black text-base shadow-sm active:scale-95 transition-all"
          >
            <span>➕</span> شحن
          </button>
          <button 
            onClick={() => { setWalletOpType('withdraw'); setCurrentPage('wallet_op'); }}
            className="flex items-center justify-center gap-2 py-5 bg-slate-50 text-slate-600 rounded-2xl font-black text-base shadow-sm active:scale-95 transition-all"
          >
            <span>💸</span> سحب
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-md border border-slate-100 divide-y divide-slate-50 overflow-hidden">
        <button onClick={() => setCurrentPage('security')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50">
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">🛡️</span>
            <span className="font-black text-slate-800 text-lg">الأمان والخصوصية</span>
          </div>
          <span className="text-slate-300 font-black text-xl">←</span>
        </button>
        <button onClick={() => setCurrentPage('support')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50">
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center text-xl">💬</span>
            <span className="font-black text-slate-800 text-lg">تحدث مع الدعم</span>
          </div>
          <span className="text-slate-300 font-black text-xl">←</span>
        </button>
        <button onClick={() => setCurrentPage('terms')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50">
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center text-xl">📋</span>
            <span className="font-black text-slate-800 text-lg">الشروط والأحكام</span>
          </div>
          <span className="text-slate-300 font-black text-xl">←</span>
        </button>
        <button onClick={onLogout} className="w-full flex items-center justify-between p-6 text-red-600 hover:bg-red-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-xl">🚪</div>
            <span className="font-black text-lg">تسجيل الخروج</span>
          </div>
        </button>
      </div>
      
      <p className="text-center text-xs text-slate-400 font-black py-4">صنايعي - صنع في مصر 🇪🇬</p>
    </div>
  );
};
