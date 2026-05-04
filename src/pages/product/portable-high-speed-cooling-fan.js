import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from '@/components/common/Navbar';
import { products } from '@/utils/products';
import { addToCart } from '@/store/cartSlice';
import { useCartDialog } from '@/context/CartDialogContext';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import Head from 'next/head';

const productData = products.find(
  (p) => p.slug === 'portable-high-speed-cooling-fan',
);

/* ─── helpers ─── */
const StarIcon = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-amber-400' : 'text-gray-300'}`}
    fill='currentColor'
    viewBox='0 0 20 20'
  >
    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
  </svg>
);

const REVIEW_IMGS = [
  '/assets/product/fan/review1.jpeg',
  // '/assets/product/fan/review2.jpeg',
  '/assets/product/fan/review3.jpeg',
  '/assets/product/fan/review4.jpeg',
  '/assets/product/fan/review5.jpeg',
];

const DESC_IMGS = [
  'desc-1.jpeg',
  'desc-2.jpeg',
  'desc3.jpg',
  'desc-4.jpeg',
  'desc-5.jpeg',
  'desc-6.jpeg',
];

function CountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, Math.floor((midnight - now) / 1000));
      setTimeLeft({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div
      className='rounded-xl px-4 py-3 my-3'
      style={{
        background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
        border: '1.5px solid #fed7aa',
      }}
    >
      <p className='bangla text-sm font-semibold text-center text-orange-700 mb-2'>
        ⏰ অফার টি চলবে আর
      </p>
      <div className='flex items-center justify-center gap-2'>
        {[
          { val: pad(timeLeft.h), label: 'ঘণ্টা' },
          { val: pad(timeLeft.m), label: 'মিনিট' },
          { val: pad(timeLeft.s), label: 'সেকেন্ড' },
        ].map((unit, i) => (
          <React.Fragment key={unit.label}>
            {i > 0 && (
              <span className='text-orange-500 font-black text-2xl leading-none mb-4'>
                :
              </span>
            )}
            <div className='flex flex-col items-center'>
              <span
                className='countdown-digit font-mono font-extrabold text-lg px-3 py-1.5 rounded-lg min-w-[44px] text-center shadow-md text-white'
                style={{
                  background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                }}
              >
                {unit.val}
              </span>
              <span className='text-[10px] text-orange-600 bangla mt-1 font-medium'>
                {unit.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ─── Review Slider ─── */
const ReviewSlider = ({ handleBuyNow, product }) => {
  const [cur, setCur] = useState(0);
  const timer = useRef(null);
  const total = REVIEW_IMGS.length;

  const restart = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setCur((c) => (c + 1) % total), 3500);
  };

  useEffect(() => {
    restart();
    return () => clearInterval(timer.current);
  }, []);

  const goTo = (i) => {
    setCur((i + total) % total);
    restart();
  };

  return (
    <div className='bg-gradient-to-b from-slate-50 to-white py-16'>
      <div className='container mx-auto px-4 lg:px-8'>
        {/* header */}
        <div className='text-center mb-10'>
          <span
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            className='text-white text-xs font-semibold px-4 py-1.5 rounded-full bangla inline-block'
          >
            গ্রাহক রিভিউ
          </span>
          <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 mb-2 bangla'>
            আমাদের গ্রাহকরা কী বলছেন?
          </h2>
          <div className='w-16 h-1 bg-indigo-500 rounded-full mx-auto mb-4'></div>
          <div className='flex items-center justify-center gap-2'>
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon key={s} filled />
            ))}
            <span className='text-gray-500 bangla text-sm ml-1'>
              4.9 · 128টি রিভিউ
            </span>
          </div>
        </div>

        {/* slider */}
        <div className='relative max-w-md mx-auto select-none'>
          {/* square frame */}
          <div
            className='relative w-full rounded overflow-hidden shadow-2xl bg-gray-100'
            style={{ paddingBottom: '100%' }}
          >
            {REVIEW_IMGS.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`রিভিউ ${i + 1}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: i === cur ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                }}
              />
            ))}
            {/* arrows */}
            <button
              onClick={() => goTo(cur - 1)}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
              }}
              className='bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
            <button
              onClick={() => goTo(cur + 1)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
              }}
              className='bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
          </div>

          {/* dots */}
          <div className='flex justify-center gap-2 mt-5'>
            {REVIEW_IMGS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className='rounded-full transition-all duration-300'
                style={{
                  width: i === cur ? 24 : 10,
                  height: 10,
                  backgroundColor: i === cur ? '#6366f1' : '#d1d5db',
                }}
              />
            ))}
          </div>

          {/* square thumbnails */}
          <div className='flex justify-center gap-3 mt-4'>
            {REVIEW_IMGS.map((src, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className='rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200'
                style={{
                  width: 56,
                  height: 56,
                  opacity: i === cur ? 1 : 0.45,
                  outline: i === cur ? '2px solid #6366f1' : 'none',
                  outlineOffset: 2,
                }}
              >
                <img
                  src={src}
                  alt=''
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className='text-center mt-14'>
          <div
            className='rounded p-10 max-w-2xl mx-auto shadow-xl'
            style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}
          >
            <h3 className='text-white text-2xl font-extrabold bangla mb-2'>
              আজই অর্ডার করুন!
            </h3>
            <p className='text-indigo-200 bangla text-sm mb-6'>
              সীমিত স্টক — দেরি না করে এখনই নিশ্চিত করুন আপনার অর্ডার
            </p>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className='bg-white text-indigo-600 font-extrabold bangla px-10 py-4 rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:scale-105 shadow-md'
            >
              {product.inStock ? `৳${product.price} — এখনই কিনুন` : 'স্টক শেষ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ─── */
const ProductDetails = ({ initialProduct }) => {
  const dispatch = useDispatch();
  const { openDialog } = useCartDialog();
  const viewItemFired = useRef(false);
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (viewItemFired.current) return;
    viewItemFired.current = true;
    if (initialProduct) {
      setProduct(initialProduct);
      setSelectedColor(initialProduct.variants[0]?.color || '');
      setActiveImage(initialProduct.images[0] || '');
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          items: [
            {
              item_id: initialProduct.id || 'unknown',
              item_name: initialProduct.title || 'unknown',
              price: initialProduct.price || 0,
              original_price: initialProduct.originalPrice || 0,
              item_category: 'Electronics',
              item_variant:
                initialProduct.variants?.map((v) => v.color).join(', ') ||
                'unknown',
            },
          ],
          currency: 'BDT',
          value: initialProduct.price || 0,
        },
      });
    }
  }, [initialProduct]);

  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < 100) setQuantity(quantity + 1);
    else if (type === 'decrement' && quantity > 1) setQuantity(quantity - 1);
  };

  const handleBuyNow = () => {
    if (!product) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'BDT',
        value: product.price * quantity || 0,
        items: [
          {
            item_id: product.id || 'unknown',
            item_name: product.title || 'unknown',
            price: product.price || 0,
            original_price: product.originalPrice || 0,
            item_category: 'Wearables',
            item_variant: selectedColor || 'unknown',
            quantity: quantity || 1,
          },
        ],
      },
    });
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        selectedColor,
        quantity,
        image: activeImage,
      }),
    );
    openDialog();
  };

  if (!product) return <div>Product not found</div>;

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <>
      <Head>
        <title>{product.title} | Kino Mart</title>
        <meta
          name='description'
          content={`Buy the ${product.title} at Kino Mart. ${product.description}`}
        />
        <meta
          name='keywords'
          content={`portable fan, cooling gadget, ${product.title}, mini fan, ${product.variants.map((v) => v.color).join(', ')}, USB fan`}
        />
        <meta name='author' content='Kino Mart' />
        <meta name='robots' content='index, follow' />
        <link
          rel='canonical'
          href={`https://www.kinomart.store/product/${product.slug}`}
        />
        <meta property='og:title' content={`${product.title} | Kino Mart`} />
        <meta property='og:description' content={product.description} />
        <meta property='og:type' content='product' />
        <meta
          property='og:image'
          content={
            product.images[0] ||
            'https://www.kinomart.store/assets/footer-logo.jpeg'
          }
        />
        <meta
          property='og:url'
          content={`https://www.kinomart.store/product/${product.slug}`}
        />
        <meta property='og:site_name' content='Kino Mart' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={`${product.title} | Kino Mart`} />
        <meta name='twitter:description' content={product.description} />
        <meta
          name='twitter:image'
          content={
            product.images[0] ||
            'https://www.kinomart.store/assets/footer-logo.jpeg'
          }
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'Product',
              name: product.title,
              image: product.images,
              description: product.description,
              sku: product.id,
              brand: { '@type': 'Brand', name: 'Kino Mart' },
              offers: {
                '@type': 'Offer',
                url: `https://www.kinomart.store/product/${product.slug}`,
                priceCurrency: 'BDT',
                price: product.price,
                availability: product.inStock
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition',
              },
            }),
          }}
        />
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
        .bangla {
          font-family: 'Hind Siliguri', sans-serif;
        }
        .img-zoom {
          transition: transform 0.5s ease;
        }
        .img-zoom:hover {
          transform: scale(1.03);
        }
        .thumb-sel {
          border: 2.5px solid #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        .thumb-unsel {
          border: 2px solid transparent;
          opacity: 0.65;
        }
        .thumb-unsel:hover {
          opacity: 1;
          border-color: #c7d2fe;
        }
        .btn-buy {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }
        .btn-buy:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
        }
        .feature-card {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }
        @keyframes offer-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.88;
          }
        }
        .offer-banner {
          animation: offer-pulse 2.2s ease-in-out infinite;
        }
        @keyframes digit-pop {
          0% {
            transform: scale(1.18);
          }
          100% {
            transform: scale(1);
          }
        }
        .countdown-digit {
          animation: digit-pop 0.15s ease-out;
        }
        .fixed-offer-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          animation: offer-pulse 2.2s ease-in-out infinite;
        }
      `}</style>

      <Navbar />

      {/* Offer Banner — sticky below navbar */}
      <div
        className='offer-banner sticky top-0 z-40 py-2.5 px-4 text-center'
        style={{
          background:
            'linear-gradient(90deg, #7c3aed 0%, #4f46e5 50%, #7c3aed 100%)',
          borderBottom: '2px solid #6d28d9',
        }}
      >
        <p className='text-white font-bold bangla text-sm md:text-base tracking-wide drop-shadow'>
          🎉 {discount}% ডিস্কাউন্ট পাচ্ছেন শুধু আজকের জন্য 🎉
        </p>
      </div>

      {/* ── Hero ── */}
      <div className='bg-gradient-to-b from-slate-50 to-white'>
        <div className='container mx-auto px-4 lg:px-8 py-10'>
          <div className='bg-white rounded shadow-xl overflow-hidden'>
            <div className='flex flex-col lg:flex-row'>
              {/* Images */}
              <div className='w-full lg:w-[58%] p-5 md:p-8'>
                <div className='flex flex-col md:grid md:grid-cols-4 gap-4'>
                  {/* main */}
                  <div className='md:col-span-3 overflow-hidden rounded-2xl bg-gray-50'>
                    <img
                      className='w-full h-[360px] md:h-[520px] object-cover img-zoom'
                      src={activeImage}
                      alt={product.title}
                    />
                  </div>
                  {/* desktop thumbs */}
                  <div className='hidden md:flex flex-col gap-3'>
                    {product.images.slice(0, 4).map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveImage(img)}
                        className={`overflow-hidden rounded-xl cursor-pointer transition-all duration-200 ${activeImage === img ? 'thumb-sel' : 'thumb-unsel'}`}
                      >
                        <img
                          src={img}
                          alt={`thumb ${i + 1}`}
                          className='w-full h-[155px] object-cover'
                        />
                      </div>
                    ))}
                  </div>
                  {/* mobile thumbs */}
                  <div className='flex md:hidden justify-center gap-2 mt-2'>
                    {product.images.slice(0, 4).map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveImage(img)}
                        className={`overflow-hidden rounded-lg cursor-pointer transition-all duration-200 ${activeImage === img ? 'thumb-sel' : 'thumb-unsel'}`}
                      >
                        <img
                          src={img}
                          alt={`thumb ${i + 1}`}
                          className='w-[72px] h-[72px] object-cover'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className='w-full lg:w-[42%] px-6 md:px-10 py-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-100'>
                <div className='inline-flex items-center gap-2 mb-4'>
                  <span
                    style={{
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    }}
                    className='text-white text-xs font-semibold px-3 py-1 rounded-full'
                  >
                    ★ বেস্টসেলার
                  </span>
                  <span className='bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full'>
                    স্টকে আছে
                  </span>
                </div>

                <h1 className='text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3'>
                  {product.title}
                </h1>

                <div className='flex items-center gap-2 mb-5'>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} filled />
                  ))}
                  <span className='text-sm text-gray-500 bangla'>
                    (4.9 · 128টি রিভিউ)
                  </span>
                </div>

                {/* countdown timer */}
                <CountdownToMidnight />

                {/* price */}
                <div className='flex items-end gap-3 mb-6'>
                  <span className='text-4xl font-extrabold text-indigo-600'>
                    ৳{product.price.toFixed(0)}
                  </span>
                  <span className='text-xl text-gray-400 line-through mb-1'>
                    ৳{product.originalPrice.toFixed(0)}
                  </span>
                  <span className='bg-rose-100 text-rose-600 text-sm font-bold px-2 py-0.5 rounded-lg mb-1'>
                    {product.originalPrice.toFixed(0) -
                      product.price.toFixed(0)}{' '}
                    টাকা ছাড়
                  </span>
                </div>

                {/* color */}
                <div className='mb-6'>
                  <p className='text-sm font-semibold text-gray-700 mb-3 bangla'>
                    রঙ বেছে নিন:{' '}
                    <span className='text-indigo-600 font-bold'>
                      {selectedColor}
                    </span>
                  </p>
                  <div className='flex items-center gap-3 flex-wrap'>
                    {product.variants.map((v) => {
                      const lc = v.color.toLowerCase();
                      const bg = lc === 'beige' ? '#d4b896' : lc;
                      const isWhite = lc === 'white';
                      const isSelected = selectedColor === v.color;
                      return (
                        <button
                          key={v.color}
                          title={v.color}
                          onClick={() => setSelectedColor(v.color)}
                          style={{
                            backgroundColor: bg,
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            border: isWhite
                              ? '2px solid #9ca3af'
                              : '2px solid transparent',
                            outline: isSelected ? '3px solid #6366f1' : 'none',
                            outlineOffset: 3,
                            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* qty + buy */}
                <div className='flex items-center gap-3 mb-6'>
                  <div className='flex items-center border-2 border-gray-200 rounded-xl overflow-hidden'>
                    <button
                      onClick={() => handleQuantityChange('decrement')}
                      className='px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg'
                    >
                      −
                    </button>
                    <span className='px-5 py-3 font-semibold text-gray-800 min-w-[48px] text-center'>
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increment')}
                      className='px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg'
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className='btn-buy flex-1 text-white font-bold py-3.5 rounded-xl text-sm tracking-wide bangla'
                  >
                    {product.inStock ? 'এখনই কিনুন' : 'স্টক শেষ'}
                  </button>
                </div>

                {/* perks */}
                <div className='grid grid-cols-2 gap-3 pt-5 border-t border-gray-100'>
                  {[
                    { icon: '🚀', text: 'দ্রুত ডেলিভারি' },
                    { icon: '🔒', text: 'ক্যাশ অন ডেলিভারি' },
                    { icon: '🔄', text: '6 মাসের সার্ভিস ওয়ারেন্টি ' },
                    { icon: '🎁', text: 'বিশেষ অফার' },
                  ].map((p) => (
                    <div key={p.text} className='flex items-center gap-2'>
                      <span className='text-lg'>{p.icon}</span>
                      <span className='text-xs text-gray-500 bangla font-medium'>
                        {p.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desc Images: mobile=vertical, md+=3-col grid ── */}
      <div className='w-full'>
        {/* mobile */}
        <div className='flex flex-col md:hidden'>
          {DESC_IMGS.map((f, i) => (
            <div key={i} className='overflow-hidden'>
              <img
                src={`/assets/product/fan/${f}`}
                alt={`বিবরণ ${i + 1}`}
                className='w-full object-cover block'
              />
            </div>
          ))}
        </div>
        {/* md+ grid */}
        <div className='hidden md:grid md:grid-cols-3'>
          {DESC_IMGS.map((f, i) => (
            <div key={i} className='overflow-hidden'>
              <img
                src={`/assets/product/fan/${f}`}
                alt={`বিবরণ ${i + 1}`}
                className='w-full h-full object-cover block img-zoom'
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Product Description ── */}
      <div className='bg-gradient-to-b from-white to-slate-50 py-16'>
        <div className='container mx-auto px-4 lg:px-8 max-w-4xl'>
          <div className='text-center mb-12'>
            <span
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              className='text-white text-xs font-semibold px-4 py-1.5 rounded-full bangla inline-block'
            >
              পণ্যের বিবরণ
            </span>
            <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 mb-3 bangla'>
              কেন এই ফ্যানটি আপনার জন্য পারফেক্ট?
            </h2>
            <div className='w-16 h-1 bg-indigo-500 rounded-full mx-auto'></div>
          </div>

          <div className='bg-white rounded shadow-md p-8 md:p-12 mb-8'>
            <p className='text-gray-700 bangla text-lg leading-relaxed mb-5'>
              গরমের দিনে স্বস্তির নিঃশ্বাস নিন —{' '}
              <strong className='text-indigo-600'>
                JF132 মিনি পোর্টেবল কুলিং ফ্যান
              </strong>{' '}
              আপনার সেরা সঙ্গী। মুহূর্তের মধ্যে ঠান্ডা বাতাস দেওয়ার অত্যাধুনিক
              প্রযুক্তি দিয়ে তৈরি এই ফ্যানটি তীব্র গরমেও আপনাকে রাখবে সতেজ ও
              শান্ত।
            </p>
            <p className='text-gray-700 bangla text-lg leading-relaxed mb-5'>
              মাত্র <strong>183.6 গ্রাম</strong> ওজনের এই ফ্যান — যা আপনার
              স্মার্টফোনের চেয়েও হালকা — অনায়াসে ব্যাগে বা পকেটে রাখা যায়।
              অফিস, ভ্রমণ, বাজার বা বাড়িতে যেখানেই থাকুন, এটি আপনার সাথেই
              থাকবে।
            </p>
            <p className='text-gray-700 bangla text-lg leading-relaxed'>
              <strong>প্রিমিয়াম ABS ও অ্যালুমিনিয়াম অ্যালয়</strong> দিয়ে
              তৈরি এই ফ্যানটি টেকসই এবং দেখতে অত্যন্ত স্টাইলিশ। ছয়টি আকর্ষণীয়
              রঙের বিকল্প থেকে আপনার পছন্দের রঙটি বেছে নিন।
            </p>
          </div>

          {/* feature cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-8'>
            {[
              {
                icon: '❄️',
                title: 'তাৎক্ষণিক শীতলতা',
                desc: 'অত্যাধুনিক কুলিং প্রযুক্তি মাত্র কয়েক সেকেন্ডে পাওয়ারফুল ঠান্ডা বাতাস তৈরি করে।',
                bg: 'bg-blue-50',
                ibg: 'bg-blue-100',
              },
              {
                icon: '🎒',
                title: 'অতি-হালকা ও বহনযোগ্য',
                desc: 'মাত্র 183.6 গ্রাম ওজন — যেকোনো জায়গায় নিয়ে যান অনায়াসে।',
                bg: 'bg-purple-50',
                ibg: 'bg-purple-100',
              },
              {
                icon: '🔋',
                title: 'দীর্ঘস্থায়ী ব্যাটারি',
                desc: 'একবার চার্জে 7-8 ঘণ্টা অবিরাম ঠান্ডা বাতাস উপভোগ করুন।',
                bg: 'bg-emerald-50',
                ibg: 'bg-emerald-100',
              },
              {
                icon: '🤫',
                title: 'নীরব অপারেশন',
                desc: 'হুইসপার-কোয়েট মোটর প্রযুক্তি — পড়াশোনা বা ঘুমের সময়েও কোনো শব্দ নেই।',
                bg: 'bg-amber-50',
                ibg: 'bg-amber-100',
              },
              {
                icon: '⚙️',
                title: 'কাস্টমাইজড স্পিড',
                desc: '0 থেকে 200 পর্যন্ত অ্যাডজাস্টেবল স্পিড সেটিং — আপনার মতো করে কনফিগার করুন।',
                bg: 'bg-rose-50',
                ibg: 'bg-rose-100',
              },
              {
                icon: '🔌',
                title: 'USB-C দ্রুত চার্জিং',
                desc: 'আধুনিক USB-C পোর্ট দিয়ে দ্রুত ও সহজে যেকোনো জায়গা থেকে চার্জ করুন।',
                bg: 'bg-indigo-50',
                ibg: 'bg-indigo-100',
              },
            ].map((f) => (
              <div
                key={f.title}
                className={`feature-card ${f.bg} rounded-2xl p-6 flex gap-4 items-start`}
              >
                <div
                  className={`${f.ibg} rounded-xl p-3 text-2xl flex-shrink-0`}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 bangla text-base mb-1'>
                    {f.title}
                  </h3>
                  <p className='text-gray-600 bangla text-sm leading-relaxed'>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* specs */}
          <div className='bg-white rounded shadow-md overflow-hidden'>
            <div
              className='px-8 py-5'
              style={{
                background: 'linear-gradient(to right,#6366f1,#7c3aed)',
              }}
            >
              <h3 className='text-white font-bold text-lg bangla'>
                পণ্যের স্পেসিফিকেশন
              </h3>
            </div>
            <div className='divide-y divide-gray-100'>
              {[
                { l: 'মডেল', v: 'JF132 মিনি পোর্টেবল কুলিং ফ্যান' },
                { l: 'উপাদান', v: 'প্রিমিয়াম ABS + অ্যালুমিনিয়াম অ্যালয়' },
                { l: 'ওজন', v: '183.6 গ্রাম' },
                { l: 'ব্যাটারি লাইফ', v: '7–8 ঘণ্টা' },
                { l: 'চার্জিং পোর্ট', v: 'USB-C' },
                { l: 'স্পিড রেঞ্জ', v: '0 – 200 লেভেল' },
                { l: 'রঙের বিকল্প', v: 'কালো, সাদা, ধূসর, গোলাপি, নীল, বেইজ' },
                // { l: 'গ্যারান্টি', v: '30 দিনের রিটার্ন পলিসি' },
              ].map((row, i) => (
                <div
                  key={row.l}
                  className={`flex px-8 py-4 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <span className='w-40 text-sm font-semibold text-gray-500 bangla'>
                    {row.l}
                  </span>
                  <span className='text-sm text-gray-800 bangla font-medium'>
                    {row.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Video ── */}
      <div className='bg-slate-900 py-16'>
        <div className='container mx-auto px-4 lg:px-8 max-w-3xl text-center'>
          <span className='text-indigo-400 text-xs font-semibold uppercase tracking-widest bangla'>
            ব্যবহার নির্দেশিকা
          </span>
          <h2 className='text-3xl font-extrabold text-white mt-3 mb-2 bangla'>
            কীভাবে ব্যবহার করবেন?
          </h2>
          <p className='text-slate-400 bangla mb-8 text-sm'>
            নিচের ভিডিওটি দেখুন এবং সহজেই পণ্যটি সেট আপ করুন
          </p>
          <div className='rounded-2xl overflow-hidden shadow-2xl'>
            <video
              className='w-full'
              controls
              poster='/assets/product/fan/userguide.jpg'
            >
              <source
                src='/assets/product/fan/userguide.mp4'
                type='video/mp4'
              />
            </video>
          </div>
        </div>
      </div>

      {/* ── Reviews Slider ── */}
      <ReviewSlider handleBuyNow={handleBuyNow} product={product} />

      {/* Extra bottom padding so fixed bar doesn't overlap footer */}
      <div className='pb-16' />

      <Footer />

      {/* Fixed bottom offer bar */}
      <div
        className='fixed-offer-bar py-3 px-4'
        style={{
          background:
            'linear-gradient(90deg, #ea580c 0%, #c2410c 50%, #ea580c 100%)',
          borderTop: '2px solid #9a3412',
        }}
      >
        <div className='flex items-center justify-between max-w-4xl mx-auto gap-3'>
          <p className='text-white font-bold bangla text-sm md:text-base'>
            🔥 সীমিত সময়ের অফার! আজই {discount}% ছাড়ে কিনুন
          </p>
          <button
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className='flex-shrink-0 bg-white text-orange-600 font-extrabold bangla px-5 py-2 rounded-lg text-sm hover:bg-orange-50 transition-all duration-200 shadow-md disabled:opacity-70'
          >
            {product.inStock ? 'এখনই কিনুন →' : 'স্টক শেষ'}
          </button>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  if (!productData) return { notFound: true };
  return { props: { initialProduct: productData } };
}

export default ProductDetails;
