import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventsApi } from '../api';
import { Event } from '../types';
import toast from 'react-hot-toast';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    eventsApi.getById(id)
      .then(({ data }) => setEvent(data.data))
      .catch(() => {
        toast.error('Event not found');
        navigate('/events');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded mb-4 w-2/3" />
          <div className="h-4 bg-white/10 rounded mb-2" />
          <div className="h-4 bg-white/10 rounded mb-2 w-4/5" />
          <div className="h-48 bg-white/5 rounded mt-8" />
        </div>
      </div>
    );
  }

  if (!event) return null;

  const registeredCount = event._count?.registrations ?? 0;
  const seatsLeft = event.maxParticipants - registeredCount;
  const deadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isFull = seatsLeft <= 0;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-slate-300">Home</Link>
          <span>/</span>
          <Link to="/events" className="hover:text-slate-300">Events</Link>
          <span>/</span>
          <span className="text-slate-300">{event.title}</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="glass-card p-8 mb-6">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                {event.isFeatured && <span className="badge-amber mb-3 block w-fit">⭐ Featured Event</span>}
                <h1 className="text-3xl font-display font-bold text-white mb-2">{event.title}</h1>
                <span className="badge-blue">{event.category.replace('_', ' ')}</span>
              </div>
              {!deadlinePassed && !isFull ? (
                <Link to={`/register?eventId=${event.id}`} className="btn-primary shrink-0">
                  Register Now →
                </Link>
              ) : (
                <div className="btn-secondary cursor-not-allowed opacity-60 shrink-0">
                  {isFull ? 'Fully Booked' : 'Registration Closed'}
                </div>
              )}
            </div>

            {/* Event Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-dark-800/50 rounded-xl">
              {[
                { label: 'Date', value: new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' }), icon: '📅' },
                { label: 'Time', value: `${event.startTime} – ${event.endTime}`, icon: '⏰' },
                { label: 'Venue', value: event.venue, icon: '📍' },
                { label: 'Seats Left', value: isFull ? 'Full' : `${seatsLeft} / ${event.maxParticipants}`, icon: '👥' },
              ].map((item) => (
                <div key={item.label} className="text-center p-2">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-slate-200">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Description */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass-card p-6">
                <h2 className="font-display font-bold text-xl text-white mb-4">About This Event</h2>
                <p className="text-slate-400 leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>

              {event.rules.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="font-display font-bold text-xl text-white mb-4">Rules & Guidelines</h2>
                  <ul className="space-y-2">
                    {event.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-400">
                        <span className="text-primary-400 mt-0.5 shrink-0">✓</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prizes */}
              {(event.prizeFirst || event.prizeSecond || event.prizeThird) && (
                <div className="glass-card p-6">
                  <h2 className="font-display font-bold text-lg text-white mb-4">🏆 Prizes</h2>
                  <div className="space-y-3">
                    {event.prizeFirst && (
                      <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <span className="text-2xl">🥇</span>
                        <div>
                          <div className="text-xs text-amber-400/60">First Prize</div>
                          <div className="font-semibold text-amber-300">{event.prizeFirst}</div>
                        </div>
                      </div>
                    )}
                    {event.prizeSecond && (
                      <div className="flex items-center gap-3 p-3 bg-slate-500/10 border border-slate-500/20 rounded-xl">
                        <span className="text-2xl">🥈</span>
                        <div>
                          <div className="text-xs text-slate-400/60">Second Prize</div>
                          <div className="font-semibold text-slate-300">{event.prizeSecond}</div>
                        </div>
                      </div>
                    )}
                    {event.prizeThird && (
                      <div className="flex items-center gap-3 p-3 bg-amber-700/10 border border-amber-700/20 rounded-xl">
                        <span className="text-2xl">🥉</span>
                        <div>
                          <div className="text-xs text-amber-700/60">Third Prize</div>
                          <div className="font-semibold text-amber-600/90">{event.prizeThird}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Coordinator */}
              <div className="glass-card p-6">
                <h2 className="font-display font-bold text-lg text-white mb-4">📞 Coordinator</h2>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-slate-200">{event.coordinatorName}</div>
                  <div className="text-slate-400">{event.coordinatorEmail}</div>
                  <div className="text-slate-400">{event.coordinatorPhone}</div>
                </div>
              </div>

              {/* Registration Deadline */}
              <div className={`glass-card p-6 border ${deadlinePassed ? 'border-red-500/30' : 'border-emerald-500/30'}`}>
                <h2 className="font-display font-bold text-lg text-white mb-3">⏳ Registration</h2>
                <div className={`text-sm font-semibold ${deadlinePassed ? 'text-red-400' : 'text-emerald-400'}`}>
                  {deadlinePassed ? 'Registration Closed' : 'Open for Registration'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Deadline: {new Date(event.registrationDeadline).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetail;
