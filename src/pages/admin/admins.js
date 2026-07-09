import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import {
  FiUsers, FiUserPlus, FiTrash2, FiLogOut, FiShoppingBag,
  FiCheckCircle, FiAlertCircle, FiShield, FiMail, FiLock,
  FiClock, FiChevronRight, FiBox, FiTag,
} from 'react-icons/fi';
import { Transition } from '@headlessui/react';

export default function AdminsManagement() {
  const router = useRouter();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const [form, setForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch('/api/admin/me')
      .then(async (r) => {
        if (!r.ok) { router.replace('/admin/login'); }
        else { const data = await r.json(); setCurrentAdmin(data); setAuthChecked(true); }
      })
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  const fetchAdmins = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/admin/admins');
      if (res.ok) { const data = await res.json(); setAdmins(data.admins); }
    } finally { setLoadingList(false); }
  };

  useEffect(() => { if (authChecked) fetchAdmins(); }, [authChecked]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      let data = {};
      try { data = await res.json(); } catch {}
      if (res.ok) { showToast(`Admin "${form.email}" created`); setForm({ email: '', password: '' }); fetchAdmins(); }
      else { showToast(data.message || `Error (${res.status})`, 'error'); }
    } catch { showToast('Network error. Please try again.', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (email) => {
    if (!confirm(`Remove access for "${email}"?`)) return;
    setDeletingEmail(email);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setAdmins((prev) => prev.filter((a) => a.email !== email)); showToast('Admin access revoked'); }
      else { const data = await res.json(); showToast(data.message || 'Failed', 'error'); }
    } finally { setDeletingEmail(null); }
  };

  if (!authChecked) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-900'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
          <p className='text-slate-400 text-sm font-bold'>Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-900 text-slate-100'>
      <Head>
        <title>Team Management | Kino Mart Admin</title>
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      {/* Header */}
      <header className='bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-40'>
        <div className='flex items-center gap-5'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg'>
              <FiShield className='text-white w-4 h-4' />
            </div>
            <span className='font-black text-slate-100 tracking-tight hidden sm:block text-sm'>Kino Mart Admin</span>
          </div>
          <nav className='flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-700 overflow-x-auto'>
            <Link href='/admin/orders' className='flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-all whitespace-nowrap'>
              <FiShoppingBag className='w-3.5 h-3.5' />Orders
            </Link>
            <Link href='/admin/products' className='flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-all whitespace-nowrap'>
              <FiBox className='w-3.5 h-3.5' />Products
            </Link>
            <Link href='/admin/categories' className='flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-all whitespace-nowrap'>
              <FiTag className='w-3.5 h-3.5' />Categories
            </Link>
            <Link href='/admin/admins' className='flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-md bg-blue-600 text-white whitespace-nowrap'>
              <FiUsers className='w-3.5 h-3.5' />Team
            </Link>
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          <div className='hidden sm:flex flex-col items-end leading-none gap-0.5'>
            <span className='text-[10px] font-black uppercase tracking-widest text-slate-500'>Admin</span>
            <span className='text-xs font-bold text-slate-300'>{currentAdmin?.email}</span>
          </div>
          <button onClick={handleLogout} className='p-2.5 bg-slate-700 text-slate-400 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all border border-slate-600 hover:border-red-500/30' title='Logout'>
            <FiLogOut className='w-4 h-4' />
          </button>
        </div>
      </header>

      <main className='p-6 max-w-5xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-black text-slate-100'>Team Management</h1>
          <p className='text-slate-500 text-sm mt-0.5'>Manage administrative access for your store.</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* Add Admin Form */}
          <div className='lg:col-span-4'>
            <div className='bg-slate-800 rounded-2xl border border-slate-700 p-6 sticky top-20'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-10 h-10 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/30'>
                  <FiUserPlus className='w-5 h-5' />
                </div>
                <h2 className='text-base font-black text-slate-100'>Add Member</h2>
              </div>
              <form onSubmit={handleAddAdmin} className='space-y-4'>
                <div>
                  <label className='block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5'>Email Address</label>
                  <div className='relative'>
                    <FiMail className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4' />
                    <input
                      type='email'
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder='admin@example.com'
                      className='w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5'>Password</label>
                  <div className='relative'>
                    <FiLock className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4' />
                    <input
                      type='password'
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder='••••••••'
                      className='w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors'
                    />
                  </div>
                </div>
                <button type='submit' disabled={submitting} className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2'>
                  {submitting ? 'Processing...' : <><span>Provision Access</span><FiChevronRight className='w-4 h-4' /></>}
                </button>
              </form>
              <div className='mt-5 p-3.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20'>
                <p className='text-[10px] text-yellow-400 font-bold leading-relaxed flex gap-2'>
                  <FiAlertCircle className='shrink-0 w-3.5 h-3.5 mt-0.5' />
                  New admins have full access to orders and team management.
                </p>
              </div>
            </div>
          </div>

          {/* Admin List */}
          <div className='lg:col-span-8'>
            <div className='bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden'>
              <div className='px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/30'>
                <h2 className='text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2'>
                  Access Directory
                  <span className='bg-slate-700 border border-slate-600 text-slate-400 text-[10px] px-2 py-0.5 rounded-lg'>{admins.length}</span>
                </h2>
              </div>
              {loadingList ? (
                <div className='flex flex-col items-center justify-center py-20 gap-4'>
                  <div className='animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full' />
                  <p className='text-xs font-black text-slate-500 uppercase tracking-widest'>Loading...</p>
                </div>
              ) : admins.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 gap-3'>
                  <FiUsers className='w-10 h-10 text-slate-700' />
                  <p className='text-sm font-bold text-slate-500'>No admin accounts found</p>
                </div>
              ) : (
                <div className='divide-y divide-slate-700/50'>
                  {admins.map((admin) => {
                    const isCurrentUser = admin.email === currentAdmin?.email;
                    return (
                      <div key={admin.email} className='flex items-center justify-between px-6 py-5 hover:bg-slate-700/20 transition-colors'>
                        <div className='flex items-center gap-4'>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                            <span className='font-black text-lg uppercase'>{admin.email.charAt(0)}</span>
                          </div>
                          <div>
                            <div className='flex items-center gap-2 mb-0.5'>
                              <p className='text-sm font-black text-slate-100'>{admin.email}</p>
                              {isCurrentUser && <span className='text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-blue-500/30'>You</span>}
                            </div>
                            <div className='flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-600'>
                              <FiClock className='w-3 h-3' />
                              Created {new Date(admin.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        {!isCurrentUser && (
                          <button
                            onClick={() => handleDelete(admin.email)}
                            disabled={deletingEmail === admin.email}
                            className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-red-500/30 transition-all disabled:opacity-40'
                          >
                            <FiTrash2 className='w-3.5 h-3.5' />
                            {deletingEmail === admin.email ? 'Revoking...' : 'Revoke'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast */}
      <Transition show={!!toast} as={Fragment} enter='transform ease-out duration-300 transition' enterFrom='translate-y-2 opacity-0' enterTo='translate-y-0 opacity-100' leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 text-white px-5 py-3.5 rounded-xl shadow-2xl border ${toast?.type === 'error' ? 'bg-red-600 border-red-500' : 'bg-slate-700 border-slate-600'}`}>
          {toast?.type === 'error' ? <FiAlertCircle className='w-5 h-5 shrink-0' /> : <FiCheckCircle className='text-emerald-400 w-5 h-5 shrink-0' />}
          <span className='text-sm font-bold'>{toast?.message}</span>
        </div>
      </Transition>
    </div>
  );
}
