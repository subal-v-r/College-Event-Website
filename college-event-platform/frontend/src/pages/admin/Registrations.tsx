import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { registrationsApi } from '../../api';
import { Registration } from '../../types';
import { AdminLayout } from './Dashboard';

const AdminRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    registrationsApi.getAll()
      .then(({ data }) => setRegistrations(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.user?.firstName?.toLowerCase().includes(q) ||
      r.user?.lastName?.toLowerCase().includes(q) ||
      r.user?.email?.toLowerCase().includes(q) ||
      r.event?.title?.toLowerCase().includes(q) ||
      r.registerNumber?.toLowerCase().includes(q)
    );
  });

  const handleCancel = async (id: string) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      await registrationsApi.cancel(id);
      toast.success('Registration cancelled');
      setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status: 'CANCELLED' as const } : r));
    } catch {
      toast.error('Failed to cancel registration');
    }
  };

  return (
    <AdminLayout title="Registrations">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: registrations.length, color: 'text-white' },
          { label: 'Confirmed', value: registrations.filter((r) => r.status === 'CONFIRMED').length, color: 'text-emerald-400' },
          { label: 'Cancelled', value: registrations.filter((r) => r.status === 'CANCELLED').length, color: 'text-red-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-slate-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, register number, or event..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-6"
      />

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-700/50 border-b border-white/10">
                <tr className="text-slate-500 text-left">
                  {['Student', 'Register No.', 'Department', 'Event', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((reg) => (
                  <motion.tr key={reg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-slate-200 font-medium">{reg.user?.firstName} {reg.user?.lastName}</div>
                      <div className="text-xs text-slate-500">{reg.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{reg.registerNumber}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{reg.department} – Y{reg.yearOfStudy}</td>
                    <td className="px-4 py-3 text-slate-300 max-w-[180px] truncate">{reg.event?.title}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${
                        reg.status === 'CONFIRMED' ? 'badge-green' :
                        reg.status === 'CANCELLED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'badge-amber'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(reg.registeredAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      {reg.status === 'CONFIRMED' && (
                        <button onClick={() => handleCancel(reg.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                          Cancel
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-slate-500">No registrations found</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRegistrations;
