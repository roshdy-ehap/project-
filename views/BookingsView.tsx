
import React from 'react';
import { Job, JobStatus } from '../types';

const MOCK_JOBS: Job[] = [
  { id: 'j1', customerId: 'u1', providerId: 'p1', serviceType: 'كهرباء', status: JobStatus.DEPOSIT_PAID, price: 350, createdAt: '2024-05-20', description: 'تغيير لوحة المفاتيح الرئيسية' },
  { id: 'j2', customerId: 'u1', providerId: 'p2', serviceType: 'سباكة', status: JobStatus.INTERVIEWING, price: 150, createdAt: '2024-05-22', description: 'إصلاح خلاط المطبخ' },
  { id: 'j3', customerId: 'u1', providerId: 'p3', serviceType: 'نجارة', status: JobStatus.COMPLETED, price: 500, createdAt: '2024-05-15', description: 'فك وتركيب سرير' },
];

export const BookingsView: React.FC<{ userId: string }> = () => {
  const getStatusStyle = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case JobStatus.DEPOSIT_PAID: return 'bg-blue-100 text-blue-700';
      case JobStatus.INTERVIEWING: return 'bg-purple-100 text-purple-700';
      case JobStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case JobStatus.DISPUTED: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED: return 'مكتمل';
      case JobStatus.DEPOSIT_PAID: return 'المال محجوز (تأمين)';
      case JobStatus.INTERVIEWING: return 'مرحلة المقابلة';
      case JobStatus.PENDING: return 'بانتظار الموافقة';
      case JobStatus.DISPUTED: return 'نزاع - تحت المراجعة';
      default: return 'ملغي';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-slate-800 mb-4">طلباتي</h2>
      {MOCK_JOBS.map(job => (
        <div key={job.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">
                {job.serviceType === 'كهرباء' ? '⚡' : job.serviceType === 'سباكة' ? '🚰' : '🪚'}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{job.serviceType}</h4>
                <p className="text-xs text-slate-400">{job.createdAt}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusStyle(job.status)}`}>
              {getStatusText(job.status)}
            </span>
          </div>
          
          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
            {job.description}
          </p>

          <div className="flex justify-between items-center pt-2">
            <div className="font-bold text-slate-700">
              {job.price} ج.م
            </div>
            {job.status === JobStatus.DEPOSIT_PAID && (
              <button 
                className="bg-green-600 text-white text-xs px-4 py-2 rounded-lg font-bold active:scale-95"
                onClick={() => alert('هل تأكد انتهاء الخدمة؟ سيتم تحويل المبلغ للفني.')}
              >
                تأكيد الاستلام
              </button>
            )}
            {job.status === JobStatus.INTERVIEWING && (
              <button 
                className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-bold active:scale-95"
                onClick={() => alert('تواصل مع الفني الآن للمقابلة')}
              >
                بدء المحادثة
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
