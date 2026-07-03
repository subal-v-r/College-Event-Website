import React from 'react';
import { motion } from 'framer-motion';
import { Speaker } from '../types';

interface SpeakerCardProps {
  speaker: Speaker;
  index?: number;
}

const AVATAR_COLORS = [
  'from-primary-500 to-accent-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
];

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, index = 0 }) => {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = `${speaker.name.split(' ')[0][0]}${speaker.name.split(' ').slice(-1)[0][0]}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card p-6 flex flex-col hover:bg-white/[0.08] transition-all duration-300 group"
    >
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          {speaker.photoUrl ? (
            <img
              src={speaker.photoUrl}
              alt={speaker.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-500/30"
            />
          ) : (
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
              {initials}
            </div>
          )}
          {speaker.isKeynote && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs">
              ⭐
            </div>
          )}
        </div>
        <div>
          <h3 className="font-display font-bold text-white group-hover:text-primary-400 transition-colors">
            {speaker.name}
          </h3>
          <p className="text-sm text-primary-400">{speaker.designation}</p>
          <p className="text-xs text-slate-500">{speaker.organization}</p>
        </div>
      </div>

      {speaker.isKeynote && (
        <span className="badge-amber self-start mb-3">Keynote Speaker</span>
      )}

      {/* Bio */}
      <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3 flex-grow">
        {speaker.bio}
      </p>

      {/* Session Info */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-accent-400 text-sm">🎤</span>
          <p className="text-sm font-semibold text-slate-200 leading-tight">
            {speaker.sessionTitle}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
          <span>⏰ {speaker.sessionTime}</span>
          <span>📍 {speaker.venue}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SpeakerCard;
