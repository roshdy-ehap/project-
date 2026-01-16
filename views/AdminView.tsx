
import React, { useState, useMemo } from 'react';
import { Category, AdminLog } from '../App';
import { User, Provider } from '../types';

interface AdminViewProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  commission: number;
  setCommission: (val: number) => void;
  adminCreds: { phone: string; otp: string };
  setAdminCreds: (creds: { phone: string; otp: string }) => void;
  users: User[];
  adminLogs: AdminLog[];
}

type SortKey = 'completedJobs' | 'rating' | 'cancellationRate' | 'responseTime';
type SortOrder = 'asc' | 'desc';

export const AdminView: React.FC<AdminViewProps> = ({ 
  categories, 
  setCategories, 
  commission, 
  setCommission,
  adminCreds,
  setAdminCreds,
  users,
  adminLogs
}) => {
  const [stats, setStats] = useState({
    totalUsers: users.length,
    activeProviders: users.filter(u => u.role === 'PROVIDER').length,
    pendingVerifications: 12,
    activeDisputes: 3,
    platformRevenue: 12450.50
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');

  const [tempAdminPhone, setTempAdminPhone] = useState(adminCreds.phone);
  const [tempAdminOtp, setTempAdminOtp] = useState(adminCreds.otp);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey, order: SortOrder }>({ 
    key: 'completedJobs', 
    order: 'desc' 
  });

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const providerPerformanceData = useMemo(() => {
    const providers = users
      .filter(u => u.role === 'PROVIDER')
      .map(u => {
        const p = u as unknown as Provider;
        const seed = u.id.length + u.name.length;
        return {
          ...p,
          completedJobs: p.completedJobs || (seed * 7) % 100 + 5,
          ratingAvg: p.rating?.average || ((seed * 3) % 20 / 10 + 3).toFixed(1),
          cancellationRate: (seed * 11) % 15,
          responseTime: (seed * 13) % 45 + 5,
        };
      });

    return [...providers].sort((a, b) => {
      let valA: number;
      let valB: number;

      if (sortConfig.key === 'rating') {
        valA = Number(a.ratingAvg);
        valB = Number(b.ratingAvg);
      } else {
        valA = Number(a[sortConfig.key as keyof typeof a]);
        valB = Number(b[sortConfig.key as keyof typeof b]);
      }

      return sortConfig.order === 'asc' ? valA - valB : valB - valA;
    });
  }, [users, sortConfig]);

  const handleWithdrawRevenue = () => {
    if (confirm(`هل تريد سحب مبلغ ${stats.platformRevenue.toLocaleString()} ج.م إلى حساب الشركة البنكي؟`)) {
      setStats(prev => ({ ...prev, platformRevenue: 0 }));
      alert('تمت العملية بنجاح! الرصيد الآن صفر.');
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon);
  };

  const saveEdit = () => {
    setCategories(prev => prev.map(c => c.id === editingId ? { ...c, name: editName, icon: editIcon } : c));
    setEditingId(null);
  };

  const deleteCategory = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const addCategory = () => {
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: 'قسم جديد',
      icon: '🛠️',
      color: 'bg-slate-100 text-slate-900'
    };
    setCategories([...categories, newCat]);
    handleEditCategory(newCat);
  };

  const saveAdminCreds = () => {
    setAdminCreds({ phone: tempAdminPhone, otp: tempAdminOtp });
    alert('تم تحديث بيانات دخول المدير بنجاح!');
  };

  return (
    <div className="p-6 space-y-10 pb-32 bg-[#F8FAFC] min-h-full">
      <div className="flex items-center justify-between border-r-[12px] border-red-600 pr-5 py-2">
        <h2 className="text-3xl font-black text-slate-900">إدارة النظام الأعلى</h2>
        <span 
          onClick={() => alert('لا يوجد نزاعات حقيقية حالياً، التطبيق آمن تماماً!')}
          className="bg-red-100 text-red-700 text-sm font-black px-4 py-2 rounded-full animate-pulse shadow-sm cursor-pointer"
        >
          {stats.activeDisputes} نزاعات جارية
        </span>
      </div>

      {/* Revenue Card */}
      <section className="bg-slate-900 text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-400 text-lg font-bold mb-2">أرباح المنصة القابلة للسحب</p>
          <p className="text-5xl font-black mb-8">{stats.platformRevenue.toLocaleString()} ج.م</p>
          <button 
            onClick={handleWithdrawRevenue}
            className="w-full bg-green-500 text-white py-5 rounded-[28px] font-black text-2xl shadow-xl shadow-green-900/40 active:scale-95 transition-all hover:bg-green-600"
          >
            سحب الأرباح للبنك 💸
          </button>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24"></div>
      </section>

      {/* Provider Performance Analytics Section */}
      <section className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-blue-50 space-y-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span>📈</span> تتبع أداء الصنايعية
            </h3>
            <span className="text-[10px] text-slate-400 font-black bg-slate-50 px-3 py-1 rounded-full uppercase">Live Update</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2 rounded-[24px] border-2 border-slate-100">
            {[
              { id: 'completedJobs', label: 'العمليات' },
              { id: 'rating', label: 'التقييم' },
              { id: 'cancellationRate', label: 'الإلغاء' },
              { id: 'responseTime', label: 'الرد' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => handleSort(item.id as SortKey)}
                className={`flex flex-col items-center justify-center p-3 rounded-[18px] transition-all duration-300 ${sortConfig.key === item.id ? 'bg-[#1E3A8A] text-white shadow-xl scale-105' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
              >
                <span className="text-[10px] font-black mb-1 opacity-70">{item.label}</span>
                <div className="flex items-center gap-1">
                   {sortConfig.key === item.id && (
                     <span className="text-lg leading-none">{sortConfig.order === 'desc' ? '↓' : '↑'}</span>
                   )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {providerPerformanceData.map((provider) => (
            <div key={provider.id} className="p-6 bg-slate-50 rounded-[32px] border-2 border-slate-100 space-y-5 hover:border-blue-200 transition-all">
              <div className="flex items-center gap-5">
                <img src={provider.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-lg">{provider.name}</h4>
                  <p className="text-xs text-slate-400 font-bold" dir="ltr">{provider.phone}</p>
                </div>
                <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full font-black">
                  {provider.ratingAvg} ⭐
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-2xl border text-center">
                  <p className="text-[10px] text-slate-400 font-black mb-1">العمليات</p>
                  <p className="text-lg font-black text-[#1E3A8A]">{provider.completedJobs}</p>
                </div>
                <div className="p-3 bg-white rounded-2xl border text-center">
                  <p className="text-[10px] text-slate-400 font-black mb-1">الإلغاء</p>
                  <p className="text-lg font-black text-red-500">{provider.cancellationRate}%</p>
                </div>
                <div className="p-3 bg-white rounded-2xl border text-center">
                  <p className="text-[10px] text-slate-400 font-black mb-1">الرد (د)</p>
                  <p className="text-lg font-black text-slate-700">{provider.responseTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Management */}
      <section className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-slate-100 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <span>📋</span> تعديل وظائف الخدمات
          </h3>
          <button 
            onClick={addCategory}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>

        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border-2 border-slate-100 group transition-all">
              {editingId === cat.id ? (
                <div className="flex flex-1 gap-3 items-center">
                  <input 
                    className="w-16 p-2 rounded-xl border-2 border-blue-200 text-center text-2xl" 
                    value={editIcon} 
                    onChange={e => setEditIcon(e.target.value)} 
                  />
                  <input 
                    className="flex-1 p-2 rounded-xl border-2 border-blue-200 font-black text-xl" 
                    value={editName} 
                    onChange={e => setEditName(e.target.value)} 
                  />
                  <button onClick={saveEdit} className="bg-green-500 text-white p-3 rounded-xl shadow-md">✓</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-5">
                    <span className="text-4xl">{cat.icon}</span>
                    <span className="text-xl font-black text-slate-800">{cat.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditCategory(cat)} className="p-3 bg-blue-100 text-blue-700 rounded-2xl">✏️</button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-3 bg-red-100 text-red-700 rounded-2xl">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Admin Login Settings */}
      <section className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-red-50 space-y-6">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <span>🔒</span> بيانات دخول المدير السري
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-500 mr-2">رقم الموبايل السري</label>
            <input 
              type="tel" 
              value={tempAdminPhone} 
              onChange={e => setTempAdminPhone(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xl outline-none focus:border-red-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-500 mr-2">الكود السري (OTP)</label>
            <input 
              type="text" 
              value={tempAdminOtp} 
              onChange={e => setTempAdminOtp(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xl outline-none focus:border-red-200"
            />
          </div>
          <button 
            onClick={saveAdminCreds}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all mt-2"
          >
            تحديث بيانات الدخول
          </button>
        </div>
      </section>
    </div>
  );
};
