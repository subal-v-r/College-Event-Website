import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  department: z.string().optional(),
  registerNumber: z.string().optional(),
  yearOfStudy: z.coerce.number().int().min(1).max(6).optional(),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { authApi } = await import('../api');
      await authApi.register(data as Parameters<typeof authApi.register>[0]);
      await login(data.email, data.password);
      toast.success('Account created! Welcome to TECHFEST.');
      navigate('/events');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-mesh">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">TECHFEST 2025</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join thousands of participants at TECHFEST 2025</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">First Name *</label>
                <input {...register('firstName')} className="input-field" placeholder="John" />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name *</label>
                <input {...register('lastName')} className="input-field" placeholder="Doe" />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input {...register('email')} type="email" className="input-field" placeholder="you@college.edu" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
              <input {...register('password')} type="password" className="input-field" placeholder="Min. 8 characters" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Register Number</label>
                <input {...register('registerNumber')} className="input-field" placeholder="CSE2021001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Year of Study</label>
                <select {...register('yearOfStudy')} className="input-field bg-dark-700">
                  <option value="">Select year</option>
                  {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
              <select {...register('department')} className="input-field bg-dark-700">
                <option value="">Select department</option>
                {['Computer Science Engineering', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Information Technology', 'Chemical Engineering', 'Biomedical Engineering'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <input {...register('phone')} type="tel" className="input-field" placeholder="10-digit phone number" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 mt-2">
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
