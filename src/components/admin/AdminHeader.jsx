import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  FiBox,
  FiLogOut,
  FiShoppingBag,
  FiTag,
  FiUsers,
} from 'react-icons/fi';

const NAV_ITEMS = [
  { href: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { href: '/admin/products', label: 'Products', icon: FiBox },
  { href: '/admin/categories', label: 'Categories', icon: FiTag },
  { href: '/admin/admins', label: 'Team', icon: FiUsers },
];

export default function AdminHeader({ active }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetch('/api/admin/me')
      .then(async (r) => {
        if (!r.ok) {
          router.replace('/admin/login');
          return;
        }
        setAdmin(await r.json());
      })
      .catch(() => router.replace('/admin/login'));
  }, []);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  return (
    <header className='bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-40'>
      <div className='flex items-center gap-5'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm'>
            K
          </div>
          <span className='font-black text-slate-100 tracking-tight hidden sm:block text-sm'>
            Kino Mart Admin
          </span>
        </div>
        <nav className='flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-700 overflow-x-auto'>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 text-[11px] px-4 py-1.5 rounded-md font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                active === label
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700'
              }`}
            >
              <Icon className='w-3.5 h-3.5' />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className='flex items-center gap-4'>
        <div className='hidden sm:flex flex-col items-end leading-none gap-0.5'>
          <span className='text-[10px] font-black uppercase tracking-widest text-slate-500'>
            Admin
          </span>
          <span className='text-xs font-bold text-slate-300'>
            {admin?.email}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className='p-2.5 bg-slate-700 text-slate-400 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all border border-slate-600 hover:border-red-500/30'
          title='Logout'
        >
          <FiLogOut className='w-4 h-4' />
        </button>
      </div>
    </header>
  );
}
