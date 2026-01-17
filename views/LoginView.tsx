
import React, { useState } from 'react';
import { User, UserRole, VerificationStatus, Provider } from '../types';

interface LoginViewProps {
  onLogin: (user: User | Provider) => void;
  adminCreds: { phone: string; otp: string };
}

type Step = 'role' | 'phone' | 'otp' | 'basic_info' | 'profession' | 'id_upload' | 'interview_schedule' | 'waiting';

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, adminCreds }) => {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  // Provider registration data
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [experience, setExperience] = useState('5 سنوات');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [idImages, setIdImages] = useState({ front: '', back: '', selfie: '' });
  const [interview, setInterview] = useState({ date: '2026-01-20', time: '12:00 م', type: 'video' });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
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

    if (role === 'CUSTOMER') {
      onLogin({
        id: 'user-' + Date.now(),
        name: 'أحمد محمد',
        phone: phone,
        role: 'CUSTOMER',
        avatar: `https://picsum.photos/seed/${phone}/200`,
        walletBalance: 0
      });
    } else {
      setStep('basic_info');
    }
  };

  const finalizeProviderRegistration = () => {
    // Fix: Correctly mapping idImages into the nested verificationDetails property to match Provider type
    const newProvider: Provider = {
      id: 'prov-' + Date.now(),
      name: name,
      phone: phone,
      role: 'PROVIDER',
      avatar: `https://picsum.photos/seed/${phone}/200`,
      walletBalance: 0,
      bio: `فني ${selectedServices.join(', ')} خبير مع ${experience} خبرة.`,
      services: selectedServices,
      rating: { average: 0, count: 0, breakdown: {} },
      completedJobs: 0,
      hourlyRate: 150,
      isVerified: false,
      verificationStatus: 'UNDER_REVIEW',
      verificationDetails: {
        idNumber: '',
        fullNameOnId: name,
        birthDate: age,
        expiryDate: '',
        images: idImages
      },
      interview: interview as any,
      location: { lat: 30.0444, lng: 31.2357 }
    };
    onLogin(newProvider);
  };

  const handleFileUpload = (type: keyof typeof idImages) => {
    // محاكاة رفع صورة
    setTimeout(() => {
      setIdImages(prev => ({ ...prev, [type]: 'uploaded_url_placeholder' }));
      alert('تم رفع الصورة بنجاح ✅');
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#F8FAFC]">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#1E3A8A] rounded-[32px] shadow-2xl relative overflow-hidden animate-in zoom-in duration-700">
            <svg viewBox="0 0 24 24" fill="none" className="w-14 h-14 text-white" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M14.5 12.5l-5 5" stroke="#F97316" strokeWidth="3" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">صنايعيتي</h1>
        </div>

        {step === 'role' && (
          <div className="space-y-4 animate-in fade-in zoom-in">
             <p className="text-center font-black text-xl text-slate-800">سجل دخولك كـ</p>
             <div className="grid grid-cols-1 gap-4">
               <button onClick={() => { setRole('CUSTOMER'); setStep('phone'); }} className="p-6 bg-white border-2 border-slate-100 rounded-[32px] flex items-center gap-4 hover:border-[#1E3A8A] transition-all shadow-lg text-right">
                 <span className="text-4xl">🏠</span>
                 <div><p className="font-black text-lg">صاحب منزل</p><p className="text-xs text-slate-500 font-bold">عايز صنايعي شاطر</p></div>
               </button>
               <button onClick={() => { setRole('PROVIDER'); setStep('phone'); }} className="p-6 bg-white border-2 border-slate-100 rounded-[32px] flex items-center gap-4 hover:border-[#F97316] transition-all shadow-lg text-right">
                 <span className="text-4xl">🛠️</span>
                 <div><p className="font-black text-lg">صنايعي / فني</p><p className="text-xs text-slate-500 font-bold">عايز فرص شغل حقيقية</p></div>
               </button>
             </div>
          </div>
        )}

        {step === 'phone' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('otp'); }} className="space-y-6 animate-in slide-in-from-left">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 mr-2">رقم الموبايل</label>
              <div className="relative">
                <input type="tel" placeholder="01xxxxxxxxx" className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-xl text-left tracking-widest" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">+20</span>
              </div>
            </div>
            <button className="w-full py-4 bg-[#1E3A8A] text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">إرسال كود التفعيل</button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerify} className="space-y-6 animate-in slide-in-from-left">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 mr-2">كود التحقق</label>
              <input type="text" placeholder="0 0 0 0" className="w-full py-5 bg-white border-2 border-slate-200 rounded-2xl text-center text-3xl font-black tracking-[0.5em]" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <button className="w-full py-4 bg-[#1E3A8A] text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">تأكيد والدخول</button>
          </form>
        )}

        {/* مراحل توثيق الصنايعي */}
        {step === 'basic_info' && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-2xl font-black text-slate-900">البيانات الشخصية 👤</h2>
            <div className="space-y-4">
              <input placeholder="الاسم الرباعي" className="w-full p-4 border-2 rounded-2xl font-bold" value={name} onChange={e => setName(e.target.value)} />
              <input placeholder="العمر" type="number" className="w-full p-4 border-2 rounded-2xl font-bold" value={age} onChange={e => setAge(e.target.value)} />
              <button onClick={() => setStep('profession')} className="w-full py-4 bg-[#1E3A8A] text-white rounded-2xl font-black">التالي</button>
            </div>
          </div>
        )}

        {step === 'profession' && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-2xl font-black text-slate-900">تخصصك وخبرتك 🔧</h2>
            <div className="grid grid-cols-2 gap-3">
              {['سباك', 'كهربائي', 'نجار', 'نقاش', 'تكييف'].map(s => (
                <button key={s} onClick={() => setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} 
                  className={`p-4 rounded-2xl font-bold border-2 transition-all ${selectedServices.includes(s) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-slate-100 text-slate-600'}`}>
                  {s}
                </button>
              ))}
            </div>
            <select value={experience} onChange={e => setExperience(e.target.value)} className="w-full p-4 border-2 rounded-2xl font-bold bg-white">
              <option>أقل من سنة</option>
              <option>سنة لـ ٣ سنوات</option>
              <option>٣ لـ ٥ سنوات</option>
              <option>أكثر من ٥ سنوات</option>
            </select>
            <button onClick={() => setStep('id_upload')} className="w-full py-4 bg-[#1E3A8A] text-white rounded-2xl font-black">التالي</button>
          </div>
        )}

        {step === 'id_upload' && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">توثيق الهوية 🆔</h2>
              <p className="text-xs text-red-500 font-bold">خطوة إلزامية لضمان الأمان والقبول في التطبيق.</p>
            </div>
            <div className="space-y-4">
              <div onClick={() => handleFileUpload('front')} className="p-4 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-50">
                <span className="font-bold">البطاقة (أمام)</span>
                <span>{idImages.front ? '✅' : '📷'}</span>
              </div>
              <div onClick={() => handleFileUpload('back')} className="p-4 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-50">
                <span className="font-bold">البطاقة (خلف)</span>
                <span>{idImages.back ? '✅' : '📷'}</span>
              </div>
              <div onClick={() => handleFileUpload('selfie')} className="p-4 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-50">
                <span className="font-bold">سيلفي مع البطاقة</span>
                <span>{idImages.selfie ? '✅' : '📷'}</span>
              </div>
            </div>
            <button 
              disabled={!idImages.front || !idImages.back || !idImages.selfie}
              onClick={() => setStep('interview_schedule')} 
              className={`w-full py-4 rounded-2xl font-black ${(!idImages.front || !idImages.back || !idImages.selfie) ? 'bg-slate-200 text-slate-400' : 'bg-[#1E3A8A] text-white shadow-lg'}`}>
              التالي
            </button>
          </div>
        )}

        {step === 'interview_schedule' && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">موعد المقابلة 👔</h2>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">المقابلة مدتها ١٥ دقيقة للتأكد من خبرتك وشرح قواعد العمل.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 space-y-4">
               <div>
                 <label className="text-[10px] font-black text-blue-600 block mb-1">نوع المقابلة</label>
                 <select className="w-full p-3 rounded-xl border-2 border-white font-bold" value={interview.type} onChange={e => setInterview({...interview, type: e.target.value as any})}>
                   <option value="video">مقابلة فيديو (أونلاين)</option>
                   <option value="office">مقابلة في المقر (شخصية)</option>
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-2">
                 <div>
                   <label className="text-[10px] font-black text-blue-600 block mb-1">التاريخ</label>
                   <input type="date" className="w-full p-3 rounded-xl border-2 border-white font-bold" value={interview.date} onChange={e => setInterview({...interview, date: e.target.value})} />
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-blue-600 block mb-1">الوقت</label>
                   <select className="w-full p-3 rounded-xl border-2 border-white font-bold" value={interview.time} onChange={e => setInterview({...interview, time: e.target.value})}>
                     <option>10:00 ص</option>
                     <option>12:00 م</option>
                     <option>02:00 م</option>
                     <option>05:00 م</option>
                   </select>
                 </div>
               </div>
            </div>
            <button onClick={finalizeProviderRegistration} className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-lg shadow-xl border-b-8 border-green-800">إرسال طلب التوثيق</button>
          </div>
        )}
      </div>
    </div>
  );
};
