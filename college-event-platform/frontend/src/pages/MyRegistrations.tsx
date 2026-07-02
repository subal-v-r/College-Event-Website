import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { registrationsApi } from '../api';
import { Registration } from '../types';

const statusColors = {
  CONFIRMED: 'badge-green',
  CANCELLED: 'bg-red-500/20 text-red-300 border border-red-500/30 badge',
  WAITLISTED: 'badge-amber',
};

const MyRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    registrationsApi.getMyRegistrations()
      .then(({ data }) => setRegistrations(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      await registrationsApi.cancel(id);
      toast.success('Registration cancelled');
      load();
    } catch {
      toast.error('Failed to cancel registration');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">My Registrations</h1>
            <p className="text-slate-400 mt-1">Events you have registered for</p>
          </div>
          <Link to="/register" className="btn-primary text-sm">+ Register for Event</Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse flex gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-xl shrink-0" />
                <div className="flex-1">
                  <div className="h-5 bg-white/10 rounded mb-2 w-2/3" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : registrations.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No registrations yet</h3>
            <p className="text-slate-500 mb-6">Browse events and register to see them here</p>
            <Link to="/events" className="btn-primary">Explore Events →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg, i) => (
              <motion.div key={reg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-6 flex flex-col sm:flex-row gap-4">
                {/* Event Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div>
                      <h3 className="font-display font-bold text-white">{reg.event?.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                        <span>📅 {reg.event?.date ? new Date(reg.event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}</span>
                        <span>⏰ {reg.event?.startTime}</span>
                        <span>📍 {reg.event?.venue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>Reg#: {reg.registerNumber}</span>
                    <span>•</span>
                    <span>{reg.department} – Year {reg.yearOfStudy}</span>
                    <span>•</span>
                    <span>Registered: {new Date(reg.registeredAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end justify-between gap-3 shrink-0">
                  <span className={statusColors[reg.status]}>{reg.status}</span>
                  {reg.status === 'CONFIRMED' && (
                    <button onClick={() => handleCancel(reg.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyRegistrations;
