
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'role' | 'phone' | 'otp'>('role');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: 'u' + Math.random().toString(36).substr(2, 9),
      name: role === 'CUSTOMER' ? 'أحمد محمد' : 'الأسطى محمد أحمد',
      phone: phone,
      role: role,
      avatar: `https://picsum.photos/seed/${phone}/200`,
      walletBalance: 0
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#F8FAFC]">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-[#1E3A8A] rounded-[40px] shadow-2xl text-white text-6xl font-black mb-6">
            ص
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">صنايعي</h1>
          <p className="text-2xl text-slate-600 font-bold opacity-80">خدماتك المنزلية في أمان</p>
        </div>

        {step === 'role' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
             <p className="text-center font-black text-2xl text-slate-800 mb-8">من أنت؟</p>
             <button 
               onClick={() => { setRole('CUSTOMER'); setStep('phone'); }}
               className="w-full p-8 bg-white border-4 border-slate-100 rounded-[40px] flex items-center gap-6 hover:border-[#1E3A8A] transition-all shadow-xl group"
             >
               <span className="text-5xl group-hover:scale-110 transition-transform">🏠</span>
               <div className="text-right">
                 <p className="font-black text-2xl text-slate-900 mb-1">صاحب منزل</p>
                 <p className="text-lg text-slate-500 font-bold">أبحث عن فني موثوق</p>
               </div>
             </button>
             <button 
               onClick={() => { setRole('PROVIDER'); setStep('phone'); }}
               className="w-full p-8 bg-white border-4 border-slate-100 rounded-[40px] flex items-center gap-6 hover:border-[#F97316] transition-all shadow-xl group"
             >
               <span className="text-5xl group-hover:scale-110 transition-transform">🛠️</span>
               <div className="text-right">
                 <p className="font-black text-2xl text-slate-900 mb-1">صنايعي / فني</p>
                 <p className="text-lg text-slate-500 font-bold">أبحث عن فرص عمل</p>
               </div>
             </button>
          </div>
        )}

        {step === 'phone' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('otp'); }} className="space-y-10 animate-in slide-in-from-left-6">
            <div className="space-y-4 text-right">
              <label className="text-xl font-black text-slate-900 mr-2">رقم الموبايل</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  className="w-full px-8 py-6 bg-white border-4 border-slate-200 rounded-[32px] focus:ring-8 focus:ring-blue-100 outline-none text-2xl font-black text-left tracking-widest"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black border-r-4 border-slate-100 pr-5 text-2xl">+20</span>
              </div>
            </div>
            <button className="w-full py-6 bg-[#1E3A8A] text-white rounded-[32px] font-black text-2xl shadow-2xl active:scale-95 transition-all border-b-8 border-blue-900">إرسال كود التفعيل</button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerify} className="space-y-10 animate-in slide-in-from-left-6">
            <div className="space-y-4 text-right">
              <label className="text-xl font-black text-slate-900 mr-2">كود التحقق</label>
              <input
                type="text"
                placeholder="0 0 0 0"
                className="w-full px-8 py-8 bg-white border-4 border-slate-200 rounded-[32px] text-center text-4xl font-black tracking-[0.8em] focus:ring-8 focus:ring-blue-100 outline-none shadow-inner"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <p className="text-lg text-center text-slate-500 mt-6 font-bold">جرب الكود <span className="text-[#1E3A8A] font-black underline">1234</span> للدخول</p>
            </div>
            <button className="w-full py-6 bg-[#1E3A8A] text-white rounded-[32px] font-black text-2xl shadow-2xl active:scale-95 transition-all border-b-8 border-blue-900">تأكيد والدخول</button>
          </form>
        )}
      </div>
    </div>
  );
};
