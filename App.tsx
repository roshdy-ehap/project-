
import React, { useState } from 'react';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { BookingsView } from './views/BookingsView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'u1',
    name: 'أحمد علي',
    phone: '01012345678',
    role: 'ADMIN' as UserRole, // Set to ADMIN to show the admin capabilities
    avatar: 'https://picsum.photos/seed/user/200'
  });

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView onNavigate={setActiveTab} />;
      case 'explore': return <ExploreView />;
      case 'bookings': return <BookingsView userId={currentUser?.id || ''} />;
      case 'profile': return <ProfileView user={currentUser} />;
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
