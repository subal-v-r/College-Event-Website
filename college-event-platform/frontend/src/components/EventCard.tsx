import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Event, EventCategory } from '../types';

const categoryColors: Record<EventCategory, string> = {
  HACKATHON: 'badge-purple',
  CODING: 'badge-blue',
  PAPER_PRESENTATION: 'badge-green',
  PROJECT_EXPO: 'badge-amber',
  WORKSHOP: 'badge-blue',
  QUIZ: 'badge-green',
  DESIGN: 'badge-purple',
  ROBOTICS: 'badge-amber',
};

const categoryEmojis: Record<EventCategory, string> = {
  HACKATHON: '⚡',
  CODING: '💻',
  PAPER_PRESENTATION: '📄',
  PROJECT_EXPO: '🚀',
  WORKSHOP: '🔧',
  QUIZ: '🧠',
  DESIGN: '🎨',
  ROBOTICS: '🤖',
};

const categoryLabels: Record<EventCategory, string> = {
  HACKATHON: 'Hackathon',
  CODING: 'Coding',
  PAPER_PRESENTATION: 'Paper Presentation',
  PROJECT_EXPO: 'Project Expo',
  WORKSHOP: 'Workshop',
  QUIZ: 'Quiz',
  DESIGN: 'Design',
  ROBOTICS: 'Robotics',
};

interface EventCardProps {
  event: Event;
  index?: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index = 0 }) => {
  const registeredCount = event._count?.registrations ?? 0;
  const seatsLeft = event.maxParticipants - registeredCount;
  const isAlmostFull = seatsLeft <= event.maxParticipants * 0.2;
  const isFull = seatsLeft <= 0;
  const deadlinePassed = new Date() > new Date(event.registrationDeadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link to={`/events/${event.id}`} className="block h-full group">
        <div className="glass-card-hover h-full flex flex-col p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{categoryEmojis[event.category]}</span>
              <span className={categoryColors[event.category]}>
                {categoryLabels[event.category]}
              </span>
            </div>
            {event.isFeatured && (
              <span className="badge bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">
            {event.shortDescription}
          </p>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>📅</span>
              <span>{new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="text-slate-600">•</span>
              <span>{event.startTime} – {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>📍</span>
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Prizes */}
          {event.prizeFirst && (
            <div className="text-sm text-amber-400/80 mb-4 flex items-center gap-1">
              🏆 <span className="font-semibold">{event.prizeFirst}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="text-sm">
              {isFull ? (
                <span className="text-red-400 font-semibold">Fully Booked</span>
              ) : isAlmostFull ? (
                <span className="text-amber-400 font-semibold">Only {seatsLeft} left!</span>
              ) : (
                <span className="text-emerald-400">{seatsLeft} seats left</span>
              )}
            </div>
            <div className="text-xs text-slate-500">
              {deadlinePassed ? (
                <span className="text-red-400">Closed</span>
              ) : (
                <span>Deadline: {new Date(event.registrationDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
