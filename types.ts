
export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export type VerificationStatus = 
  | 'PENDING' 
  | 'DOCUMENTS_UPLOADED' 
  | 'UNDER_REVIEW' 
  | 'INTERVIEW_SCHEDULED' 
  | 'INTERVIEW_COMPLETED' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'SUSPENDED'
  | 'EXPIRED';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar: string;
  walletBalance: number;
}

export interface VerificationDetails {
  idNumber: string;
  fullNameOnId: string;
  birthDate: string;
  expiryDate: string;
  images: {
    front: string;
    back: string;
    selfie: string;
  };
  faceMatchScore?: number;
}

export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';

export interface InterviewDetails {
  id: string;
  date: string;
  time: string;
  type: 'video' | 'office';
  status: InterviewStatus;
  meetingLink?: string;
  interviewerName?: string;
  assessment?: {
    communication: number; // 1-5
    expertise: number; // 1-5
    professionalism: number; // 1-5
    notes: string;
  };
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
  verificationStatus: VerificationStatus;
  verificationExpiryDate?: string;
  verificationDetails?: VerificationDetails;
  interview?: InterviewDetails;
  location: {
    lat: number;
    lng: number;
  };
  rejectionReason?: string;
}

export enum JobStatus {
  PENDING = 'PENDING',
  INTERVIEWING = 'INTERVIEWING',
  ESTIMATE_PROVIDED = 'ESTIMATE_PROVIDED',
  DEPOSIT_PAID = 'DEPOSIT_PAID',
  ARRIVED = 'ARRIVED',
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
  penaltyApplied?: number;
  cancelledBy?: UserRole;
}
