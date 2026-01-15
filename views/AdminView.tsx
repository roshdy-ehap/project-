
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
  const [stats] = useState({
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

  // منطق الترتيب الجديد
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

  // توليد بيانات أداء مستقرة بناءً على الـ ID لضمان عدم تغير الأرقام عند الترتيب
  const providerPerformanceData = useMemo(() => {
    const providers = users
      .filter(u => u.role === 'PROVIDER')
      .map(u => {
        const p = u as unknown as Provider;
        // استخدام طول الاسم أو الـ ID لتوليد أرقام ثابتة للمحاكاة
        const seed = u.id.length + u.name.length;
        return {
          ...p,
          completedJobs: p.completedJobs || (seed * 7) % 100 + 5,
          ratingAvg: p.rating?.average || ((seed * 3) % 20 / 10 + 3).toFixed(1),
          cancellationRate: (seed * 11) % 20, // نسبة مئوية ثابتة
          responseTime: (seed * 13) % 45 + 5, // بالدقائق ثابتة
        };
      });

    return providers.sort((a, b) => {
      let valA: number;
      let valB: number;

      if (sortConfig.key === 'rating') {
        valA = Number(a.ratingAvg);
        valB = Number(b.ratingAvg);
      } else {
        valA = Number(a[sortConfig.key as keyof typeof a]);
        valB = Number(b[sortConfig.key as keyof typeof b]);
      }

      if (sortConfig.order === 'asc') {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });
  }, [users, sortConfig]);

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
        <span className="bg-red-100 text-red-700 text-sm font-black px-4 py-2 rounded-full animate-pulse shadow-sm">
          {stats.activeDisputes} نزاعات جارية
        </span>
      </div>

      {/* Revenue Card */}
      <section className="bg-slate-900 text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-400 text-lg font-bold mb-2">أرباح المنصة القابلة للسحب</p>
          <p className="text-5xl font-black mb-8">{stats.platformRevenue.toLocaleString()} ج.م</p>
          <button className="w-full bg-green-500 text-white py-5 rounded-[28px] font-black text-2xl shadow-xl shadow-green-900/40 active:scale-95 transition-all">
            سحب الأرباح للبنك 💸
          </button>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24"></div>
      </section>

      {/* Improved: Provider Performance Analytics Section */}
      <section className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-blue-50 space-y-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <span>📈</span> جدول أداء الفنيين
          </h3>
          <p className="text-xs text-slate-400 font-bold mb-2">اضغط على المعيار للترتيب (تصاعدي/تنازلي)</p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'completedJobs', label: 'العمليات' },
              { id: 'rating', label: 'التقييم' },
              { id: 'cancellationRate', label: 'الإلغاء' },
              { id: 'responseTime', label: 'سرعة الرد' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => handleSort(item.id as SortKey)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${sortConfig.key === item.id ? 'bg-[#1E3A8A] text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}
              >
                {item.label}
                {sortConfig.key === item.id && (
                  <span>{sortConfig.order === 'desc' ? '↓' : '↑'}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {providerPerformanceData.map((provider) => (
            <div key={provider.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4">
                <img src={provider.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white" />
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-lg">{provider.name}</h4>
                  <p className="text-xs text-slate-400 font-bold tracking-wider" dir="ltr">{provider.phone}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-orange-500">
                    <span className="font-black">{provider.ratingAvg}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">متوسط التقييم</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-2xl border text-center transition-all ${sortConfig.key === 'completedJobs' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
                  <p className="text-[10px] text-slate-400 font-black mb-1">العمليات</p>
                  <p className="text-lg font-black text-[#1E3A8A]">{provider.completedJobs}</p>
                </div>
                <div className={`p-3 rounded-2xl border text-center transition-all ${sortConfig.key === 'cancellationRate' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
                  <p className="text-[10px] text-slate-400 font-black mb-1">الإلغاء</p>
                  <p className={`text-lg font-black ${provider.cancellationRate > 10 ? 'text-red-500' : 'text-green-600'}`}>
                    {provider.cancellationRate}%
                  </p>
                </div>
                <div className={`p-3 rounded-2xl border text-center transition-all ${sortConfig.key === 'responseTime' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
                  <p className="text-[10px] text-slate-400 font-black mb-1">الرد (د)</p>
                  <p className="text-lg font-black text-slate-700">{provider.responseTime}</p>
                </div>
              </div>
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

      {/* Admin Logins Record */}
      <section className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-indigo-50 space-y-6">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <span>📝</span> سجل دخول المديرين
        </h3>
        <p className="text-sm text-slate-500 font-bold mb-4">هنا تظهر قائمة بكل مرة تم فيها استخدام الكود السري للدخول كمدير.</p>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {adminLogs.map(log => (
            <div key={log.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-black text-indigo-700 text-sm">{log.action}</span>
                <span className="text-[10px] text-slate-400 font-bold">{log.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 font-bold">{log.details}</p>
            </div>
          ))}
          {adminLogs.length === 0 && (
            <p className="text-center py-4 text-slate-400 font-bold">لا توجد سجلات دخول بعد</p>
          )}
        </div>
      </section>

      {/* User Management */}
      <section className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-slate-100 space-y-8">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <span>👥</span> المستخدمين المسجلين ({users.length})
        </h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {users.map(user => (
            <div key={user.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
              <img src={user.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
              <div className="flex-1">
                <p className="font-black text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500 font-bold" dir="ltr">{user.phone}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${user.role === 'PROVIDER' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                  {user.role === 'PROVIDER' ? 'صنايعي' : 'عميل'}
                </span>
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

      {/* Commission Control */}
      <section className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-slate-100 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <span>⚙️</span> نسبة عمولة التطبيق
          </h3>
          <span className="text-3xl font-black text-[#1E3A8A]">{commission}%</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="50" 
          value={commission} 
          onChange={(e) => setCommission(parseInt(e.target.value))}
          className="w-full h-4 bg-slate-100 rounded-xl appearance-none cursor-pointer accent-[#1E3A8A]"
        />
        <p className="text-sm text-slate-500 font-bold text-center">يتم خصم هذه النسبة من كل فني عند اكتمال الطلب</p>
      </section>
    </div>
  );
};
