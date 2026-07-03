import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { schedulesApi } from '../api';
import { ScheduleItem } from '../types';

const typeColors: Record<string, string> = {
  REGISTRATION: 'border-emerald-500 bg-emerald-500/10',
  CEREMONY: 'border-amber-500 bg-amber-500/10',
  KEYNOTE: 'border-primary-500 bg-primary-500/10',
  SESSION: 'border-accent-500 bg-accent-500/10',
  CULTURAL: 'border-pink-500 bg-pink-500/10',
  BREAK: 'border-slate-600 bg-slate-700/30',
};

const typeIcons: Record<string, string> = {
  REGISTRATION: '📋',
  CEREMONY: '🎖️',
  KEYNOTE: '🎤',
  SESSION: '💡',
  CULTURAL: '🎭',
  BREAK: '☕',
};

const Schedule: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schedulesApi.getAll()
      .then(({ data }) => setScheduleItems(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const days = [...new Set(scheduleItems.map((s) => s.day))].sort();
  const filteredItems = scheduleItems.filter((s) => s.day === activeDay);

  return (
    <div className="min-h-screen">
      <div className="page-header bg-mesh">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/50" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="section-title mb-4">Event Schedule</h1>
          <p className="section-subtitle mx-auto">Two days of talks, workshops, and technical events</p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20">
        {/* Day Tabs */}
        <div className="flex gap-3 mb-10">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeDay === day
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              {day === 1 ? '📅 Day 1 – March 15' : '📅 Day 2 – March 16'}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse flex gap-4">
                <div className="w-16 h-4 bg-white/10 rounded shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="timeline-line" />
            <div className="space-y-4 pl-16">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`relative border-l-2 pl-6 py-1 ${typeColors[item.type] ?? 'border-slate-600'} rounded-r-xl`}
                >
                  {/* Time badge */}
                  <div className="absolute -left-[4.5rem] flex items-center gap-1">
                    <span className="text-slate-500 text-xs font-mono tabular-nums">{item.startTime}</span>
                  </div>

                  {/* Dot */}
                  <div className="absolute -left-[0.35rem] top-4 w-3 h-3 rounded-full border-2 border-current bg-dark-900" />

                  <div className={`glass-card p-4 ${item.isBreak ? 'opacity-70' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{typeIcons[item.type] ?? '📌'}</span>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      {item.isBreak && <span className="badge bg-slate-600/30 text-slate-400 border-slate-600/30 text-xs ml-auto">Break</span>}
                    </div>
                    {item.description && (
                      <p className="text-sm text-slate-400 mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>⏰ {item.startTime} – {item.endTime}</span>
                      <span>📍 {item.venue}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
