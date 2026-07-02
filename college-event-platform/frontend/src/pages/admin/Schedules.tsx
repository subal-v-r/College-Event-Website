import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { schedulesApi } from '../../api';
import { ScheduleItem } from '../../types';
import { AdminLayout } from './Dashboard';

const defaultForm = { title: '', description: '', date: '', startTime: '09:00', endTime: '10:00', venue: '', day: 1, type: 'SESSION', isBreak: false, orderIndex: 0 };

const AdminSchedules: React.FC = () => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ScheduleItem | null>(null);
  const [form, setForm] = useState(defaultForm);

  const load = () => schedulesApi.getAll().then(({ data }) => setItems(data.data)).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(defaultForm); setShowForm(true); };
  const openEdit = (s: ScheduleItem) => { setEditing(s); setForm({ ...defaultForm, ...s, date: s.date.substring(0, 10) }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, date: new Date(form.date).toISOString() };
    try {
      if (editing) { await schedulesApi.update(editing.id, payload); toast.success('Updated'); }
      else { await schedulesApi.create(payload); toast.success('Created'); }
      setShowForm(false); load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete schedule item?')) return;
    await schedulesApi.delete(id); toast.success('Deleted'); load();
  };

  const days = [...new Set(items.map((s) => s.day))].sort();

  return (
    <AdminLayout title="Manage Schedule">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400 text-sm">{items.length} schedule items</p>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">+ Add Item</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 w-full max-w-xl my-8">
            <h2 className="font-bold text-white text-xl mb-6">{editing ? 'Edit' : 'Add'} Schedule Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-slate-300 mb-1">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-300 mb-1">Description</label>
                  <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Venue *</label>
                  <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">End Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Day</label>
                  <select value={form.day} onChange={(e) => setForm({ ...form, day: parseInt(e.target.value) })} className="input-field bg-dark-700">
                    <option value={1}>Day 1</option>
                    <option value={2}>Day 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field bg-dark-700">
                    {['REGISTRATION', 'CEREMONY', 'KEYNOTE', 'SESSION', 'CULTURAL', 'BREAK'].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="break" checked={form.isBreak} onChange={(e) => setForm({ ...form, isBreak: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="break" className="text-sm text-slate-300">Is Break</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {days.map((day) => (
        <div key={day} className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3">Day {day}</h3>
          <div className="space-y-2">
            {items.filter((s) => s.day === day).map((item) => (
              <div key={item.id} className="glass-card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="text-xs text-slate-500 font-mono w-20 shrink-0">{item.startTime} – {item.endTime}</div>
                  <div>
                    <div className="font-medium text-white text-sm">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.venue} • {item.type}</div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="text-xs text-primary-400 px-2 py-1 rounded border border-primary-500/30 hover:bg-primary-500/10 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 px-2 py-1 rounded border border-red-500/30 hover:bg-red-500/10 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AdminLayout>
  );
};

export default AdminSchedules;
