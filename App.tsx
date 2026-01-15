
import React, { useState, useEffect } from 'react';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { BookingsView } from './views/BookingsView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { LoginView } from './views/LoginView';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { User, UserRole, Job, JobStatus, Provider } from './types';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [commission, setCommission] = useState(15);
  const [adminCreds, setAdminCreds] = useState({ phone: '01111111111', otp: '0000' });
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([
    { id: 'l1', timestamp: new Date().toLocaleString('ar-EG'), action: 'إنشاء النظام', details: 'تم إعداد بيانات الإدارة الافتراضية' }
  ]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([
    { id: 'u1', name: 'أحمد محمد', phone: '01000000001', role: 'CUSTOMER', avatar: 'https://picsum.photos/seed/u1/200', walletBalance: 150 },
    { id: 'p1', name: 'الأسطى محمد أحمد', phone: '01111111112', role: 'PROVIDER', avatar: 'https://picsum.photos/seed/p1/200', walletBalance: 450 },
  ]);

  const [jobs, setJobs] = useState<Job[]>([
    { 
      id: 'j1', 
      customerId: 'u1', 
      providerId: 'p1', 
      serviceType: 'كهرباء', 
      status: JobStatus.COMPLETED, 
      price: 350, 
      createdAt: '2024-05-15', 
      description: 'تغيير لوحة المفاتيح الرئيسية',
      messages: []
    },
  ]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      const newLog: AdminLog = {
        id: 'log-' + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toLocaleString('ar-EG'),
        action: 'تسجيل دخول مدير',
        details: `دخل المدير برقم: ${user.phone}`
      };
      setAdminLogs(prev => [newLog, ...prev]);
    } else {
      setRegisteredUsers(prev => {
        if (prev.find(u => u.phone === user.phone)) return prev;
        return [user, ...prev];
      });
    }
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleCreateJob = (provider: Provider) => {
    const newJob: Job = {
      id: 'j-' + Math.random().toString(36).substr(2, 5),
      customerId: currentUser?.id || 'u1',
      providerId: provider.id,
      serviceType: provider.services[0],
      status: JobStatus.INTERVIEWING,
      price: provider.hourlyRate,
      createdAt: new Date().toLocaleDateString('en-GB'),
      description: `طلب خدمة ${provider.services[0]} من ${provider.name}`,
      messages: [
        { id: 'm1', senderId: 'system', text: 'تم إنشاء الطلب بنجاح. يرجى الاتفاق مع الفني على موعد المعاينة.', timestamp: new Date().toISOString(), isSystem: true }
      ]
    };
    
    setJobs([newJob, ...jobs]);
    setActiveTab('bookings');
  };

  const updateJobStatus = (jobId: string, newStatus: JobStatus, extraData: Partial<Job> = {}) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, ...extraData, status: newStatus } : j));
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView onNavigate={setActiveTab} categories={categories} />;
      case 'explore': return <ExploreView onBook={handleCreateJob} currentUser={currentUser!} />;
      case 'bookings': return <BookingsView jobs={jobs} updateStatus={updateJobStatus} currentUser={currentUser!} />;
      case 'profile': return <ProfileView user={currentUser} onLogout={handleLogout} />;
      case 'admin': return <AdminView 
        categories={categories} 
        setCategories={setCategories} 
        commission={commission} 
        setCommission={setCommission}
        adminCreds={adminCreds}
        setAdminCreds={setAdminCreds}
        users={registeredUsers}
        adminLogs={adminLogs}
      />;
      default: return <HomeView onNavigate={setActiveTab} categories={categories} />;
    }
  };

  const containerClasses = "flex flex-col h-full w-full bg-slate-50 relative overflow-hidden md:max-w-[420px] md:h-[880px] md:max-h-[95vh] md:rounded-[50px] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] md:border-[12px] md:border-slate-900 shadow-2xl transition-all duration-500 ease-in-out";

  return (
    <div className={containerClasses}>
      {!currentUser ? (
        <LoginView onLogin={handleLogin} adminCreds={adminCreds} />
      ) : (
        <>
          <Header />
          <main className="flex-1 overflow-y-auto pb-24 scroll-smooth overscroll-contain">
            {renderView()}
          </main>
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={currentUser?.role === 'ADMIN'} />
        </>
      )}
    </div>
  );
};

export default App;
