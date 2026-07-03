import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { eventsApi } from '../../api';
import { Event, EventCategory } from '../../types';
import { AdminLayout } from './Dashboard';

const categoryOptions: EventCategory[] = ['HACKATHON', 'CODING', 'PAPER_PRESENTATION', 'PROJECT_EXPO', 'WORKSHOP', 'QUIZ', 'DESIGN', 'ROBOTICS'];

const defaultForm = {
  title: '', shortDescription: '', description: '', category: 'CODING' as EventCategory,
  venue: '', date: '', startTime: '09:00', endTime: '17:00', maxParticipants: 100,
  registrationDeadline: '', coordinatorName: '', coordinatorEmail: '', coordinatorPhone: '',
  prizeFirst: '', prizeSecond: '', prizeThird: '', isFeatured: false,
  rules: [''], tags: [''],
};

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState(defaultForm);

  const load = () => eventsApi.getAll({ limit: 100 })
    .then(({ data }) => setEvents(data.data))
    .catch(console.error)
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(defaultForm); setShowForm(true); };
  const openEdit = (e: Event) => {
    setEditing(e);
    setForm({
      ...defaultForm, ...e,
      date: e.date.substring(0, 10),
      registrationDeadline: e.registrationDeadline.substring(0, 10),
      rules: e.rules.length ? e.rules : [''],
      tags: e.tags.length ? e.tags : [''],
    });
    setShowForm(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const payload = {
      ...form,
      date: new Date(form.date).toISOString(),
      registrationDeadline: new Date(form.registrationDeadline).toISOString(),
      rules: form.rules.filter(Boolean),
      tags: form.tags.filter(Boolean),
    };
    try {
      if (editing) { await eventsApi.update(editing.id, payload); toast.success('Event updated'); }
      else { await eventsApi.create(payload); toast.success('Event created'); }
      setShowForm(false);
      load();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    await eventsApi.delete(id);
    toast.success('Event deleted');
    load();
  };

  return (
    <AdminLayout title="Manage Events">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400 text-sm">{events.length} active events</p>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">+ New Event</button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 w-full max-w-2xl my-8">
            <h2 className="font-bold text-white text-xl mb-6">{editing ? 'Edit' : 'Create'} Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-slate-300 mb-1">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as EventCategory })} className="input-field bg-dark-700">
                    {categoryOptions.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Venue *</label>
                  <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Reg. Deadline *</label>
                  <input type="date" value={form.registrationDeadline} onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">End Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-300 mb-1">Short Description *</label>
                  <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input-field" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-300 mb-1">Full Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-field resize-none" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Max Participants</label>
                  <input type="number" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) })} className="input-field" min={1} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="featured" className="text-sm text-slate-300">Featured Event</label>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Coordinator Name</label>
                  <input value={form.coordinatorName} onChange={(e) => setForm({ ...form, coordinatorName: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Coordinator Email</label>
                  <input type="email" value={form.coordinatorEmail} onChange={(e) => setForm({ ...form, coordinatorEmail: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">1st Prize</label>
                  <input value={form.prizeFirst} onChange={(e) => setForm({ ...form, prizeFirst: e.target.value })} className="input-field" placeholder="e.g. ₹15,000 + Trophy" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">2nd Prize</label>
                  <input value={form.prizeSecond} onChange={(e) => setForm({ ...form, prizeSecond: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'} Event</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card p-5 animate-pulse h-20" />)
          : events.map((event) => (
            <div key={event.id} className="glass-card p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">{event.title}</h3>
                  {event.isFeatured && <span className="text-xs text-amber-400 shrink-0">⭐ Featured</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{event.category.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{new Date(event.date).toLocaleDateString('en-IN')}</span>
                  <span>•</span>
                  <span>{event.venue}</span>
                  <span>•</span>
                  <span>{event._count?.registrations ?? 0}/{event.maxParticipants} registered</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(event)} className="text-xs text-primary-400 hover:text-primary-300 px-3 py-1.5 rounded-lg border border-primary-500/30 hover:bg-primary-500/10 transition-colors">Edit</button>
                <button onClick={() => handleDelete(event.id)} className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors">Delete</button>
              </div>
            </div>
          ))}
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
