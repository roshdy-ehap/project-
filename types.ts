
export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar: string;
  walletBalance: number;
}

export interface Provider extends User {
  bio: string;
  services: string[];
  rating: {
    average: number;
    count: number;
    breakdown: Record<number, number>;
  };
  completedJobs: number;
  hourlyRate: number;
  isVerified: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

export enum JobStatus {
  PENDING = 'PENDING',
  INTERVIEWING = 'INTERVIEWING', // مرحلة المقابلة والمعاينة
  ESTIMATE_PROVIDED = 'ESTIMATE_PROVIDED', // تم تقديم عرض سعر نهائي بعد المعاينة
  DEPOSIT_PAID = 'DEPOSIT_PAID', // المبلغ محجوز في النظام (Escrow)
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Job {
  id: string;
  customerId: string;
  providerId: string;
  serviceType: string;
  status: JobStatus;
  price: number;
  createdAt: string;
  description: string;
  messages: Message[];
}
