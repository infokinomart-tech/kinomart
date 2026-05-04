import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => { if (r.ok) router.replace('/admin/orders'); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { router.replace('/admin/orders'); }
      else { setError(data.message || 'Login failed'); }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login | Kino Mart</title>
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <div className='min-h-screen bg-slate-900 flex items-center justify-center px-4'>
        <div className='w-full max-w-sm'>
          {/* Logo */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30'>
              <span className='text-white font-black text-2xl'>K</span>
            </div>
            <h1 className='text-2xl font-black text-slate-100 tracking-tight'>Kino Mart <span className='text-blue-400'>Admin</span></h1>
            <p className='text-sm text-slate-500 mt-1 font-medium'>Sign in to manage orders</p>
          </div>

          {/* Card */}
          <div className='bg-slate-800 rounded-2xl border border-slate-700 p-7 shadow-2xl'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5'>Email Address</label>
                <div className='relative'>
                  <FiMail className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4' />
                  <input
                    type='email'
                    autoComplete='email'
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder='admin@example.com'
                    className='w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors'
                  />
                </div>
              </div>

              <div>
                <label className='block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5'>Password</label>
                <div className='relative'>
                  <FiLock className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4' />
                  <input
                    type='password'
                    autoComplete='current-password'
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder='••••••••'
                    className='w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors'
                  />
                </div>
              </div>

              {error && (
                <div className='flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3'>
                  <FiAlertCircle className='text-red-400 w-4 h-4 shrink-0' />
                  <p className='text-sm text-red-400 font-medium'>{error}</p>
                </div>
              )}

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2'
              >
                {loading ? (
                  <><div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />Signing in...</>
                ) : (
                  <><FiLogIn className='w-4 h-4' />Sign In</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
