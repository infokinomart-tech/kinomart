import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import {
  FiSearch, FiRefreshCw, FiFilter, FiTrash2, FiEdit3,
  FiCheckCircle, FiXCircle, FiClock, FiPhone, FiPhoneMissed, FiPhoneCall, FiPhoneOff,
  FiCopy, FiCalendar, FiArrowLeft, FiArrowRight, FiFileText, FiAlertTriangle,
} from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';

const ORDER_STATUS_CONFIG = {
  pending:   { label: 'Pending',   btn: 'bg-yellow-600 hover:bg-yellow-700',   icon: FiClock,       badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'  },
  confirmed: { label: 'Confirmed', btn: 'bg-emerald-600 hover:bg-emerald-700', icon: FiCheckCircle, badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  cancel:    { label: 'Cancelled', btn: 'bg-red-600 hover:bg-red-700',         icon: FiXCircle,     badge: 'bg-red-500/20 text-red-400 border-red-500/30'           },
};

const RESPONSE_STATUS_CONFIG = {
  called:       { label: 'Called',       icon: FiPhone,         badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  number_off:   { label: 'Number Off',   icon: FiPhoneOff,      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40'   },
  did_not_pick: { label: 'Did Not Pick', icon: FiPhoneMissed,   badge: 'bg-red-500/20 text-red-300 border-red-500/40'            },
  call_later:   { label: 'Call Later',   icon: FiPhoneCall,     badge: 'bg-violet-500/20 text-violet-300 border-violet-500/40'   },
  fake_order:   { label: 'Fake Order',   icon: FiAlertTriangle, badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40'   },
  null:         { label: 'Not Called',   icon: FiClock,         badge: 'bg-slate-600/40 text-slate-400 border-slate-600/50'      },
};

const ROW_STYLE = {
  pending:   { border: 'border-l-yellow-500',  bg: 'bg-yellow-500/[0.07]'  },
  confirmed: { border: 'border-l-emerald-500', bg: 'bg-emerald-500/[0.07]' },
  cancel:    { border: 'border-l-red-500',     bg: 'bg-red-500/[0.07]'     },
};

const ROW_BORDER = {
  pending:   'border-l-yellow-500',
  confirmed: 'border-l-emerald-500',
  cancel:    'border-l-red-500',
};

function formatPhone(phone) {
  if (!phone) return '';
  if (phone.startsWith('+88')) return phone.slice(3);
  if (phone.startsWith('88') && phone.length > 11) return phone.slice(2);
  return phone;
}

function formatOrderTime(order) {
  if (order.submissionTime) {
    const lastComma = order.submissionTime.lastIndexOf(',');
    if (lastComma !== -1) return { date: order.submissionTime.slice(0, lastComma).trim(), time: order.submissionTime.slice(lastComma + 1).trim() };
    return { date: order.submissionTime, time: '—' };
  }
  if (order.createdAt) {
    const d = new Date(order.createdAt);
    return {
      date: d.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka' }),
      time: d.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' }),
    };
  }
  return { date: '—', time: '—' };
}

function parseItems(itemsStr) {
  try {
    const arr = JSON.parse(itemsStr || '[]');
    return arr.map((it, i) => {
      const variant = it.selectedColor || it.variant || '';
      return (
        <div key={i} className='mb-0.5 last:mb-0'>
          <span className='font-medium text-slate-200'>{it.title || it.name || 'Item'}</span>
          <span className='text-slate-500 mx-1'>×</span>
          <span className='text-blue-400 font-semibold'>{it.quantity || 1}</span>
          {variant && <span className='block text-[10px] text-slate-500 uppercase tracking-tight'>{variant}</span>}
        </div>
      );
    });
  } catch {
    return <span className='text-slate-500 italic text-xs'>No items</span>;
  }
}

function parseItemQty(itemsStr) {
  try { return JSON.parse(itemsStr || '[]').reduce((sum, it) => sum + (Number(it.quantity) || 1), 0); }
  catch { return 0; }
}

export default function AdminOrders() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [responseFilter, setResponseFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [noteValue, setNoteValue] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState({});
  const [toast, setToast] = useState(null);
  const [hoveredNote, setHoveredNote] = useState(null);
  const [stats, setStats] = useState({
    today: 0, pendingToday: 0, confirmedToday: 0, cancelledToday: 0,
    total: 0, totalPending: 0, totalConfirmed: 0, totalCancelled: 0,
  });

  const debounceRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch('/api/admin/me')
      .then(async (r) => {
        if (!r.ok) { router.replace('/admin/login'); }
        else { const data = await r.json(); setAdmin(data); setAuthChecked(true); }
      })
      .catch(() => router.replace('/admin/login'));
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 30, search, status: statusFilter, responseStatus: responseFilter, from: fromDate, to: toDate });
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      if (data.stats) {
        setStats({
          today: data.stats.today,
          pendingToday: data.stats.pendingToday,
          confirmedToday: data.stats.confirmedToday,
          cancelledToday: data.stats.cancelledToday,
          total: data.stats.globalTotal,
          totalPending: data.stats.totalPending,
          totalConfirmed: data.stats.totalConfirmed,
          totalCancelled: data.stats.totalCancelled,
        });
      }
    } catch { /* keep state */ }
    finally { setLoading(false); }
  }, [page, search, statusFilter, responseFilter, fromDate, toDate]);

  useEffect(() => { if (authChecked) fetchOrders(); }, [authChecked, fetchOrders]);
  useEffect(() => { setPage(1); }, [search, statusFilter, responseFilter, fromDate, toDate]);

  const handleSearchChange = (e) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(e.target.value), 400);
  };

  const handleResetFilters = () => {
    setSearch(''); setStatusFilter(''); setResponseFilter(''); setFromDate(''); setToDate(''); setPage(1);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  const openUpdateModal = (order) => {
    setSelectedOrder({ ...order });
    setNoteValue(order.note || '');
    setIsUpdateModalOpen(true);
  };

  const handleStatusUpdate = async (field, newVal) => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newVal }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o._id === selectedOrder._id ? { ...o, [field]: newVal } : o));
        setSelectedOrder((prev) => ({ ...prev, [field]: newVal }));
        showToast(`${field === 'orderStatus' ? 'Order' : 'Response'} status updated`);
        fetchOrders();
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveNote = async () => {
    if (!selectedOrder) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteValue }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o._id === selectedOrder._id ? { ...o, note: noteValue } : o));
        setSelectedOrder((prev) => ({ ...prev, note: noteValue }));
        showToast('Note saved');
      }
    } catch (err) { console.error(err); }
    finally { setSavingNote(false); }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopyFeedback((prev) => ({ ...prev, [key]: false })), 2000);
  };

  const copyFullOrder = () => {
    if (!selectedOrder) return;
    copyToClipboard(`${selectedOrder.name}\n${formatPhone(selectedOrder.phone)}\n${selectedOrder.address}\n৳${selectedOrder.grandTotal}`, 'fullOrder');
  };

  if (!authChecked) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-900'>
        <div className='flex flex-col items-center gap-3'>
          <div className='animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full' />
          <p className='text-slate-400 font-medium text-sm'>Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order Management | Kino Mart Admin</title>
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <div className='min-h-screen bg-slate-900 flex flex-col text-slate-100'>

        {/* Fixed note hover popover */}
        {hoveredNote && (
          <div
            className='fixed z-[200] pointer-events-none'
            style={{ left: hoveredNote.x, top: hoveredNote.y, transform: 'translate(-50%, calc(-100% - 15px))' }}
          >
            <div className='bg-slate-700 border border-slate-600 rounded-xl p-3 shadow-2xl w-60 max-w-xs'>
              <p className='text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1.5'>Note</p>
              <p className='text-xs text-slate-200 leading-relaxed whitespace-pre-wrap'>{hoveredNote.text}</p>
              <div className='absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-slate-700' />
            </div>
          </div>
        )}

        {/* Header */}
        <header className='bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-20'>
          <div className='flex items-center gap-5'>
            <div className='flex items-center gap-2.5'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm'>G</div>
              <span className='font-black text-slate-100 tracking-tight hidden sm:block text-sm'>Kino Mart Admin</span>
            </div>
            <nav className='flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-700'>
              <Link href='/admin/orders' className='text-[11px] px-4 py-1.5 rounded-md bg-blue-600 text-white font-black uppercase tracking-wider'>Orders</Link>
              <Link href='/admin/admins' className='text-[11px] px-4 py-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors font-black uppercase tracking-wider'>Team</Link>
            </nav>
          </div>
          <div className='flex items-center gap-4'>
            <button
              onClick={fetchOrders}
              className='hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-[11px] font-black uppercase tracking-wider hover:bg-slate-600 transition-all group'
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              Reload
            </button>
            <div className='flex flex-col items-end leading-none gap-0.5'>
              <span className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>Admin</span>
              <span className='text-xs text-slate-300 font-mono'>{admin?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className='hidden md:flex items-center gap-2 text-[11px] font-black text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-all border border-red-500/20 uppercase tracking-wider'
            >
              Logout
            </button>
          </div>
        </header>

        <main className='p-4 sm:p-6 max-w-[1900px] mx-auto w-full flex-grow'>
          <div className='mb-5'>
            <h1 className='text-2xl font-black text-slate-100'>Order Management</h1>
            <p className='text-slate-500 text-sm mt-0.5'>Real-time control center.</p>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5'>
            {[
              { todayLabel: "Today's Orders",    todayVal: stats.today,          totalLabel: 'Total',    totalVal: stats.total,          color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    icon: FiCalendar    },
              { todayLabel: "Today's Pending",   todayVal: stats.pendingToday,   totalLabel: 'All Time', totalVal: stats.totalPending,   color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20',  icon: FiClock       },
              { todayLabel: "Today's Confirmed", todayVal: stats.confirmedToday, totalLabel: 'All Time', totalVal: stats.totalConfirmed, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: FiCheckCircle },
              { todayLabel: "Today's Cancelled", todayVal: stats.cancelledToday, totalLabel: 'All Time', totalVal: stats.totalCancelled, color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20',     icon: FiXCircle     },
            ].map((s, idx) => (
              <div key={idx} className={`bg-slate-800 p-4 rounded-2xl border ${s.border} flex items-center justify-between`}>
                <div>
                  <p className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5'>{s.todayLabel}</p>
                  <p className={`text-2xl font-black ${s.color} leading-none mb-1`}>{s.todayVal}</p>
                  <p className='text-[10px] text-slate-500'>{s.totalLabel}: <span className={`font-black ${s.color}`}>{s.totalVal}</span></p>
                </div>
                <div className={`${s.bg} ${s.color} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                  <s.icon className='w-5 h-5' />
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className='bg-slate-800 rounded-2xl border border-slate-700 p-5 mb-5'>
            <div className='flex items-center gap-2 mb-4 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-3'>
              <FiFilter className='w-3.5 h-3.5 text-blue-400' /> Filters
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4'>
              <div className='xl:col-span-2'>
                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block'>Search</label>
                <div className='relative'>
                  <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4' />
                  <input
                    type='text'
                    defaultValue={search}
                    onChange={handleSearchChange}
                    placeholder='Name, phone, order number...'
                    className='w-full text-sm bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-600 transition-colors'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-3 xl:col-span-2'>
                <div>
                  <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block'>Order Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className='w-full text-sm bg-slate-900 border border-slate-600 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 text-slate-200 transition-colors cursor-pointer'>
                    <option value=''>All</option>
                    <option value='pending'>⏳ Pending</option>
                    <option value='confirmed'>✅ Confirmed</option>
                    <option value='cancel'>❌ Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block'>Response</label>
                  <select value={responseFilter} onChange={(e) => setResponseFilter(e.target.value)} className='w-full text-sm bg-slate-900 border border-slate-600 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 text-slate-200 transition-colors cursor-pointer'>
                    <option value=''>All</option>
                    <option value='none'>⚪ Not Called</option>
                    <option value='called'>📞 Called</option>
                    <option value='number_off'>📵 Number Off</option>
                    <option value='did_not_pick'>🚫 Did Not Pick</option>
                    <option value='call_later'>🔔 Call Later</option>
                    <option value='fake_order'>⚠️ Fake Order</option>
                  </select>
                </div>
              </div>
              <div>
                <label className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block'>Date Range</label>
                <div className='flex gap-2 items-center'>
                  <div className='relative flex-1'>
                    <FiCalendar className='absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 w-3 h-3 pointer-events-none' />
                    <input type='date' value={fromDate} onChange={(e) => setFromDate(e.target.value)} className='w-full text-[10px] bg-slate-900 border border-slate-600 rounded-lg pl-7 pr-1 py-2.5 focus:outline-none focus:border-blue-500 text-slate-200 transition-colors' />
                  </div>
                  <span className='text-slate-600 shrink-0'>—</span>
                  <div className='relative flex-1'>
                    <FiCalendar className='absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 w-3 h-3 pointer-events-none' />
                    <input type='date' value={toDate} onChange={(e) => setToDate(e.target.value)} className='w-full text-[10px] bg-slate-900 border border-slate-600 rounded-lg pl-7 pr-1 py-2.5 focus:outline-none focus:border-blue-500 text-slate-200 transition-colors' />
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-4 pt-3 border-t border-slate-700 flex justify-end'>
              <button onClick={handleResetFilters} className='text-[11px] font-black text-slate-600 hover:text-slate-300 transition-colors uppercase tracking-widest flex items-center gap-1.5'>
                <FiTrash2 className='w-3 h-3' /> Reset Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className='bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left'>
                <thead>
                  <tr className='border-b border-slate-700 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/50'>
                    <th className='px-5 py-3.5'>Action</th>
                    <th className='px-5 py-3.5'>Status</th>
                    <th className='px-5 py-3.5'>Response</th>
                    <th className='px-5 py-3.5'>Customer</th>
                    <th className='px-5 py-3.5'>Shipping</th>
                    <th className='px-5 py-3.5'>Products</th>
                    <th className='px-5 py-3.5 text-right'>Revenue</th>
                    <th className='px-5 py-3.5'>Time</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-700/40'>
                  {loading ? (
                    <tr>
                      <td colSpan='7' className='py-28 text-center'>
                        <div className='flex flex-col items-center gap-3'>
                          <div className='animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full' />
                          <p className='text-slate-500 font-black text-[11px] uppercase tracking-widest animate-pulse'>Loading orders...</p>
                        </div>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan='7' className='py-28 text-center'>
                        <div className='flex flex-col items-center gap-3'>
                          <FiSearch className='w-8 h-8 text-slate-600' />
                          <p className='text-slate-400 font-bold'>No orders found</p>
                          <button onClick={handleResetFilters} className='mt-1 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors'>View All</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const response = RESPONSE_STATUS_CONFIG[order.responseStatus || 'null'];
                      const RespIcon = response.icon;
                      const status = order.orderStatus || 'pending';
                      const borderClass = ROW_BORDER[status];
                      const bgClass = ROW_STYLE[status]?.bg || '';
                      return (
                        <tr key={order._id} className={`border-l-4 ${borderClass} ${bgClass} hover:bg-slate-700/40 transition-colors`}>
                          {/* Action */}
                          <td className='px-5 py-4'>
                            <div className='flex items-center gap-2'>
                              <button
                                onClick={() => openUpdateModal(order)}
                                className='w-9 h-9 flex items-center justify-center bg-slate-700 border border-slate-600 rounded-xl text-slate-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all shrink-0'
                              >
                                <FiEdit3 className='w-4 h-4' />
                              </button>
                              {order.note && (
                                <button
                                  className='w-9 h-9 flex items-center justify-center bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 hover:bg-amber-500/20 transition-all shrink-0'
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setHoveredNote({ text: order.note, x: rect.left + rect.width / 2, y: rect.top });
                                  }}
                                  onMouseLeave={() => setHoveredNote(null)}
                                >
                                  <FiFileText className='w-4 h-4' />
                                </button>
                              )}
                            </div>
                          </td>
                          {/* Status */}
                          <td className='px-5 py-4'>
                            {(() => {
                              const st = ORDER_STATUS_CONFIG[status];
                              const Icon = st.icon;
                              return (
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${st.badge}`}>
                                  <Icon className='w-3 h-3' />
                                  {st.label}
                                </div>
                              );
                            })()}
                          </td>
                          {/* Response */}
                          <td className='px-5 py-4'>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${response.badge}`}>
                              <RespIcon className='w-3 h-3' />
                              {response.label}
                            </div>
                          </td>
                          {/* Customer */}
                          <td className='px-5 py-4'>
                            <div className='flex flex-col gap-0.5'>
                              <span className='font-bold text-slate-100 text-sm whitespace-nowrap'>{order.name}</span>
                              <a
                                href={`tel:${order.phone}`}
                                className='text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors'
                                onClick={(e) => e.stopPropagation()}
                              >
                                {formatPhone(order.phone)}
                              </a>
                            </div>
                          </td>
                          {/* Shipping */}
                          <td className='px-5 py-4 max-w-[200px]'>
                            <div className='flex flex-col gap-1'>
                              <span className='text-[10px] font-black uppercase text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 w-fit'>{order.deliveryZone || 'Standard'}</span>
                              <p className='text-xs text-slate-400 leading-relaxed'>{order.address}</p>
                            </div>
                          </td>
                          {/* Products */}
                          <td className='px-5 py-4'>
                            <div className='text-[11px] leading-snug'>{parseItems(order.items)}</div>
                          </td>
                          {/* Revenue */}
                          <td className='px-5 py-4 text-right'>
                            <div className='flex flex-col items-end'>
                              <span className='font-black text-slate-100 text-sm whitespace-nowrap'>৳{Number(order.grandTotal || 0).toLocaleString('en-BD')}</span>
                              <span className='text-[10px] text-slate-500 font-bold uppercase'>{parseItemQty(order.items)} pcs</span>
                            </div>
                          </td>
                          {/* Time */}
                          <td className='px-5 py-4'>
                            {(() => {
                              const t = formatOrderTime(order);
                              return (
                                <div className='flex flex-col gap-0.5'>
                                  <span className='text-xs font-bold text-slate-300 whitespace-nowrap'>{t.date}</span>
                                  <span className='text-[10px] text-slate-500 font-medium whitespace-nowrap'>{t.time}</span>
                                </div>
                              );
                            })()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='px-5 py-4 bg-slate-900/40 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3'>
                <div className='text-[11px] font-black text-slate-500 uppercase tracking-wider'>
                  Page <span className='text-blue-400'>{page}</span> of {totalPages} — {total} orders
                </div>
                <div className='flex items-center gap-1'>
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className='h-9 w-9 flex items-center justify-center rounded-lg bg-slate-700 border border-slate-600 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 disabled:opacity-30 disabled:pointer-events-none transition-all'>
                    <FiArrowLeft className='w-4 h-4' />
                  </button>
                  <div className='flex items-center gap-1 mx-1'>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => (
                      <button key={i + 1} onClick={() => setPage(i + 1)} className={`h-9 w-9 text-xs font-black rounded-lg transition-all ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-slate-700 border border-slate-600 text-slate-400 hover:bg-slate-600'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className='h-9 w-9 flex items-center justify-center rounded-lg bg-slate-700 border border-slate-600 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 disabled:opacity-30 disabled:pointer-events-none transition-all'>
                    <FiArrowRight className='w-4 h-4' />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Update Modal */}
        <Transition show={isUpdateModalOpen} as={Fragment}>
          <Dialog as='div' className='relative z-50' onClose={() => setIsUpdateModalOpen(false)}>
            <Transition.Child as={Fragment} enter='ease-out duration-200' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-150' leaveFrom='opacity-100' leaveTo='opacity-0'>
              <div className='fixed inset-0 bg-black/70 backdrop-blur-sm' />
            </Transition.Child>
            <div className='fixed inset-0 overflow-y-auto'>
              <div className='flex min-h-full items-center justify-center p-4'>
                <Transition.Child as={Fragment} enter='ease-out duration-200' enterFrom='opacity-0 scale-95' enterTo='opacity-100 scale-100' leave='ease-in duration-150' leaveFrom='opacity-100 scale-100' leaveTo='opacity-0 scale-95'>
                  <Dialog.Panel className='w-full max-w-2xl rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden'>
                    <div className='p-6'>
                      {/* Modal Header */}
                      <div className='flex items-start justify-between mb-5'>
                        <div>
                          <Dialog.Title as='h3' className='text-lg font-black text-slate-100'>Order Details</Dialog.Title>
                          <p className='text-[11px] font-black text-slate-500 uppercase tracking-wider mt-0.5'>#{selectedOrder?.orderId}</p>
                          {selectedOrder?.items && (() => {
                            try {
                              const items = JSON.parse(selectedOrder.items);
                              return (
                                <div className='mt-2 space-y-1'>
                                  {items.map((it, i) => {
                                    const variant = it.selectedColor || it.variant || '';
                                    return (
                                      <div key={i} className='flex items-baseline gap-2'>
                                        <span className='text-xs text-slate-300 font-medium'>{it.title || it.name || 'Item'}</span>
                                        <div className='flex items-center gap-1 shrink-0'>
                                          <span className='text-[10px] text-slate-500'>×</span>
                                          <span className='text-xs font-black text-blue-400'>{it.quantity || 1}</span>
                                        </div>
                                        {variant && <span className='text-[10px] text-slate-500 font-bold uppercase tracking-tighter'>({variant})</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            } catch { return null; }
                          })()}
                        </div>
                        <button onClick={() => setIsUpdateModalOpen(false)} className='w-9 h-9 rounded-xl bg-slate-700 text-slate-400 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all shrink-0'>
                          <FiXCircle className='w-5 h-5' />
                        </button>
                      </div>

                      {/* Customer Info Table */}
                      <div className='bg-slate-900/60 rounded-xl border border-slate-700 overflow-hidden mb-5'>
                        <table className='w-full text-sm'>
                          <tbody className='divide-y divide-slate-700/50'>
                            {[
                              { label: 'Name',    value: selectedOrder?.name,              raw: selectedOrder?.name,    key: 'name'    },
                              { label: 'Phone',   value: formatPhone(selectedOrder?.phone), raw: selectedOrder?.phone,   key: 'phone'   },
                              { label: 'Address', value: selectedOrder?.address,            raw: selectedOrder?.address, key: 'address' },
                              { label: 'Total',   value: `৳${selectedOrder?.grandTotal}`,  raw: `৳${selectedOrder?.grandTotal}`, key: 'price' },
                            ].map((field) => (
                              <tr key={field.key}>
                                <td className='px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider w-20 border-r border-slate-700/50 shrink-0'>{field.label}</td>
                                <td className='px-4 py-3'>
                                  <div className='flex items-center justify-between gap-3'>
                                    {field.key === 'phone' ? (
                                      <a href={`tel:${selectedOrder?.phone}`} className='text-blue-400 hover:text-blue-300 font-medium transition-colors text-sm'>{field.value}</a>
                                    ) : (
                                      <span className='text-slate-200 font-medium text-sm'>{field.value}</span>
                                    )}
                                    <button
                                      onClick={() => copyToClipboard(field.raw, field.key)}
                                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 ${copyFeedback[field.key] ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-600'}`}
                                    >
                                      {copyFeedback[field.key] ? <><FiCheckCircle className='w-3 h-3' />Copied</> : <><FiCopy className='w-3 h-3' />Copy</>}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Status Controls */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
                        {/* Order Status */}
                        <div>
                          <h4 className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2'>
                            <span className='w-1 h-3.5 bg-blue-500 rounded-full inline-block' /> Order Status
                          </h4>
                          <div className='flex flex-col gap-2'>
                            {['pending', 'confirmed', 'cancel'].map((st) => {
                              const config = ORDER_STATUS_CONFIG[st];
                              const isActive = selectedOrder?.orderStatus === st;
                              return (
                                <button
                                  key={st}
                                  onClick={() => handleStatusUpdate('orderStatus', st)}
                                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-wider ${isActive ? `${config.btn} border-transparent text-white` : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-200'}`}
                                >
                                  <div className='flex items-center gap-2'><config.icon className='w-4 h-4' />{config.label}</div>
                                  {isActive && <FiCheckCircle className='w-4 h-4 shrink-0' />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Call Status */}
                        <div>
                          <h4 className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2'>
                            <span className='w-1 h-3.5 bg-green-500 rounded-full inline-block' /> Call Status
                          </h4>
                          <div className='flex flex-col gap-2'>
                            {[
                              { val: 'null',         label: 'Not Called',     icon: FiClock,       btn: 'bg-slate-600 hover:bg-slate-700'      },
                              { val: 'called',       label: 'Call Success',   icon: FiPhone,       btn: 'bg-emerald-600 hover:bg-emerald-700'   },
                              { val: 'number_off',   label: 'Number Off',     icon: FiPhoneOff,    btn: 'bg-orange-600 hover:bg-orange-700'     },
                              { val: 'did_not_pick', label: 'Did Not Pick',   icon: FiPhoneMissed, btn: 'bg-red-600 hover:bg-red-700'           },
                              { val: 'call_later',   label: 'Call Later',     icon: FiPhoneCall,   btn: 'bg-violet-600 hover:bg-violet-700'     },
                              { val: 'fake_order',   label: 'Fake Order',     icon: FiAlertTriangle, btn: 'bg-orange-600 hover:bg-orange-700'     },
                            ].map((resp) => {
                              const isActive = (selectedOrder?.responseStatus === null && resp.val === 'null') || selectedOrder?.responseStatus === resp.val;
                              return (
                                <button
                                  key={resp.val}
                                  onClick={() => handleStatusUpdate('responseStatus', resp.val === 'null' ? null : resp.val)}
                                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-wider ${isActive ? `${resp.btn} border-transparent text-white` : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-200'}`}
                                >
                                  <div className='flex items-center gap-2'><resp.icon className='w-4 h-4' />{resp.label}</div>
                                  {isActive && <FiCheckCircle className='w-4 h-4 shrink-0' />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Note Field */}
                      <div className='mb-5'>
                        <h4 className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2'>
                          <span className='w-1 h-3.5 bg-amber-500 rounded-full inline-block' /> Order Note
                        </h4>
                        <textarea
                          value={noteValue}
                          onChange={(e) => setNoteValue(e.target.value)}
                          placeholder='Add a note for this order...'
                          rows={3}
                          className='w-full bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 transition-colors resize-none'
                        />
                        <button
                          onClick={handleSaveNote}
                          disabled={savingNote}
                          className='mt-2 px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5'
                        >
                          <FiFileText className='w-3.5 h-3.5' />
                          {savingNote ? 'Saving...' : 'Save Note'}
                        </button>
                      </div>

                      {/* Footer Actions */}
                      <div className='flex gap-3 pt-2 border-t border-slate-700'>
                        <button
                          onClick={copyFullOrder}
                          className={`flex-1 py-3 rounded-xl border-2 font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${copyFeedback.fullOrder ? 'bg-slate-600 border-slate-600 text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white'}`}
                        >
                          {copyFeedback.fullOrder ? <FiCheckCircle className='text-emerald-400 w-4 h-4' /> : <FiCopy className='w-4 h-4' />}
                          {copyFeedback.fullOrder ? 'Copied!' : 'Copy Order'}
                        </button>
                        <button onClick={() => setIsUpdateModalOpen(false)} className='px-6 py-3 bg-blue-600/15 border border-blue-500/30 rounded-xl text-blue-400 text-[11px] font-black uppercase tracking-widest hover:bg-blue-600/25 transition-all'>
                          Close
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Toast */}
        <Transition show={!!toast} as={Fragment} enter='transform ease-out duration-300 transition' enterFrom='translate-y-2 opacity-0' enterTo='translate-y-0 opacity-100' leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
          <div className='fixed bottom-5 right-5 z-[60] flex items-center gap-3 bg-slate-700 border border-slate-600 text-slate-100 px-5 py-3.5 rounded-xl shadow-2xl'>
            <FiCheckCircle className='text-emerald-400 w-5 h-5 shrink-0' />
            <span className='text-sm font-bold'>{toast}</span>
          </div>
        </Transition>
      </div>
    </>
  );
}
