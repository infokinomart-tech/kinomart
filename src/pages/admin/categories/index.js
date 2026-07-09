import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import AdminHeader from '@/components/admin/AdminHeader';

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [slugManual, setSlugManual] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => { loadCategories(); }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/categories');
      const data = await r.json();
      setCategories(data.categories || []);
    } catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }

  function handleNameChange(val) {
    setForm((p) => ({ ...p, name: val, slug: slugManual ? p.slug : slugify(val) }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    try {
      const r = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Failed');
      setCategories((p) => [...p, data.category].sort((a, b) => a.name.localeCompare(b.name)));
      setForm({ name: '', slug: '', description: '' });
      setSlugManual(false);
      showToast('Category created');
    } catch (e) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      setCategories((p) => p.filter((c) => c._id !== id));
      showToast('Deleted');
    } catch { showToast('Delete failed', 'error'); }
  }

  return (
    <div className='min-h-screen bg-slate-900'>
      <Head><title>Categories | Kino Mart Admin</title></Head>
      <AdminHeader active='Categories' />

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      <div className='max-w-6xl mx-auto p-4 sm:p-6'>
        {/* Create form */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-sm p-6 mb-5 max-w-2xl">
          <h2 className="text-sm font-bold text-slate-100 mb-4">Add New Category</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Name *</label>
                <input
                  required type="text" value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Electronics"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Slug *</label>
                <input
                  required type="text" value={form.slug}
                  onChange={(e) => { setSlugManual(true); setForm((p) => ({ ...p, slug: e.target.value })); }}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="electronics"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
              <input
                type="text" value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional description"
              />
            </div>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 bg-blue-600 hover:bg-blue-700">
              <FiPlus className="w-4 h-4" /> {saving ? 'Saving…' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-sm overflow-hidden max-w-2xl">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No categories yet. Add one above.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/60">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {categories.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-100">{c.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{c.slug}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{c.description || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(c._id, c.name)} className="p-1.5 bg-red-900/40 text-red-300 rounded-lg hover:bg-red-900/70 transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
