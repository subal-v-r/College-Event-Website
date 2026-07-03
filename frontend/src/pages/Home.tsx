import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import EventCard from '../components/EventCard';
import { eventsApi } from '../api';
import { Event } from '../types';

const stats = [
  { label: 'Events', value: '10+', icon: '⚡' },
  { label: 'Speakers', value: '6', icon: '🎤' },
  { label: 'Prize Pool', value: '₹2L+', icon: '🏆' },
  { label: 'Departments', value: '8', icon: '🏛️' },
];

const Home: React.FC = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi.getAll({ featured: 'true', limit: 3 })
      .then(({ data }) => setFeaturedEvents(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-primary-400/5 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">Registrations Open • March 15–16, 2025</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-display font-black text-white mb-4 leading-none"
          >
            TECH
            <span className="text-gradient">FEST</span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl mt-2">2025</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-slate-400 mb-4 font-light"
          >
            Innovation Beyond Boundaries
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-500 mb-12 max-w-xl mx-auto"
          >
            National Level Technical Symposium • Government Engineering College
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <p className="text-slate-500 text-sm uppercase tracking-wider mb-6">Event starts in</p>
            <CountdownTimer targetDate="2025-03-15T09:00:00" />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/events" className="btn-primary text-lg px-10 py-4">
              Explore Events →
            </Link>
            <Link to="/register" className="btn-secondary text-lg px-10 py-4">
              Register Now
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 border border-slate-700 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-slate-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="stat-card"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-display font-black text-gradient mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Featured Events</h2>
          <p className="section-subtitle mx-auto">
            Don't miss these flagship events of TECHFEST 2025
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-4 w-1/3" />
                <div className="h-6 bg-white/10 rounded mb-2" />
                <div className="h-4 bg-white/10 rounded mb-4 w-2/3" />
                <div className="h-24 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/events" className="btn-outline">
            View All Events →
          </Link>
        </motion.div>
      </section>

      {/* Why Attend */}
      <section className="py-20 bg-dark-800/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Why Attend TECHFEST?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🏆', title: 'Win Big Prizes', desc: 'Over ₹2 Lakhs in prizes across 10+ events. Cash awards, trophies, internship opportunities, and product licenses await.' },
              { icon: '🤝', title: 'Network with Experts', desc: '6 keynote speakers from Google, Amazon, IIT, and top startups. Real networking with industry professionals.' },
              { icon: '🚀', title: 'Showcase Your Skills', desc: 'From hackathons to robotics, paper presentations to UI/UX – there\'s a platform for every technical talent.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-8 text-center"
              >
                <div className="text-5xl mb-5">{item.icon}</div>
                <h3 className="font-display font-bold text-xl text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-display font-black text-white mb-4">
            Ready to Compete?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Registration is free. Choose your events and secure your spot today.
          </p>
          <Link to="/register" className="btn-primary text-lg px-12 py-4">
            Get Started — It's Free →
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
