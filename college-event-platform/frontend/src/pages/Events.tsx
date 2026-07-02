import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import { eventsApi } from '../api';
import { Event, EventCategory } from '../types';

const categories: { value: string; label: string; emoji: string }[] = [
  { value: '', label: 'All Events', emoji: '🎯' },
  { value: 'HACKATHON', label: 'Hackathon', emoji: '⚡' },
  { value: 'CODING', label: 'Coding', emoji: '💻' },
  { value: 'PAPER_PRESENTATION', label: 'Paper Presentation', emoji: '📄' },
  { value: 'PROJECT_EXPO', label: 'Project Expo', emoji: '🚀' },
  { value: 'WORKSHOP', label: 'Workshop', emoji: '🔧' },
  { value: 'QUIZ', label: 'Quiz', emoji: '🧠' },
  { value: 'DESIGN', label: 'Design', emoji: '🎨' },
  { value: 'ROBOTICS', label: 'Robotics', emoji: '🤖' },
];

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;

    const timeout = setTimeout(() => {
      eventsApi.getAll(params)
        .then(({ data }) => setEvents(data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="page-header bg-mesh">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto px-4"
        >
          <h1 className="section-title mb-4">All Events</h1>
          <p className="section-subtitle mx-auto">
            Discover 10+ exciting events across hackathons, coding, robotics, design, and more
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Search & Filter */}
        <div className="mb-10 space-y-4">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field max-w-md"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === cat.value
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'glass-card text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-4 w-1/3" />
                <div className="h-6 bg-white/10 rounded mb-2" />
                <div className="h-4 bg-white/10 rounded mb-4 w-2/3" />
                <div className="h-24 bg-white/5 rounded mb-4" />
                <div className="h-8 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No events found</h3>
            <p className="text-slate-500">Try a different search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
