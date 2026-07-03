import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { speakersApi } from '../../api';
import { Speaker } from '../../types';
import { AdminLayout } from './Dashboard';

const defaultForm = { name: '', designation: '', organization: '', bio: '', sessionTitle: '', sessionDate: '', sessionTime: '', venue: '', isKeynote: false, photoUrl: '' };

const AdminSpeakers: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Speaker | null>(null);
  const [form, setForm] = useState(defaultForm);

  const load = () => speakersApi.getAll().then(({ data }) => setSpeakers(data.data)).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(defaultForm); setShowForm(true); };
  const openEdit = (s: Speaker) => { setEditing(s); setForm({ ...defaultForm, ...s, sessionDate: s.sessionDate.substring(0, 10), photoUrl: s.photoUrl ?? '' }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, sessionDate: new Date(form.sessionDate).toISOString(), photoUrl: form.photoUrl || undefined };
    try {
      if (editing) { await speakersApi.update(editing.id, payload); toast.success('Speaker updated'); }
      else { await speakersApi.create(payload); toast.success('Speaker created'); }
      setShowForm(false); load();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this speaker?')) return;
    await speakersApi.delete(id); toast.success('Speaker removed'); load();
  };

  return (
    <AdminLayout title="Manage Speakers">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400 text-sm">{speakers.length} speakers</p>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">+ Add Speaker</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 w-full max-w-xl my-8">
            <h2 className="font-bold text-white text-xl mb-6">{editing ? 'Edit' : 'Add'} Speaker</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-slate-300 mb-1">Full Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Designation *</label>
                  <input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Organization *</label>
                  <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="input-field" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-300 mb-1">Bio *</label>
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="input-field resize-none" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-300 mb-1">Session Title *</label>
                  <input value={form.sessionTitle} onChange={(e) => setForm({ ...form, sessionTitle: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Session Date *</label>
                  <input type="date" value={form.sessionDate} onChange={(e) => setForm({ ...form, sessionDate: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Session Time</label>
                  <input value={form.sessionTime} onChange={(e) => setForm({ ...form, sessionTime: e.target.value })} className="input-field" placeholder="e.g. 11:00 – 12:00" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Venue</label>
                  <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="input-field" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="keynote" checked={form.isKeynote} onChange={(e) => setForm({ ...form, isKeynote: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="keynote" className="text-sm text-slate-300">Keynote Speaker</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card p-5 animate-pulse h-20" />)
          : speakers.map((spk) => (
            <div key={spk.id} className="glass-card p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{spk.name}</h3>
                  {spk.isKeynote && <span className="text-xs text-amber-400">⭐ Keynote</span>}
                </div>
                <div className="text-sm text-slate-400">{spk.designation} – {spk.organization}</div>
                <div className="text-xs text-slate-500 mt-1 truncate">{spk.sessionTitle}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(spk)} className="text-xs text-primary-400 hover:text-primary-300 px-3 py-1.5 rounded-lg border border-primary-500/30 hover:bg-primary-500/10 transition-colors">Edit</button>
                <button onClick={() => handleDelete(spk.id)} className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors">Remove</button>
              </div>
            </div>
          ))}
      </div>
    </AdminLayout>
  );
};

export default AdminSpeakers;
