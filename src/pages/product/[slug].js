import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { FaQuestionCircle, FaRegCommentDots } from 'react-icons/fa';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import CustomSection from '@/components/layout/CustomSection';
import { addToCart } from '@/store/cartSlice';
import { useCartDialog } from '@/context/CartDialogContext';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { products as staticProducts } from '@/utils/products';

function groupVariants(variants) {
  const groups = {};
  (variants || []).forEach((v) => {
    if (!v.name) return;
    if (!groups[v.name]) groups[v.name] = [];
    groups[v.name].push(v);
  });
  return groups;
}

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
      style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #bfdbfe' }}
    >
      <p className='text-sm font-semibold text-center text-blue-700 mb-2'>⏰ অফার টি চলবে আর</p>
      <div className='flex items-center justify-center gap-2'>
        {[
          { val: pad(timeLeft.h), label: 'ঘণ্টা' },
          { val: pad(timeLeft.m), label: 'মিনিট' },
          { val: pad(timeLeft.s), label: 'সেকেন্ড' },
        ].map((unit, i) => (
          <React.Fragment key={unit.label}>
            {i > 0 && <span className='text-blue-500 font-black text-2xl leading-none mb-4'>:</span>}
            <div className='flex flex-col items-center'>
              <span
                className='font-mono font-extrabold text-lg px-3 py-1.5 rounded-lg min-w-[44px] text-center shadow-md text-white'
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}
              >
                {unit.val}
              </span>
              <span className='text-[10px] text-blue-600 mt-1 font-medium'>{unit.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const DynamicProductPage = ({ product }) => {
  const dispatch = useDispatch();
  const { openDialog } = useCartDialog();
  const viewItemFired = useRef(false);

  const variantGroups = groupVariants(product?.variants);
  const groupNames = Object.keys(variantGroups);

  const [selected, setSelected] = useState(() => {
    const init = {};
    groupNames.forEach((name) => {
      init[name] = variantGroups[name][0]?.value || '';
    });
    return init;
  });
  const [activeImage, setActiveImage] = useState(
    product?.thumbnail || product?.images?.[0] || '',
  );
  const [quantity, setQuantity] = useState(1);

  const priceModifier = groupNames.reduce((sum, name) => {
    const v = variantGroups[name].find((x) => x.value === selected[name]);
    return sum + (v?.priceModifier || 0);
  }, 0);

  const finalPrice = (product?.price || 0) + priceModifier;
  const finalOriginalPrice = (product?.originalPrice || 0) + priceModifier;
  const variantLabel = groupNames.map((name) => selected[name]).filter(Boolean).join(' / ');

  useEffect(() => {
    if (viewItemFired.current || !product) return;
    viewItemFired.current = true;

    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          items: [
            {
              item_id: product.id || product._id || 'unknown',
              item_name: product.title || 'unknown',
              price: product.price || 0,
              original_price: product.originalPrice || 0,
              item_category: product.category || 'General',
              item_variant: variantLabel || 'unknown',
            },
          ],
          currency: 'BDT',
          value: product.price || 0,
        },
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className='text-center py-10 text-gray-600 font-mont text-lg'>
        পণ্য খুঁজে পাওয়া যায়নি
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail].filter(Boolean);

  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < 999) setQuantity(quantity + 1);
    else if (type === 'decrement' && quantity > 1) setQuantity(quantity - 1);
  };

  const handleBuyNow = () => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: 'BDT',
          value: finalPrice * quantity,
          items: [
            {
              item_id: product.id || product._id || 'unknown',
              item_name: product.title || 'unknown',
              price: finalPrice,
              original_price: finalOriginalPrice,
              item_category: product.category || 'General',
              item_variant: variantLabel || 'unknown',
              quantity: quantity || 1,
            },
          ],
        },
      });
    }
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: finalPrice,
        selectedColor: variantLabel,
        quantity,
        image: activeImage,
      }),
    );
    openDialog();
  };

  const pageUrl = `https://www.kinomart.com/product/${product.slug}`;

  return (
    <>
      <Head>
        <title>{product.title} | Kino Mart</title>
        <meta name='description' content={product.shortDescription || product.title} />
        <meta property='og:title' content={`${product.title} | Kino Mart`} />
        <meta property='og:description' content={product.shortDescription || product.title} />
        <meta property='og:url' content={pageUrl} />
        <meta property='og:type' content='product' />
        {images[0] && <meta property='og:image' content={images[0]} />}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={`${product.title} | Kino Mart`} />
        <meta name='twitter:description' content={product.shortDescription || product.title} />
        {images[0] && <meta name='twitter:image' content={images[0]} />}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.title,
              image: images,
              description: product.shortDescription || product.title,
              sku: product.id || product._id,
              offers: {
                '@type': 'Offer',
                url: pageUrl,
                priceCurrency: 'BDT',
                price: finalPrice,
                availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition',
              },
            }),
          }}
        />
      </Head>
      <Navbar />
      <div className='py-6 sm:py-8 container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white py-4 sm:py-6 rounded-xl shadow-lg'>
          <div className='flex flex-col lg:flex-row gap-4 sm:gap-6'>
            {/* Image Section */}
            <div className='w-full lg:w-3/5 px-4'>
              <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
                <div className='col-span-1 sm:col-span-3'>
                  <img
                    className='w-full h-72 lg:h-[400px] object-cover rounded-lg image-transition'
                    src={activeImage}
                    alt={product.title}
                  />
                  <div className='flex justify-center gap-2 mt-4 sm:hidden'>
                    {images.map((image, index) => (
                      <img
                        key={index}
                        className={`w-16 h-16 sm:h-20 object-cover rounded-lg cursor-pointer small-image ${activeImage === image ? 'small-image-active' : 'small-image-inactive'}`}
                        src={image}
                        alt={`${product.title} থাম্বনেইল ${index + 1}`}
                        onClick={() => setActiveImage(image)}
                      />
                    ))}
                  </div>
                </div>
                <div className='hidden sm:flex flex-col items-center gap-4'>
                  {images.map((image, index) => (
                    <img
                      key={index}
                      className={`w-full h-20 sm:h-28 lg:h-36 object-cover rounded-lg cursor-pointer small-image ${activeImage === image ? 'small-image-active' : 'small-image-inactive'}`}
                      src={image}
                      alt={`${product.title} থাম্বনেইল ${index + 1}`}
                      onClick={() => setActiveImage(image)}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Product Details */}
            <div className='w-full lg:w-2/5 px-4 sm:px-6 py-4'>
              <h1 className='text-lg sm:text-xl lg:text-2xl font-semibold font-mont text-gray-800 mb-2 sm:mb-4'>
                {product.title}
              </h1>
              {product.shortDescription && (
                <p className='text-gray-600 text-sm sm:text-base font-mont mb-4'>
                  {product.shortDescription}
                </p>
              )}

              {product.discountTimer && <CountdownToMidnight />}

              {groupNames.map((name) => (
                <div className='mb-6' key={name}>
                  <span className='font-semibold text-gray-700 text-sm sm:text-base'>{name}</span>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-3 mt-4 flex-wrap'>
                    {variantGroups[name].map((v, index) => {
                      const isSelected = selected[name] === v.value;
                      return (
                        <div
                          key={index}
                          className={`border-2 flex items-center justify-center rounded-lg cursor-pointer variant-button px-4 py-2 text-gray-800 border-gray-300 hover:bg-gray-100 ${isSelected ? 'variant-button-active' : ''}`}
                          onClick={() => setSelected((p) => ({ ...p, [name]: v.value }))}
                        >
                          <span className='text-sm font-semibold'>{v.value}</span>
                          {v.priceModifier ? (
                            <span className='text-xs text-gray-600 ml-1'>
                              ({v.priceModifier > 0 ? '+' : ''}৳{v.priceModifier})
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className='flex items-center justify-start gap-2 text-md mb-6'>
                <span
                  className='font-bold text-lg sm:text-xl'
                  style={{ background: 'linear-gradient(to right,#2563eb,#1e3a8a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  ৳ {finalPrice.toFixed(2)}
                </span>
                {finalOriginalPrice > finalPrice && (
                  <span className='text-gray-500 font-normal text-base sm:text-lg line-through'>
                    ৳ {finalOriginalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className='flex items-center justify-start gap-4 mb-6'>
                <div className='flex items-center border border-gray-400 rounded-lg bg-white'>
                  <button
                    type='button'
                    onClick={() => handleQuantityChange('decrement')}
                    className='hover:bg-gray-200 rounded-l-lg py-2 px-3 sm:px-4 h-10 sm:h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none'
                  >
                    <svg className='w-2 h-2 text-gray-900' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 18 2'>
                      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M1 1h16' />
                    </svg>
                  </button>
                  <input
                    type='text'
                    value={quantity}
                    readOnly
                    className='h-10 sm:h-11 w-12 sm:w-16 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block py-2.5'
                  />
                  <button
                    type='button'
                    onClick={() => handleQuantityChange('increment')}
                    className='hover:bg-gray-200 rounded-r-lg py-2 px-3 sm:px-4 h-10 sm:h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none'
                  >
                    <svg className='w-2 h-2 text-gray-900' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 18 18'>
                      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 1v16M1 9h16' />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleBuyNow}
                  className='flex items-center bg-primary text-black justify-center gap-2 border border-primary px-4 sm:px-6 py-2 sm:py-3 rounded-md font-mont font-semibold text-sm'
                  disabled={!product.inStock}
                >
                  <span>{product.inStock ? 'এখনই কিনুন' : 'স্টক নেই'}</span>
                </button>
              </div>
              <p className='text-sm text-gray-600 font-semibold'>
                *প্রতিটি প্রোডাক্টের সাথে পেয়ে যাচ্ছেন 1 বছরের ওয়ারেন্টি ।
              </p>
            </div>
          </div>
        </div>
      </div>

      <CustomSection>
        <div className='px-3 sm:px-4'>
          {product.descriptionHTML && (
            <div className='bg-white p-4 sm:p-5 rounded-lg'>
              <h2 className='text-lg sm:text-xl font-semibold mb-3'>পণ্যের বিবরণ</h2>
              <div
                className='dp-html-content text-sm sm:text-base'
                dangerouslySetInnerHTML={{ __html: product.descriptionHTML }}
              />
            </div>
          )}

          {product.gallery && product.gallery.length > 0 && (
            <div className='bg-white p-4 sm:p-5 rounded-lg mt-4 sm:mt-6'>
              <h3 className='text-md font-semibold mb-3'>পণ্যের গ্যালারি</h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {product.gallery.map((image, index) => (
                  <div key={index} className='relative overflow-hidden rounded-lg shadow-md'>
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className='w-full h-32 object-cover hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.specifications && product.specifications.length > 0 && (
            <div className='bg-white p-4 sm:p-5 rounded-lg mt-4 sm:mt-6'>
              <h2 className='text-lg sm:text-xl font-semibold mb-3'>স্পেসিফিকেশন</h2>
              <table className='w-full text-sm sm:text-base'>
                <tbody>
                  {product.specifications.map((s, i) => (
                    <tr key={i} className='border-b last:border-b-0'>
                      <td className='py-2 pr-4 font-semibold text-gray-700 w-1/3'>{s.label}</td>
                      <td className='py-2 text-gray-600'>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.faqs && product.faqs.length > 0 && (
            <div className='bg-white p-4 sm:p-5 rounded-lg mt-4 sm:mt-6'>
              <h2 className='text-lg sm:text-xl font-semibold flex items-center gap-2 mb-3'>
                <FaQuestionCircle className='text-blue-500' /> প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
              </h2>
              <div className='mt-4 space-y-4'>
                {product.faqs.map((faq, index) => (
                  <div key={index} className='border-b pb-4 last:border-b-0'>
                    <p className='text-gray-800 font-semibold mb-1 text-sm sm:text-base'>
                      <span className='text-blue-600'>প্রশ্ন:</span> {faq.question}
                    </p>
                    <p className='text-gray-600 font-mont text-sm sm:text-base'>
                      <span className='font-semibold'>উত্তর:</span> {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.reviews && product.reviews.length > 0 && (
            <div className='bg-white p-4 sm:p-5 rounded-lg mt-4 sm:mt-6'>
              <h2 className='text-lg sm:text-xl font-semibold flex items-center gap-2 mb-3'>
                <FaRegCommentDots className='text-purple-500' /> গ্রাহক রিভিউ
              </h2>
              <div className='mt-4 space-y-4'>
                {product.reviews.map((review, index) => (
                  <div key={index} className='p-4 border border-gray-100 rounded-lg bg-gray-50'>
                    <div className='flex items-center justify-between mb-2'>
                      <p className='text-sm sm:text-base font-semibold text-gray-800'>{review.reviewerName}</p>
                      <div className='text-yellow-500 text-sm'>
                        {Array(review.rating).fill().map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className='text-gray-600 text-sm sm:text-base italic'>&quot;{review.comment}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CustomSection>
      <Footer />

      <style jsx global>{`
        .image-transition { transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; }
        .image-transition:hover { transform: scale(1.02); }
        .small-image { transition: opacity 0.2s ease-in-out, border-color 0.2s ease-in-out; border-width: 2px; }
        .small-image-active { border-color: #2563eb; opacity: 1; }
        .small-image-inactive { opacity: 0.7; border-color: transparent; }
        .variant-button { transition: all 0.2s ease-in-out; min-width: 40px; }
        .variant-button-active { border-color: #2563eb !important; transform: scale(1.05); background-color: #dbeafe; }
        .dp-html-content { line-height: 1.75; }
        .dp-html-content p  { margin-bottom: 0.75em; }
        .dp-html-content h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .dp-html-content h2 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .dp-html-content h3 { font-size: 1.125rem; font-weight: 700; margin: 0.9rem 0 0.4rem; }
        .dp-html-content ul  { list-style-type: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .dp-html-content ol  { list-style-type: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .dp-html-content a   { color: #2563eb; text-decoration: underline; }
        .dp-html-content img { max-width: 100%; height: auto; border-radius: 4px; }
        .dp-html-content blockquote { border-left: 4px solid #2563eb; padding: 0.5em 1em; color: #555; background: #f8fafc; margin: 0.75em 0; }
        .dp-html-content table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .dp-html-content th, .dp-html-content td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; vertical-align: top; }
        .dp-html-content th { background: #f8fafc; font-weight: 600; }
      `}</style>
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { slug } = params;

  const isStatic = staticProducts.some((p) => p.slug === slug);
  if (isStatic) return { notFound: true };

  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return { notFound: true };

    return {
      props: {
        product: JSON.parse(JSON.stringify({ ...product, id: product._id.toString() })),
      },
    };
  } catch (err) {
    console.error(err);
    return { notFound: true };
  }
}

export default DynamicProductPage;
