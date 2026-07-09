import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProductForm from '@/components/admin/ProductForm';
import AdminHeader from '@/components/admin/AdminHeader';

export default function CreateProduct() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData) {
    setSaving(true);
    setError('');
    try {
      const r = await fetch('/api/admin/products', {
        method: 'POST',
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
      <Head><title>Create Product | Kino Mart Admin</title></Head>
      <AdminHeader active='Products' />
      <div className='max-w-6xl mx-auto p-4 sm:p-6'>
        <div className='bg-slate-50 rounded-2xl p-4 sm:p-6'>
          <ProductForm
            title="Create New Product"
            onSubmit={handleSubmit}
            saving={saving}
            error={error}
            backHref="/admin/products"
          />
        </div>
      </div>
    </div>
  );
}
