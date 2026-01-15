
export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar: string;
}

export interface Provider extends User {
  bio: string;
  services: string[];
  rating: number;
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
  INTERVIEWING = 'INTERVIEWING',
  DEPOSIT_PAID = 'DEPOSIT_PAID',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
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
}
