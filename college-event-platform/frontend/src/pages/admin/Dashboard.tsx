import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js';
import { dashboardApi } from '../../api';
import { DashboardStats } from '../../types';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/events', label: 'Events', icon: '⚡' },
  { href: '/admin/schedules', label: 'Schedule', icon: '📅' },
  { href: '/admin/speakers', label: 'Speakers', icon: '🎤' },
  { href: '/admin/announcements', label: 'Announcements', icon: '📢' },
  { href: '/admin/registrations', label: 'Registrations', icon: '📋' },
];

const AdminLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-800 border-r border-white/10 flex flex-col fixed top-0 bottom-0 left-0 z-40">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">TECHFEST</div>
              <div className="text-xs text-slate-500">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === link.href
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-2 px-4 py-2">
            ← Back to Site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-colors">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="text-2xl font-display font-bold text-white mb-6">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartData = stats ? {
    labels: stats.eventsByCategory.map((e) => e.category.replace('_', ' ')),
    datasets: [{
      data: stats.eventsByCategory.map((e) => e.count),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'],
      borderWidth: 0,
    }],
  } : null;

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse h-28" />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Events', value: stats.totalEvents, icon: '⚡', color: 'text-primary-400' },
              { label: 'Registrations', value: stats.totalRegistrations, icon: '📋', color: 'text-accent-400' },
              { label: 'Speakers', value: stats.totalSpeakers, icon: '🎤', color: 'text-emerald-400' },
              { label: 'Announcements', value: stats.totalAnnouncements, icon: '📢', color: 'text-amber-400' },
            ].map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{card.icon}</span>
                  <span className={`text-3xl font-display font-black ${card.color}`}>{card.value}</span>
                </div>
                <p className="text-slate-500 text-sm">{card.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Events by Category Chart */}
            {chartData && (
              <div className="glass-card p-6">
                <h3 className="font-bold text-white mb-4">Events by Category</h3>
                <div className="h-48">
                  <Doughnut data={chartData} options={{ plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } }, maintainAspectRatio: false }} />
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {adminNavLinks.slice(1).map((link) => (
                  <Link key={link.href} to={link.href} className="flex items-center gap-2 p-3 bg-dark-700 hover:bg-dark-600 rounded-xl text-sm text-slate-300 transition-colors">
                    <span>{link.icon}</span>
                    <span>Manage {link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-white mb-4">Recent Registrations</h3>
            {stats.recentRegistrations.length === 0 ? (
              <p className="text-slate-500 text-sm">No registrations yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-left border-b border-white/10">
                      <th className="pb-3 pr-4">Student</th>
                      <th className="pb-3 pr-4">Event</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.recentRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4 text-slate-300">{reg.user?.firstName} {reg.user?.lastName}</td>
                        <td className="py-3 pr-4 text-slate-400">{reg.event?.title}</td>
                        <td className="py-3 text-slate-500">{new Date(reg.registeredAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </AdminLayout>
  );
};

export { AdminLayout };
export default AdminDashboard;
