import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contactApi } from '../api';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type FormData = z.infer<typeof schema>;

const contacts = [
  { role: 'Faculty Coordinator', name: 'Prof. Dr. S. Rajendran', dept: 'Head of Symposium', phone: '+91-422-2345678', email: 'rajendran@gec.edu' },
  { role: 'Student Coordinator', name: 'Arun Prakash (Final Year CSE)', dept: 'Overall Coordinator', phone: '9876543220', email: 'arun.prakash@gec.edu' },
  { role: 'Technical Events', name: 'Meenakshi S. (Third Year CSE)', dept: 'Technical Head', phone: '9876543221', email: 'technical@techfest2025.in' },
  { role: 'Logistics', name: 'Karthik R. (Third Year ECE)', dept: 'Logistics Head', phone: '9876543222', email: 'logistics@techfest2025.in' },
];

const Contact: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await contactApi.submit(data);
      toast.success('Message sent! We\'ll reply within 24 hours.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="page-header bg-mesh">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/50" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="section-title mb-4">Contact Us</h1>
          <p className="section-subtitle mx-auto">Reach out to our organizing team for any queries</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Cards */}
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-6">Organizing Committee</h2>
            <div className="space-y-4">
              {contacts.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
                  <div className="text-xs text-primary-400 font-semibold uppercase tracking-wider mb-1">{c.role}</div>
                  <div className="font-semibold text-white">{c.name}</div>
                  <div className="text-sm text-slate-500 mb-3">{c.dept}</div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <a href={`tel:${c.phone}`} className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-1">
                      📞 {c.phone}
                    </a>
                    <a href={`mailto:${c.email}`} className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-1">
                      📧 {c.email}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map/Address */}
            <div className="glass-card p-6 mt-6">
              <h3 className="font-bold text-white mb-3">📍 Venue Address</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Government Engineering College<br />
                Karuppur, Salem – 636011<br />
                Tamil Nadu, India<br />
              </p>
              <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl text-sm text-primary-300">
                🚌 Free shuttle available from Salem Railway Station & Bus Stand
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-6">Send a Message</h2>
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="glass-card p-8 space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                  <input {...register('name')} className="input-field" placeholder="Your name" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                  <input {...register('email')} type="email" className="input-field" placeholder="your@email.com" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject *</label>
                <input {...register('subject')} className="input-field" placeholder="What is your query about?" />
                {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                <textarea {...register('message')} rows={5} className="input-field resize-none" placeholder="Write your message here..." />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                {submitting ? 'Sending...' : 'Send Message →'}
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
