import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProductForm from '@/components/admin/ProductForm';
import AdminHeader from '@/components/admin/AdminHeader';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((d) => { setInitialData(d.product); setLoading(false); })
      .catch(() => { setError('Failed to load product'); setLoading(false); });
  }, [id]);

  async function handleSubmit(formData) {
    setSaving(true);
    setError('');
    try {
      const r = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Failed');
      router.push('/admin/products');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className='min-h-screen bg-slate-900'>
      <Head><title>Edit Product | Kino Mart Admin</title></Head>
      <AdminHeader active='Products' />
      <div className='max-w-6xl mx-auto p-4 sm:p-6'>
        <div className='bg-slate-50 rounded-2xl p-4 sm:p-6'>
          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading product…</div>
          ) : (
            <ProductForm
              title="Edit Product"
              initialData={initialData}
              onSubmit={handleSubmit}
              saving={saving}
              error={error}
              backHref="/admin/products"
            />
          )}
        </div>
      </div>
    </div>
  );
}
