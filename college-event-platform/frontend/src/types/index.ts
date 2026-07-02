export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'ADMIN';
  department?: string;
  registerNumber?: string;
  yearOfStudy?: number;
  phone?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: EventCategory;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  registrationDeadline: string;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
  prizeFirst?: string;
  prizeSecond?: string;
  prizeThird?: string;
  rules: string[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  _count?: { registrations: number };
}

export type EventCategory =
  | 'HACKATHON'
  | 'CODING'
  | 'PAPER_PRESENTATION'
  | 'PROJECT_EXPO'
  | 'WORKSHOP'
  | 'QUIZ'
  | 'DESIGN'
  | 'ROBOTICS';

export interface Speaker {
  id: string;
  name: string;
  designation: string;
  organization: string;
  bio: string;
  photoUrl?: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  venue: string;
  isKeynote: boolean;
  isActive: boolean;
}

export interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  day: number;
  type: string;
  isBreak: boolean;
  orderIndex: number;
  event?: Pick<Event, 'id' | 'title' | 'category'> | null;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'WAITLISTED';
  registerNumber: string;
  department: string;
  yearOfStudy: number;
  phone: string;
  notes?: string;
  registeredAt: string;
  event?: Pick<Event, 'id' | 'title' | 'category' | 'venue' | 'date' | 'startTime' | 'endTime' | 'imageUrl'>;
  user?: Pick<User, 'firstName' | 'lastName' | 'email'>;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: number;
  isPublished: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  totalSpeakers: number;
  totalAnnouncements: number;
  recentRegistrations: Registration[];
  eventsByCategory: { category: EventCategory; count: number }[];
}
