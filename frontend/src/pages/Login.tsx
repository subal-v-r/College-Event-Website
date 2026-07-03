import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-mesh">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">TECHFEST 2025</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your account</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input {...register('email')} type="email" className="input-field" placeholder="you@college.edu" autoFocus />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input {...register('password')} type="password" className="input-field" placeholder="••••••••" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Create one</Link>
          </div>

          <div className="mt-4 p-3 bg-dark-800 rounded-xl text-xs text-slate-600 space-y-1">
            <p>Demo credentials:</p>
            <p>Admin: <span className="text-slate-400">admin@techfest.edu / Admin@1234</span></p>
            <p>Student: <span className="text-slate-400">john.doe@gec.edu / Student@1234</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
