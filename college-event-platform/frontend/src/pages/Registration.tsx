import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { eventsApi, registrationsApi } from '../api';
import { Event } from '../types';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  eventId: z.string().uuid('Please select an event'),
  registerNumber: z.string().min(3, 'Register number required'),
  department: z.string().min(2, 'Department required'),
  yearOfStudy: z.coerce.number().int().min(1).max(6),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const Registration: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    eventsApi.getAll({ limit: '50' }).then(({ data }) => {
      const activeEvents = data.data.filter(
        (e) => new Date() <= new Date(e.registrationDeadline)
      );
      setEvents(activeEvents);
      const preselected = searchParams.get('eventId');
      if (preselected) setValue('eventId', preselected);
    });
  }, [searchParams, setValue]);

  // Pre-fill from user profile
  useEffect(() => {
    if (user?.registerNumber) setValue('registerNumber', user.registerNumber);
    if (user?.department) setValue('department', user.department);
    if (user?.yearOfStudy) setValue('yearOfStudy', user.yearOfStudy);
    if (user?.phone) setValue('phone', user.phone);
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const { data: res } = await registrationsApi.register(data);
      setRegistrationId(res.data.id);
      setSuccess(true);
      toast.success('Registration successful!');
      reset();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 text-center max-w-md"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">Registration Successful!</h2>
          <p className="text-slate-400 mb-2">Your registration has been confirmed.</p>
          <p className="text-xs text-slate-600 mb-8 font-mono">ID: {registrationId}</p>
          <div className="flex flex-col gap-3">
            <Link to="/my-registrations" className="btn-primary">View My Registrations</Link>
            <button onClick={() => setSuccess(false)} className="btn-secondary">Register for Another Event</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="page-header bg-mesh">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/50" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="section-title mb-4">Event Registration</h1>
          <p className="section-subtitle mx-auto">Choose your event and fill in your details to register</p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20">
        {!isAuthenticated && (
          <div className="glass-card p-4 mb-6 border border-amber-500/30 bg-amber-500/10">
            <p className="text-amber-300 text-sm">
              ⚠️ You need to <Link to="/login" className="underline font-semibold">login</Link> or{' '}
              <Link to="/register" className="underline font-semibold">create an account</Link> before registering.
            </p>
          </div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="glass-card p-8 space-y-5"
        >
          <h2 className="font-display font-bold text-xl text-white">Registration Form</h2>

          {/* Event Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Event *</label>
            <select {...register('eventId')} className="input-field bg-dark-700">
              <option value="">-- Select an Event --</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.title} – {e.category.replace('_', ' ')}</option>
              ))}
            </select>
            {errors.eventId && <p className="text-red-400 text-xs mt-1">{errors.eventId.message}</p>}
          </div>

          {/* Register Number */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Register Number *</label>
            <input {...register('registerNumber')} className="input-field" placeholder="e.g. CSE2021001" />
            {errors.registerNumber && <p className="text-red-400 text-xs mt-1">{errors.registerNumber.message}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Department *</label>
            <select {...register('department')} className="input-field bg-dark-700">
              <option value="">-- Select Department --</option>
              {['Computer Science Engineering', 'Electronics & Communication', 'Mechanical Engineering',
                'Civil Engineering', 'Electrical Engineering', 'Information Technology',
                'Chemical Engineering', 'Biomedical Engineering'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Year of Study *</label>
            <select {...register('yearOfStudy')} className="input-field bg-dark-700">
              <option value="">-- Select Year --</option>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
            {errors.yearOfStudy && <p className="text-red-400 text-xs mt-1">{errors.yearOfStudy.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
            <input {...register('phone')} type="tel" className="input-field" placeholder="10-digit mobile number" />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Additional Notes</label>
            <textarea {...register('notes')} rows={3} className="input-field resize-none" placeholder="Any dietary restrictions, accessibility needs, or team names..." />
          </div>

          <button type="submit" disabled={submitting || !isAuthenticated} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registering...
              </span>
            ) : 'Submit Registration →'}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Registration;
