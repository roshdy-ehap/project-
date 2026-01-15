
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
  adminCreds: { phone: string; otp: string };
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, adminCreds }) => {
  const [step, setStep] = useState<'role' | 'phone' | 'otp'>('role');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    // استخدام بيانات المدير الديناميكية
    if (phone === adminCreds.phone && otp === adminCreds.otp) {
      onLogin({
        id: 'super-admin',
        name: 'مدير النظام الأعلى',
        phone: phone,
        role: 'ADMIN',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff',
        walletBalance: 99999
      });
      return;
    }

    onLogin({
      id: 'user-' + Math.random().toString(36).substr(2, 9),
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
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-[#1E3A8A] rounded-[48px] shadow-2xl relative overflow-hidden animate-in zoom-in duration-700">
            {/* New Large Brand Logo */}
            <svg viewBox="0 0 24 24" fill="none" className="w-20 h-20 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M14.5 12.5l-5 5" stroke="#F97316" strokeWidth="2.5" />
              <circle cx="14.5" cy="12.5" r="1.2" fill="#F97316" stroke="none" />
              <path d="M9.5 17.5l-1.5 1.5" stroke="#F97316" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">صنايعيتي</h1>
            <p className="text-xl text-[#F97316] font-black tracking-[0.2em] uppercase opacity-90">Sana'eyeti</p>
            <p className="text-2xl text-slate-500 font-bold opacity-80 pt-2">خدماتك المنزلية في أمان</p>
          </div>
        </div>

        {step === 'role' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
             <p className="text-center font-black text-2xl text-slate-800 mb-6">من أنت؟</p>
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
            <button type="button" onClick={() => setStep('role')} className="w-full text-slate-400 font-black">رجوع</button>
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
              <p className="text-lg text-center text-slate-500 mt-6 font-bold">أدخل كود التحقق المرسل لموبايلك</p>
            </div>
            <button className="w-full py-6 bg-[#1E3A8A] text-white rounded-[32px] font-black text-2xl shadow-2xl active:scale-95 transition-all border-b-8 border-blue-900">تأكيد والدخول</button>
            <button type="button" onClick={() => setStep('phone')} className="w-full text-slate-400 font-black">رجوع</button>
          </form>
        )}
      </div>
    </div>
  );
};
