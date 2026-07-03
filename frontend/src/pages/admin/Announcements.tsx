import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { announcementsApi } from '../../api';
import { Announcement } from '../../types';
import { AdminLayout } from './Dashboard';

const AdminAnnouncements: React.FC = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: '', content: '', priority: 0, isPublished: true });

  const load = () => announcementsApi.getAllAdmin()
    .then(({ data }) => setItems(data.data))
    .catch(console.error)
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ title: '', content: '', priority: 0, isPublished: true }); setShowForm(true); };
  const openEdit = (a: Announcement) => { setEditing(a); setForm({ title: a.title, content: a.content, priority: a.priority, isPublished: a.isPublished }); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await announcementsApi.update(editing.id, form);
        toast.success('Announcement updated');
      } else {
        await announcementsApi.create(form);
        toast.success('Announcement created');
      }
      setShowForm(false);
      load();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    await announcementsApi.delete(id);
    toast.success('Announcement deleted');
    load();
  };

  return (
    <AdminLayout title="Announcements">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400 text-sm">{items.length} announcements</p>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">+ New Announcement</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 w-full max-w-lg">
            <h2 className="font-bold text-white text-xl mb-6">{editing ? 'Edit' : 'Create'} Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className="input-field resize-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Priority (0=high)</label>
                  <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) })} className="input-field" min={0} max={10} />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="published" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 rounded" />
                  <label htmlFor="published" className="text-sm text-slate-300">Published</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card p-6 animate-pulse h-24" />)
          : items.map((ann) => (
            <div key={ann.id} className={`glass-card p-5 border-l-4 ${ann.isPublished ? 'border-primary-500' : 'border-slate-600'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{ann.title}</h3>
                    {!ann.isPublished && <span className="badge bg-slate-600/30 text-slate-400 border-slate-600/30 text-xs">Draft</span>}
                    <span className="text-xs text-slate-600">Priority: {ann.priority}</span>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-slate-600 mt-2">{new Date(ann.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(ann)} className="text-xs text-primary-400 hover:text-primary-300 px-2 py-1 rounded border border-primary-500/30 hover:bg-primary-500/10 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(ann.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/30 hover:bg-red-500/10 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </AdminLayout>
  );
};

export default AdminAnnouncements;
