
import React, { useState, useEffect } from 'react';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { BookingsView } from './views/BookingsView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { LoginView } from './views/LoginView';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { User, UserRole, Job, JobStatus, Provider, VerificationStatus } from './types';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'plumbing', name: 'سباكة', icon: '🚰', color: 'bg-blue-100 text-blue-900' },
  { id: 'electrical', name: 'كهرباء', icon: '⚡', color: 'bg-yellow-100 text-yellow-900' },
  { id: 'carpentry', name: 'نجارة', icon: '🪚', color: 'bg-orange-100 text-orange-900' },
  { id: 'painting', name: 'نقاشة', icon: '🎨', color: 'bg-purple-100 text-purple-900' },
  { id: 'ac', name: 'تكييف', icon: '❄️', color: 'bg-cyan-100 text-cyan-900' },
  { id: 'cleaning', name: 'تنظيف', icon: '🧹', color: 'bg-green-100 text-green-900' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<User | Provider | null>(null);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [commission, setCommission] = useState(15);
  const [adminCreds, setAdminCreds] = useState({ phone: '01111111111', otp: '0000' });
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([
    { id: 'l1', timestamp: new Date().toLocaleString('ar-EG'), action: 'إنشاء النظام', details: 'تم إعداد بيانات الإدارة الافتراضية' }
  ]);
  
  const [registeredUsers, setRegisteredUsers] = useState<(User | Provider)[]>([
    { id: 'u1', name: 'أحمد محمد (عميل)', phone: '01000000001', role: 'CUSTOMER', avatar: 'https://picsum.photos/seed/u1/200', walletBalance: 2500 },
    { 
      id: 'p1', name: 'الأسطى محمد أحمد', phone: '01111111112', role: 'PROVIDER', avatar: 'https://picsum.photos/seed/p1/200', walletBalance: 450,
      bio: 'فني كهرباء خبرة ١٠ سنوات بمدينة نصر', services: ['كهرباء'], rating: { average: 4.8, count: 127, breakdown: {} },
      completedJobs: 156, hourlyRate: 200, isVerified: true, verificationStatus: 'VERIFIED', location: { lat: 30.0444, lng: 31.2357 }
    }
  ]);

  const [jobs, setJobs] = useState<Job[]>([]);

  const handleLogin = (user: User | Provider) => {
    const existing = registeredUsers.find(u => u.phone === user.phone);
    const userToLogin = existing ? existing : user;
    setCurrentUser(userToLogin);
    if (!existing) {
      setRegisteredUsers(prev => [...prev, userToLogin]);
    }
    setActiveTab('home');
  };

  const handleVerificationDecision = (providerId: string, decision: 'VERIFIED' | 'REJECTED', notes: string) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === providerId) {
        return { 
          ...u, 
          isVerified: decision === 'VERIFIED', 
          verificationStatus: decision,
          rejectionReason: decision === 'REJECTED' ? notes : undefined,
          verificationExpiryDate: decision === 'VERIFIED' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined
        } as Provider;
      }
      return u;
    }));
    
    setAdminLogs(prev => [{
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleString('ar-EG'),
      action: decision === 'VERIFIED' ? 'توثيق صنايعي' : 'رفض توثيق',
      details: `تم اتخاذ قرار ${decision} لـ ${providerId}. ملاحظات: ${notes}`
    }, ...prev]);
  };

  const updateJobStatus = (jobId: string, newStatus: JobStatus, extraData: Partial<Job> = {}) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || !currentUser) return;

    if (newStatus === JobStatus.CANCELLED) {
      if (currentUser.role === 'CUSTOMER') {
        if (job.status === JobStatus.IN_PROGRESS) {
          const penalty = job.price * 0.75;
          applyFinancials(job.providerId, job.customerId, penalty, 0);
          extraData.penaltyApplied = penalty;
          extraData.cancelledBy = 'CUSTOMER';
          alert(`تم خصم ${penalty} ج.م (٧٥٪) رسوم عمل بدأ فعلياً لصالح الفني.`);
        } else if (job.status === JobStatus.ARRIVED) {
          const transportFee = job.price * 0.10;
          applyFinancials(job.providerId, job.customerId, transportFee, 0);
          extraData.penaltyApplied = transportFee;
          extraData.cancelledBy = 'CUSTOMER';
          alert(`تم خصم ${transportFee} ج.م (١٠٪) رسوم تنقل للفني.`);
        }
      } else if (currentUser.role === 'PROVIDER' && job.status === JobStatus.ARRIVED) {
         const waitFee = job.price * 0.50;
         applyFinancials(job.providerId, job.customerId, waitFee, 0);
         extraData.penaltyApplied = waitFee;
         extraData.cancelledBy = 'PROVIDER';
         alert(`تم تحصيل ${waitFee} ج.م (٥٠٪) رسوم انتظار ومغادرة لعدم تواجد العميل.`);
      }
    }

    if (newStatus === JobStatus.COMPLETED && job.status !== JobStatus.COMPLETED) {
      const finalPrice = extraData.price || job.price;
      const netAmount = finalPrice * (1 - commission / 100);
      applyFinancials(job.providerId, job.customerId, netAmount, finalPrice);
    }

    setJobs(jobs.map(j => j.id === jobId ? { ...j, ...extraData, status: newStatus } : j));
  };

  const applyFinancials = (creditId: string, debitId: string, amount: number, totalFromCustomer: number) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === creditId) return { ...u, walletBalance: u.walletBalance + amount };
      if (u.id === debitId) return { ...u, walletBalance: u.walletBalance - (totalFromCustomer || amount) };
      return u;
    }));
    if (currentUser?.id === creditId) setCurrentUser(prev => prev ? {...prev, walletBalance: prev.walletBalance + amount} : null);
    if (currentUser?.id === debitId) setCurrentUser(prev => prev ? {...prev, walletBalance: prev.walletBalance - (totalFromCustomer || amount)} : null);
  };

  const handleWalletAction = (type: 'deposit' | 'withdraw', amount: number) => {
    if (!currentUser) return;
    const newBalance = type === 'deposit' ? currentUser.walletBalance + amount : currentUser.walletBalance - amount;
    if (newBalance < 0) { alert('عفواً، الرصيد غير كافي'); return; }
    const updatedUser = { ...currentUser, walletBalance: newBalance };
    setCurrentUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const renderView = () => {
    if (currentUser?.role === 'PROVIDER' && !(currentUser as Provider).isVerified && activeTab !== 'profile') {
      const prov = currentUser as Provider;
      
      if (prov.verificationStatus === 'REJECTED') {
        return (
          <div className="p-10 space-y-8 flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in duration-500">
             <div className="w-32 h-32 bg-red-50 rounded-[48px] flex items-center justify-center text-6xl shadow-inner border-4 border-red-100">❌</div>
             <h2 className="text-3xl font-black text-slate-900 leading-tight">عذراً، طلبك مرفوض</h2>
             <div className="bg-white p-6 rounded-[32px] border-2 border-slate-50 w-full text-right">
                <p className="font-black text-xs text-slate-400">سبب الرفض:</p>
                <p className="font-bold text-red-600">{prov.rejectionReason || 'البيانات غير كافية.'}</p>
             </div>
             <button onClick={() => setActiveTab('profile')} className="text-slate-400 font-black border-b-2">الملف الشخصي</button>
          </div>
        );
      }

      return (
        <div className="p-8 space-y-8 flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in duration-700">
           <div className="bg-white p-8 rounded-[48px] border-4 border-slate-100 shadow-2xl w-full max-w-sm space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 text-9xl">⏳</div>
             <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner animate-pulse">🟡</div>
                <h2 className="text-2xl font-black text-slate-900">حسابك قيد المراجعة</h2>
                <div className="bg-orange-50 text-orange-700 p-4 rounded-3xl border border-orange-100 text-xs font-black">
                  🔴 منتظر قرار نهائي من الإدارة
                </div>
                <div className="space-y-3 text-right text-xs font-bold text-slate-500">
                   <div className="flex items-center gap-2">✅ صور البطاقة: موثقة</div>
                   <div className="flex items-center gap-2">✅ المقابلة: مكتملة (١٨ يناير)</div>
                   <div className="flex items-center gap-2">⏳ القرار: جاري المراجعة الفنية</div>
                </div>
                <div className="pt-4 border-t border-slate-50 flex gap-2">
                   <button className="flex-1 py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px]">مراجعة المقابلة</button>
                   <button onClick={() => setActiveTab('profile')} className="flex-1 py-3 bg-[#1E3A8A] text-white rounded-2xl font-black text-[10px]">الملف الشخصي</button>
                </div>
             </div>
           </div>
           <p className="text-sm text-slate-400 font-black leading-relaxed">فريقنا بيراجع بياناتك دلوقتي،<br/>هيوصلك إشعار بالقرار النهائي فور صدوره.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'home': return <HomeView onNavigate={setActiveTab} onCategorySelect={cat => { setSelectedCategory(cat); setActiveTab('explore'); }} categories={categories} />;
      case 'explore': return <ExploreView onBook={p => {
        const newJob: Job = {
          id: 'j-' + Date.now(),
          customerId: currentUser?.id || '',
          providerId: p.id,
          serviceType: p.services[0],
          status: JobStatus.INTERVIEWING,
          price: p.hourlyRate,
          createdAt: new Date().toLocaleDateString('en-GB'),
          description: `طلب خدمة ${p.services[0]}`,
          messages: [{ id: 'm1', senderId: 'system', text: 'تم إنشاء الطلب بنجاح. تواصل مع الفني للاتفاق.', timestamp: new Date().toISOString(), isSystem: true }]
        };
        setJobs([newJob, ...jobs]);
        setActiveTab('bookings');
      }} currentUser={currentUser!} initialCategory={selectedCategory} />;
      case 'bookings': return <BookingsView jobs={jobs} updateStatus={updateJobStatus} currentUser={currentUser!} />;
      case 'profile': return <ProfileView user={currentUser} onLogout={() => { setCurrentUser(null); setActiveTab('home'); }} onWalletAction={handleWalletAction} />;
      case 'admin': return <AdminView 
        categories={categories} setCategories={setCategories} commission={commission} setCommission={setCommission}
        adminCreds={adminCreds} setAdminCreds={setAdminCreds} users={registeredUsers} adminLogs={adminLogs} jobs={jobs}
        onVerificationDecision={handleVerificationDecision}
      />;
      default: return <HomeView onNavigate={setActiveTab} onCategorySelect={cat => { setSelectedCategory(cat); setActiveTab('explore'); }} categories={categories} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative overflow-hidden md:max-w-[420px] md:h-[880px] md:max-h-[95vh] md:rounded-[50px] md:shadow-2xl md:border-[12px] md:border-slate-900 transition-all">
      {!currentUser ? <LoginView onLogin={handleLogin} adminCreds={adminCreds} /> : (
        <>
          <Header />
          <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">{renderView()}</main>
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={currentUser?.role === 'ADMIN'} />
        </>
      )}
    </div>
  );
};

export default App;
