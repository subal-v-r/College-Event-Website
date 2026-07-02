import React from 'react';
import { motion } from 'framer-motion';

const departments = [
  'Computer Science Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Information Technology',
  'Chemical Engineering',
  'Biomedical Engineering',
];

const About: React.FC = () => (
  <div className="min-h-screen">
    <div className="page-header bg-mesh">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/50" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="section-title mb-4">About TECHFEST 2025</h1>
        <p className="section-subtitle mx-auto">Innovation Beyond Boundaries</p>
      </motion.div>
    </div>

    <div className="max-w-5xl mx-auto px-4 pb-20 space-y-10">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-display font-bold text-white mb-4">What is TECHFEST?</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            TECHFEST 2025 is the annual national-level technical symposium organized by Government Engineering College,
            Salem. This flagship event is a celebration of innovation, technical excellence, and student talent,
            bringing together the brightest engineering minds from across the country.
          </p>
          <p className="text-slate-400 leading-relaxed">
            In its 12th edition, TECHFEST 2025 features over 10 competitive events across 8 departments,
            expert talks by industry leaders, and workshops designed to bridge the gap between academia and industry.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
          {[
            { label: 'Colleges Expected', value: '200+' },
            { label: 'Participants', value: '2000+' },
            { label: 'Events', value: '10+' },
            { label: 'Prize Pool', value: '₹2L+' },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="text-3xl font-display font-black text-gradient mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Theme */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 text-center border border-primary-500/20">
        <h2 className="text-2xl font-display font-bold text-white mb-4">This Year's Theme</h2>
        <p className="text-4xl font-display font-black text-gradient mb-4">Innovation Beyond Boundaries</p>
        <p className="text-slate-400 max-w-2xl mx-auto">
          TECHFEST 2025 challenges participants to think beyond conventional boundaries — to innovate, collaborate,
          and create solutions that matter. This theme reflects the spirit of engineering: turning ideas into reality.
        </p>
      </motion.div>

      {/* Objectives */}
      <div>
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl font-display font-bold text-white mb-6">
          Objectives
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🧠', text: 'Foster technical thinking and problem-solving skills among engineering students' },
            { icon: '🤝', text: 'Create a platform for inter-college networking and knowledge sharing' },
            { icon: '💡', text: 'Expose students to cutting-edge technologies and industry trends' },
            { icon: '🚀', text: 'Identify and nurture exceptional technical talent from across the country' },
            { icon: '🔬', text: 'Encourage original research and innovation through paper presentations and project expos' },
            { icon: '🏆', text: 'Recognize and reward excellence in technical competitions' },
          ].map((obj, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 glass-card p-4">
              <span className="text-2xl shrink-0">{obj.icon}</span>
              <p className="text-slate-400 text-sm leading-relaxed">{obj.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Departments */}
      <div>
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl font-display font-bold text-white mb-6">
          Participating Departments
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {departments.map((dept, i) => (
            <motion.div key={dept} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass-card p-3 text-center text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              {dept}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default About;
