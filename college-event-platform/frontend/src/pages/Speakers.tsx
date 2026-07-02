import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SpeakerCard from '../components/SpeakerCard';
import { speakersApi } from '../api';
import { Speaker } from '../types';

const Speakers: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    speakersApi.getAll()
      .then(({ data }) => setSpeakers(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const keynotes = speakers.filter((s) => s.isKeynote);
  const other = speakers.filter((s) => !s.isKeynote);

  return (
    <div className="min-h-screen">
      <div className="page-header bg-mesh">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/50" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="section-title mb-4">Speakers</h1>
          <p className="section-subtitle mx-auto">
            Industry leaders, researchers, and entrepreneurs sharing knowledge and insights
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Keynote Speakers */}
        {keynotes.length > 0 && (
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2"
            >
              <span className="text-amber-400">⭐</span> Keynote Speakers
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="glass-card p-6 animate-pulse h-64" />
                  ))
                : keynotes.map((speaker, i) => (
                    <SpeakerCard key={speaker.id} speaker={speaker} index={i} />
                  ))}
            </div>
          </section>
        )}

        {/* Other Speakers */}
        {other.length > 0 && (
          <section>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2"
            >
              <span className="text-primary-400">🎙️</span> Expert Speakers
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {other.map((speaker, i) => (
                <SpeakerCard key={speaker.id} speaker={speaker} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Speakers;
