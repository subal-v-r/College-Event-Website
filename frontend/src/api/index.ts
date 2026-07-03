import apiClient from './client';
import { ApiResponse, Event, Speaker, ScheduleItem, Registration, Announcement, DashboardStats } from '../types';

// ── Events ───────────────────────────────────────────────────────────────────
export const eventsApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<ApiResponse<Event[]>>('/events', { params }),
  getById: (id: string) =>
    apiClient.get<ApiResponse<Event>>(`/events/${id}`),
  create: (data: Partial<Event>) =>
    apiClient.post<ApiResponse<Event>>('/events', data),
  update: (id: string, data: Partial<Event>) =>
    apiClient.put<ApiResponse<Event>>(`/events/${id}`, data),
  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/events/${id}`),
};

// ── Speakers ─────────────────────────────────────────────────────────────────
export const speakersApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Speaker[]>>('/speakers'),
  getById: (id: string) =>
    apiClient.get<ApiResponse<Speaker>>(`/speakers/${id}`),
  create: (data: Partial<Speaker>) =>
    apiClient.post<ApiResponse<Speaker>>('/speakers', data),
  update: (id: string, data: Partial<Speaker>) =>
    apiClient.put<ApiResponse<Speaker>>(`/speakers/${id}`, data),
  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/speakers/${id}`),
};

// ── Schedule ─────────────────────────────────────────────────────────────────
export const schedulesApi = {
  getAll: (day?: number) =>
    apiClient.get<ApiResponse<ScheduleItem[]>>('/schedules', { params: day ? { day } : {} }),
  create: (data: Partial<ScheduleItem>) =>
    apiClient.post<ApiResponse<ScheduleItem>>('/schedules', data),
  update: (id: string, data: Partial<ScheduleItem>) =>
    apiClient.put<ApiResponse<ScheduleItem>>(`/schedules/${id}`, data),
  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/schedules/${id}`),
};

// ── Registrations ─────────────────────────────────────────────────────────────
export const registrationsApi = {
  register: (data: { eventId: string; registerNumber: string; department: string; yearOfStudy: number; phone: string; notes?: string }) =>
    apiClient.post<ApiResponse<Registration>>('/registrations', data),
  getMyRegistrations: () =>
    apiClient.get<ApiResponse<Registration[]>>('/registrations/my'),
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<ApiResponse<Registration[]>>('/registrations', { params }),
  cancel: (id: string) =>
    apiClient.patch<ApiResponse<null>>(`/registrations/${id}/cancel`),
};

// ── Announcements ─────────────────────────────────────────────────────────────
export const announcementsApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Announcement[]>>('/announcements'),
  getAllAdmin: () =>
    apiClient.get<ApiResponse<Announcement[]>>('/announcements/admin/all'),
  create: (data: Partial<Announcement>) =>
    apiClient.post<ApiResponse<Announcement>>('/announcements', data),
  update: (id: string, data: Partial<Announcement>) =>
    apiClient.put<ApiResponse<Announcement>>(`/announcements/${id}`, data),
  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/announcements/${id}`),
};

// ── Contact ───────────────────────────────────────────────────────────────────
export const contactApi = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    apiClient.post<ApiResponse<{ id: string }>>('/contact', data),
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<ApiResponse<{ token: string; user: import('../types').User }>>('/auth/login', credentials),
  register: (data: Partial<import('../types').User> & { password: string }) =>
    apiClient.post<ApiResponse<{ token: string; user: import('../types').User }>>('/auth/register', data),
  getMe: () =>
    apiClient.get<ApiResponse<import('../types').User>>('/auth/me'),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
};
