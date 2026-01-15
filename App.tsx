
import React, { useState } from 'react';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { BookingsView } from './views/BookingsView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { LoginView } from './views/LoginView';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { User, UserRole, Job, JobStatus, Provider } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
      status: JobStatus.INTERVIEWING, // يبدأ بمرحلة المقابلة والمعاينة
      price: provider.hourlyRate,
      createdAt: new Date().toLocaleDateString('en-GB'),
      description: `طلب خدمة ${provider.services[0]} من ${provider.name}`,
      messages: [
        { id: 'm1', senderId: 'system', text: 'تم إنشاء الطلب بنجاح. يرجى الاتفاق مع الفني على موعد المعاينة.', timestamp: new Date().toISOString(), isSystem: true }
      ]
    };
    
    // Simulate provider sending an estimate after 2 seconds for demo
    setTimeout(() => {
      setJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: JobStatus.ESTIMATE_PROVIDED } : j));
    }, 5000);

    setJobs([newJob, ...jobs]);
    setActiveTab('bookings');
  };

  const updateJobStatus = (jobId: string, newStatus: JobStatus) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView onNavigate={setActiveTab} />;
      case 'explore': return <ExploreView onBook={handleCreateJob} currentUser={currentUser} />;
      case 'bookings': return <BookingsView jobs={jobs} updateStatus={updateJobStatus} />;
      case 'profile': return <ProfileView user={currentUser} onLogout={handleLogout} />;
      case 'admin': return <AdminView />;
      default: return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative shadow-2xl overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">
        {renderView()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={currentUser?.role === 'ADMIN'} />
    </div>
  );
};

export default App;
