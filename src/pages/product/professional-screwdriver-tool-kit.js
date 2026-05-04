import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from '@/components/common/Navbar';
import Related from '@/components/checkout/Related';
import { products } from '@/utils/products';
import { addToCart } from '@/store/cartSlice';
import { useCartDialog } from '@/context/CartDialogContext';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import Head from 'next/head';

const productData = products.find(
  (p) => p.slug === 'professional-screwdriver-tool-kit',
);

const StarIcon = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-amber-400' : 'text-gray-300'}`}
    fill='currentColor'
    viewBox='0 0 20 20'
  >
    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
  </svg>
);

const DESC_IMGS = ['main2.jpg', 'main3.jpg', 'main4.jpg', 'main.jpg'];

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
      setSelectedColor(initialProduct.variants?.[0]?.color || '');
      setActiveImage(initialProduct.images?.[0] || '');

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: 'BDT',
          value: initialProduct.price || 0,
          items: [
            {
              item_id: initialProduct.id || 'unknown',
              item_name: initialProduct.title || 'unknown',
              price: initialProduct.price || 0,
              original_price: initialProduct.originalPrice || 0,
              item_category: 'Tools & Hardware',
              item_variant: initialProduct.variants?.[0]?.color || 'unknown',
            },
          ],
        },
      });
    }
  }, [initialProduct]);

  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < 999) setQuantity(quantity + 1);
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
            item_category: 'Tools & Hardware',
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
        <title>{product.title} | Buy Online in Bangladesh | Sheii Shop</title>
        <meta
          name='description'
          content={`বাংলাদেশে সেরা দামে ${product.title} কিনুন। 110টি বিট সহ CR-V ম্যাগনেটিক স্ক্রু ড্রাইভার সেট — কম্পিউটার রিপেয়ার ও DIY কাজের জন্য পারফেক্ট টুলকিট।`}
        />
        <meta
          name='keywords'
          content='screwdriver set Bangladesh, 110 in 1 tool kit, magnetic screwdriver BD, DIY repair tool set, computer repair kit price Bangladesh, professional tool kit'
        />
        <meta name='robots' content='index, follow' />
        <meta name='author' content='Sheii Shop' />
        <link
          rel='canonical'
          href={`https://www.kinomart.store/product/${product.slug}`}
        />
        <meta property='og:type' content='product' />
        <meta property='og:title' content={`${product.title} | Sheii Shop`} />
        <meta property='og:description' content={product.description} />
        <meta
          property='og:image'
          content={
            product.images?.[0] ||
            'https://www.kinomart.store/assets/footer-logo.jpeg'
          }
        />
        <meta
          property='og:url'
          content={`https://www.kinomart.store/product/${product.slug}`}
        />
        <meta property='og:site_name' content='Sheii Shop' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={`${product.title} | Sheii Shop`} />
        <meta name='twitter:description' content={product.description} />
        <meta
          name='twitter:image'
          content={
            product.images?.[0] ||
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
              brand: { '@type': 'Brand', name: 'Kingsdun' },
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
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <div className='bg-gradient-to-b from-slate-50 to-white'>
        <div className='container mx-auto px-4 lg:px-8 py-10'>
          <div className='bg-white rounded shadow-xl overflow-hidden'>
            <div className='flex flex-col lg:flex-row'>
              {/* Images */}
              <div className='w-full lg:w-[58%] p-5 md:p-8'>
                <div className='flex flex-col md:grid md:grid-cols-4 gap-4'>
                  {/* main image */}
                  <div className='md:col-span-3 overflow-hidden rounded-2xl bg-gray-50'>
                    <img
                      className='w-full h-[360px] md:h-[520px] object-cover img-zoom'
                      src={activeImage}
                      alt={product.title}
                    />
                  </div>
                  {/* desktop thumbs */}
                  <div className='hidden md:flex flex-col gap-3'>
                    {product.images.slice(0, 3).map((img, i) => (
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
                  {product.inStock ? (
                    <span className='bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full bangla'>
                      স্টকে আছে
                    </span>
                  ) : (
                    <span className='bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full bangla'>
                      স্টক শেষ
                    </span>
                  )}
                </div>

                <h1 className='text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3 bangla'>
                  {product.title}
                </h1>

                <div className='flex items-center gap-2 mb-3'>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} filled />
                  ))}
                  <span className='text-sm text-gray-500 bangla'>
                    (4.8 · 96টি রিভিউ)
                  </span>
                </div>

                <p className='text-gray-600 bangla text-sm leading-relaxed mb-5'>
                  {product.description}
                </p>

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
                    TK OFF
                  </span>
                </div>

                {/* color */}
                <div className='mb-6'>
                  <p className='text-sm font-semibold text-gray-700 mb-3 bangla'>
                    রঙ বেছে নিন:{' '}
                    <span className='text-indigo-600 font-bold bangla'>
                      {selectedColor}
                    </span>
                  </p>
                  <div className='flex items-center gap-3 flex-wrap'>
                    {product.variants.map((v) => {
                      const lc = v.color.toLowerCase();
                      const isSelected = selectedColor === v.color;
                      return (
                        <button
                          key={v.color}
                          title={v.color}
                          onClick={() => setSelectedColor(v.color)}
                          style={{
                            backgroundColor: lc,
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            border: '2px solid transparent',
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

      {/* ── Description Images: mobile=vertical stack, md+=2-col grid ── */}
      <div className='w-full'>
        {/* mobile */}
        <div className='flex flex-col md:hidden'>
          {DESC_IMGS.map((f, i) => (
            <div key={i} className='overflow-hidden'>
              <img
                src={`/assets/product/screw/${f}`}
                alt={`বিবরণ ${i + 1}`}
                className='w-full object-cover block'
              />
            </div>
          ))}
        </div>
        {/* md+ 2-col grid */}
        <div className='hidden md:grid md:grid-cols-2'>
          {DESC_IMGS.map((f, i) => (
            <div key={i} className='overflow-hidden'>
              <img
                src={`/assets/product/screw/${f}`}
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
              কেন এই টুলকিটটি আপনার জন্য পারফেক্ট?
            </h2>
            <div className='w-16 h-1 bg-indigo-500 rounded-full mx-auto'></div>
          </div>

          <div className='bg-white rounded shadow-md p-8 md:p-12 mb-8'>
            <p className='text-gray-700 bangla text-lg leading-relaxed mb-5'>
              আপনার মেরামত ও DIY কাজকে আরও সহজ করে তুলুন —{' '}
              <strong className='text-indigo-600'>
                110-ইন-1 ম্যাগনেটিক প্রফেশনাল স্ক্রু ড্রাইভার সেট
              </strong>{' '}
              আপনার সেরা সঙ্গী। একটি কিটেই পাচ্ছেন 110টি বিভিন্ন ধরনের বিট, যা
              কম্পিউটার, মোবাইল, ঘড়ি ও যেকোনো ইলেকট্রনিক ডিভাইস মেরামতে কাজে
              আসবে।
            </p>
            <p className='text-gray-700 bangla text-lg leading-relaxed mb-5'>
              উচ্চমানের <strong>CR-V স্টিল</strong> দিয়ে তৈরি এই টুলগুলো টেকসই
              ও দীর্ঘস্থায়ী। ম্যাগনেটিক ডিজাইনের কারণে ছোট স্ক্রু সহজেই ধরা
              যায়, কাজ হয় দ্রুত ও নির্ভুল।
            </p>
            <p className='text-gray-700 bangla text-lg leading-relaxed'>
              কমপ্যাক্ট বক্সে সাজানো এই সেটটি ঘরে, অফিসে বা ওয়ার্কশপে সহজে
              সংরক্ষণ করা যায়। পেশাদার থেকে শুরু করে সাধারণ ব্যবহারকারী — সবার
              জন্যই এটি আদর্শ।
            </p>
          </div>

          {/* feature cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-8'>
            {[
              {
                icon: '🔧',
                title: '110-ইন-1 কম্প্রিহেনসিভ সেট',
                desc: '110টি বিভিন্ন ধরনের বিট একটি সেটে — যেকোনো স্ক্রু টাইপের জন্য প্রস্তুত।',
                bg: 'bg-indigo-50',
                ibg: 'bg-indigo-100',
              },
              {
                icon: '🧲',
                title: 'ম্যাগনেটিক ডিজাইন',
                desc: 'ম্যাগনেটিক টিপ ছোট স্ক্রু ধরে রাখে, ফলে কাজ হয় দ্রুত ও ঝামেলামুক্ত।',
                bg: 'bg-rose-50',
                ibg: 'bg-rose-100',
              },
              {
                icon: '💪',
                title: 'CR-V উপাদান — টেকসই ও মজবুত',
                desc: 'ক্রোমিয়াম-ভ্যানাডিয়াম স্টিল দিয়ে তৈরি, দীর্ঘ ব্যবহারেও মরিচা ধরে না।',
                bg: 'bg-emerald-50',
                ibg: 'bg-emerald-100',
              },
              {
                icon: '💻',
                title: 'কম্পিউটার ও ইলেকট্রনিক রিপেয়ার',
                desc: 'ল্যাপটপ, মোবাইল, ট্যাবলেট ও যেকোনো ইলেকট্রনিক ডিভাইস মেরামতে সক্ষম।',
                bg: 'bg-sky-50',
                ibg: 'bg-sky-100',
              },
              {
                icon: '🏠',
                title: 'ঘরোয়া DIY কাজে পারফেক্ট',
                desc: 'ফার্নিচার, হোম অ্যাপ্লায়েন্স ও দৈনন্দিন মেরামতের জন্য আদর্শ।',
                bg: 'bg-amber-50',
                ibg: 'bg-amber-100',
              },
              {
                icon: '📦',
                title: 'কমপ্যাক্ট স্টোরেজ বক্স',
                desc: 'সুশৃঙ্খল বক্সে প্যাক করা — সহজে বহন ও সংরক্ষণ করা যায়।',
                bg: 'bg-purple-50',
                ibg: 'bg-purple-100',
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

          {/* specs table */}
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
                { l: 'মডেল নম্বর', v: 'KS-840110-1' },
                { l: 'ব্র্যান্ড', v: 'Kingsdun' },
                { l: 'বিটের সংখ্যা', v: '110টি' },
                { l: 'টুলের ধরন', v: 'Hand Tools (Screwdriver Set)' },
                { l: 'উপাদান', v: 'CR-V (Chromium-Vanadium Steel)' },
                { l: 'ব্যবহার', v: 'Computer Repair, DIY, Household' },
                { l: 'প্যাকেজিং', v: 'Plastic Box' },
                { l: 'ওয়ারেন্টি', v: '1 বছর' },
                { l: 'OEM সাপোর্ট', v: 'আছে' },
                { l: 'উৎপত্তিস্থল', v: 'Guangdong, China' },
                { l: 'রঙ', v: 'লাল (Red)' },
              ].map((row, i) => (
                <div
                  key={row.l}
                  className={`flex px-8 py-4 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <span className='w-48 text-sm font-semibold text-gray-500 bangla'>
                    {row.l}
                  </span>
                  <span className='text-sm text-gray-800 bangla font-medium'>
                    {row.v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className='text-center mt-14'>
            <div
              className='rounded-2xl p-10 max-w-2xl mx-auto shadow-xl'
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
                {product.inStock
                  ? `৳${product.price} — এখনই কিনুন`
                  : 'স্টক শেষ'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export async function getStaticProps() {
  if (!productData) return { notFound: true };
  return { props: { initialProduct: productData } };
}

export default ProductDetails;
