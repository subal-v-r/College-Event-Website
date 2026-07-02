import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { announcementsApi } from '../api';
import { Announcement } from '../types';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    announcementsApi.getAll()
      .then(({ data }) => setAnnouncements(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="page-header bg-mesh">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/50" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="section-title mb-4">Announcements</h1>
          <p className="section-subtitle mx-auto">Latest updates and important notices from the TECHFEST team</p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-5 bg-white/10 rounded mb-3 w-3/4" />
                <div className="h-4 bg-white/5 rounded mb-2" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl text-slate-300">No announcements yet</h3>
            <p className="text-slate-500 mt-2">Check back soon for updates</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((ann, i) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 border-l-4 border-primary-500 hover:border-accent-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-display font-bold text-white">{ann.title}</h3>
                  <span className="text-xs text-slate-500 shrink-0">
                    {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm">{ann.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
