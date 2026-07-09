import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { FiPlus, FiEdit3, FiTrash2, FiPackage } from 'react-icons/fi';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/products');
      const data = await r.json();
      setProducts(data.products || []);
    } catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      const r = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
      showToast('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch { showToast('Failed to delete', 'error'); }
  }

  return (
    <div className='min-h-screen bg-slate-900'>
      <Head><title>Products | Kino Mart Admin</title></Head>
      <AdminHeader active='Products' />

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      <div className='max-w-6xl mx-auto p-4 sm:p-6'>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-400">{products.length} product{products.length !== 1 ? 's' : ''}</p>
          <Link href="/admin/products/create" className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-blue-600 hover:bg-blue-700">
            <FiPlus className="w-4 h-4" /> New Product
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Loading…</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-slate-800 rounded-2xl shadow-sm border border-slate-700">
            <FiPackage className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-medium mb-3">No dynamic products yet</p>
            <Link href="/admin/products/create" className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700">
              <FiPlus /> Create First Product
            </Link>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700 bg-slate-900/60">
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3 text-center">Section</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.thumbnail && (
                          <img src={p.thumbnail} alt={p.title} className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-slate-700" />
                        )}
                        <div>
                          <p className="font-semibold text-slate-100 line-clamp-1 max-w-xs">{p.title}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{p.category || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-blue-400">৳{p.price}</span>
                      {p.originalPrice > p.price && (
                        <span className="text-xs text-slate-500 line-through ml-1">৳{p.originalPrice}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${p.inStock ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'}`}>
                        {p.inStock ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${p.sectionType === 'hot' ? 'bg-blue-900 text-blue-300' : 'bg-slate-700 text-slate-300'}`}>
                        {p.sectionType === 'hot' ? '🔥 Hot' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/products/edit/${p._id}`} className="p-1.5 bg-blue-900/40 text-blue-300 rounded-lg hover:bg-blue-900/70 transition-colors">
                          <FiEdit3 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(p._id, p.title)} className="p-1.5 bg-red-900/40 text-red-300 rounded-lg hover:bg-red-900/70 transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
