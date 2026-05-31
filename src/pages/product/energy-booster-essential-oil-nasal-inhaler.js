import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { GiGrapes, GiWatermelon, GiPeach } from 'react-icons/gi';
import { FaLeaf, FaLemon, FaQuestionCircle } from 'react-icons/fa';
import Navbar from '@/components/common/Navbar';
import CustomSection from '@/components/layout/CustomSection';
import { products } from '@/utils/products';
import { addToCart } from '@/store/cartSlice';
import { useCartDialog } from '@/context/CartDialogContext';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SiRedbull } from 'react-icons/si';

const productData = products.find(
  (p) => p.slug === 'energy-booster-essential-oil-nasal-inhaler',
);

const variantIcons = {
  Mint: <FaLeaf className='text-green-500 text-xl' />,
  Grape: <GiGrapes className='text-purple-600 text-xl' />,
  Watermelon: <GiWatermelon className='text-red-500 text-xl' />,
  Peace: <GiPeach className='text-orange-500 text-xl' />,
  Lemon: <FaLemon className='text-yellow-500 text-xl' />,
  RedBull: <SiRedbull className='text-red-800 text-xl' />,
};

const variantBgColors = {
  Mint: 'bg-green-100',
  Grape: 'bg-purple-100',
  Watermelon: 'bg-red-100',
  Peace: 'bg-orange-100',
  Lemon: 'bg-yellow-100',
  RedBull: 'bg-red-100',
};

// Bundle pricing tiers based on total quantity
const BUNDLE_PRICES = { 1: 490, 2: 800, 3: 999, 4: 1200, 5: 1400, 6: 1600 };

const getBundlePrice = (qty) => {
  if (qty <= 0) return 0;
  if (qty <= 6) return BUNDLE_PRICES[qty];
  return 1600 + (qty - 6) * 490;
};

const ProductDetails = ({ initialProduct }) => {
  const dispatch = useDispatch();
  const { openDialog } = useCartDialog();
  const viewItemFired = useRef(false);
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [variantQuantities, setVariantQuantities] = useState({});
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (viewItemFired.current) return;
    viewItemFired.current = true;
    if (initialProduct) {
      setProduct(initialProduct);
      setActiveImage(initialProduct.images[0] || '');
      const defaultVariant = initialProduct.variants?.[0]?.type;
      if (defaultVariant) {
        setVariantQuantities({ [defaultVariant]: 1 });
      }

      if (typeof window !== 'undefined') {
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
                item_category: 'Wellness',
                item_variant: 'Essential Oil Inhaler',
              },
            ],
            currency: 'BDT',
            value: initialProduct.price || 0,
          },
        });
      }
    }
  }, [initialProduct]);

  const handleImageClick = (image) => {
    setActiveImage(image);
  };

  const handleVariantQuantityChange = (type, action) => {
    setVariantQuantities((prev) => {
      const current = prev[type] || 0;
      let next = current;
      if (action === 'increment' && current < 99) next += 1;
      if (action === 'decrement' && current > 0) next -= 1;
      return { ...prev, [type]: next };
    });
  };

  const totalQuantity = Object.values(variantQuantities).reduce(
    (a, b) => a + b,
    0,
  );

  const bundlePrice = getBundlePrice(totalQuantity);
  const originalTotal = totalQuantity * (product?.price || 490);
  const savings = originalTotal - bundlePrice;
  const savingsPercent =
    originalTotal > 0 ? Math.round((savings / originalTotal) * 100) : 0;

  const handleBuyNow = () => {
    if (!product || totalQuantity === 0) return;

    // Build a summary of selected flavors for display
    const selectedFlavors = Object.entries(variantQuantities)
      .filter(([, qty]) => qty > 0)
      .map(([type, qty]) => `${type}×${qty}`)
      .join(', ');

    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: 'BDT',
          value: bundlePrice,
          items: [
            {
              item_id: product.id || 'unknown',
              item_name: product.title || 'unknown',
              price: bundlePrice,
              original_price: originalTotal,
              item_category: 'Wellness',
              item_variant: selectedFlavors,
              quantity: 1,
            },
          ],
        },
      });
    }

    // Dispatch a single bundle cart item so order total is always correct
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: bundlePrice,
        selectedColor: selectedFlavors,
        variantKey: 'type',
        quantity: 1,
        image: activeImage,
      }),
    );

    openDialog();
  };

  if (!product) {
    return (
      <div className='text-center py-10 text-gray-600 font-mont text-lg'>
        পণ্য খুঁজে পাওয়া যায়নি
      </div>
    );
  }

  const faqData = [
    {
      question:
        'এই নেজাল ইনহেলার কি সত্যিই সাইনাস ও স্ট্রেস কমাতে সাহায্য করে?',
      answer:
        'জ্বী, প্রাকৃতিক এসেনশিয়াল অয়েলের অ্যারোমাথেরাপির মাধ্যমে এটি সাইনাসের অস্বস্তি, মাথার চাপ, টেনশন ও স্ট্রেস উপশম করতে সহায়তা করে। এটি সতেজ অনুভূতি দেয় এবং ফোকাস বাড়াতে সাহায্য করে।',
    },
    {
      question: 'এটি কতদিন ব্যবহার করা যায়?',
      answer:
        'সঠিকভাবে ব্যবহার করলে এবং ক্যাপ বন্ধ রাখলে একটি ইনহেলার 3-6 মাস পর্যন্ত সুবাস ধরে রাখতে পারে। তবে ব্যবহারের ফ্রিকোয়েন্সির উপর নির্ভর করে এটি কম-বেশি হতে পারে।',
    },
    {
      question: 'এতে কি কোনো পার্শ্বপ্রতিক্রিয়া আছে?',
      answer:
        'সাধারণত নিরাপদ, কারণ এতে শুধুমাত্র খাঁটি প্রাকৃতিক এসেনশিয়াল অয়েল ব্যবহার করা হয়েছে। তবে অ্যালার্জি থাকলে ব্যবহারের আগে টেস্ট করে নিন। গর্ভবতী বা শিশুদের ক্ষেত্রে ডাক্তারের পরামর্শ নিন।',
    },
    {
      question: 'কীভাবে সঠিকভাবে ব্যবহার করব?',
      answer:
        'ক্যাপ খুলে ইনহেলারটি নাকের কাছে (1-2 ইঞ্চি দূরে) ধরুন। এক নাকের ছিদ্র বন্ধ করে অন্যটি দিয়ে ধীরে ধীরে গভীরভাবে শ্বাস নিন। 3-5 বার পুনরাবৃত্তি করুন। প্রয়োজনে দিনে 3-5 বার ব্যবহার করতে পারেন।',
    },
    {
      question: 'এটি কি শিশুদের জন্য নিরাপদ?',
      answer:
        'প্রাপ্তবয়স্কদের জন্য ডিজাইন করা। 12 বছরের নিচের শিশুদের ক্ষেত্রে ব্যবহারের আগে ডাক্তারের পরামর্শ নেওয়া উচিত।',
    },
  ];

  return (
    <>
      <Head>
        <title>Energy Booster Essential Oil Nasal Inhaler | Kino Mart</title>
        <meta
          name='description'
          content='প্রাকৃতিক এসেনশিয়াল অয়েল নেজাল ইনহেলার – সাইনাস, স্ট্রেস ও টেনশন কমান, এনার্জি বাড়ান। ডুয়াল স্টিক, অর্গানিক ও বহনযোগ্য।'
        />
        <meta
          property='og:title'
          content='Energy Booster Essential Oil Nasal Inhaler | Kino Mart'
        />
        <meta
          property='og:description'
          content='প্রাকৃতিক অ্যারোমাথেরাপি দিয়ে সতেজ থাকুন। সাইনাস অস্বস্তি, স্ট্রেস রিলিফ ও ফোকাস বাড়াতে সহায়ক।'
        />
        <meta
          property='og:url'
          content={`https://www.kinomart.com/product/${product.slug}`}
        />
        <meta property='og:type' content='product' />
        <meta property='og:image' content={product.images[0]} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>

      <Navbar />

      <div className='py-6 sm:py-8 container mx-auto px-4 sm:px-6 lg:px-8'>
        <style jsx>{`
          .image-transition {
            transition:
              opacity 0.3s ease-in-out,
              transform 0.3s ease-in-out;
          }
          .image-transition:hover {
            transform: scale(1.02);
          }
          .small-image {
            transition:
              opacity 0.2s ease-in-out,
              border-color 0.2s ease-in-out;
            border-width: 2px;
          }
          .small-image-active {
            border-color: #a4dd00;
            opacity: 1;
          }
          .small-image-inactive {
            opacity: 0.7;
            border-color: transparent;
          }
        `}</style>

        <div className='bg-white py-4 sm:py-6 rounded-xl shadow-lg'>
          <div className='flex flex-col lg:flex-row gap-4 sm:gap-6'>
            {/* Image Section */}
            <div className='w-full lg:w-3/5 px-4'>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4'>
                <div className='col-span-1 sm:col-span-2'>
                  <img
                    className='w-full h-64 sm:h-80 lg:h-[400px] object-cover rounded-lg image-transition'
                    src={activeImage}
                    alt={product.title}
                  />
                </div>
                <div className='grid grid-cols-3 sm:grid-cols-1 gap-3 sm:gap-4'>
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      className={`w-full h-20 sm:h-28 lg:h-36 object-cover rounded-lg cursor-pointer small-image ${
                        activeImage === image
                          ? 'small-image-active'
                          : 'small-image-inactive'
                      }`}
                      src={image}
                      alt={`${product.title} থাম্বনেইল ${index + 1}`}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className='w-full lg:w-2/5 px-4 sm:px-6 py-4'>
              <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold font-mont text-gray-800 mb-2 sm:mb-3'>
                {product.title}
              </h2>
              <p className='text-gray-600 text-sm sm:text-base font-mont mb-4'>
                {product.description}
              </p>
              <p className='bg-yellow-200 font-bold my-3'>
                একাধিক অর্ডারে পাচ্ছেন ডিস্কাউন্ট!
              </p>

              {/* Variant selector */}
              {product.variants && product.variants.length > 0 && (
                <div className='mb-5'>
                  <span className='font-semibold text-gray-700 text-sm sm:text-base'>
                    ফ্লেভার নির্বাচন করুন
                  </span>
                  <div className='flex flex-col gap-3 mt-3'>
                    {product.variants.map((variant, index) => {
                      const value = variant.type;
                      const qty = variantQuantities[value] || 0;
                      const isSelected = qty > 0;
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            if (!isSelected) {
                              handleVariantQuantityChange(value, 'increment');
                            }
                          }}
                          className={`border flex flex-row items-center justify-between rounded-lg px-4 py-3 transition-all duration-200 ${
                            isSelected
                              ? 'border-primary shadow-sm bg-primary/5'
                              : 'border-gray-200 bg-gray-50 cursor-pointer hover:border-primary/50'
                          }`}
                        >
                          <div className='flex items-center gap-3'>
                            <div
                              className={`p-2 rounded-full ${variantBgColors[value] || 'bg-white'}`}
                            >
                              {variantIcons[value]}
                            </div>
                            <span className='text-sm sm:text-base font-semibold text-gray-800'>
                              {value}
                            </span>
                          </div>
                          <div
                            className='flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type='button'
                              onClick={() =>
                                handleVariantQuantityChange(value, 'decrement')
                              }
                              className='hover:bg-gray-100 px-3 py-1.5 focus:outline-none flex items-center justify-center text-gray-700 transition-colors'
                            >
                              <span className='text-lg font-medium leading-none'>
                                −
                              </span>
                            </button>
                            <input
                              type='text'
                              value={qty}
                              readOnly
                              className='w-8 sm:w-10 text-center text-gray-900 text-sm font-semibold focus:outline-none border-x border-gray-300 py-1.5'
                            />
                            <button
                              type='button'
                              onClick={() =>
                                handleVariantQuantityChange(value, 'increment')
                              }
                              className='hover:bg-gray-100 px-3 py-1.5 focus:outline-none flex items-center justify-center text-gray-700 transition-colors'
                            >
                              <span className='text-lg font-medium leading-none'>
                                +
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bundle price summary */}
              <div className='pt-4 border-t border-gray-200 mb-4'>
                {totalQuantity > 0 ? (
                  <div className='flex flex-col gap-1 mb-3'>
                    <span className='text-gray-600 text-xs sm:text-sm font-semibold'>
                      সর্বমোট মূল্য ({totalQuantity}টি পণ্য):
                    </span>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className='font-bold text-xl sm:text-2xl' style={{background:'linear-gradient(to right,#ef4444,#9f1239)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                        ৳ {bundlePrice.toFixed(0)}
                      </span>
                      {savings > 0 && (
                        <>
                          <span className='text-gray-400 font-normal text-sm sm:text-base line-through'>
                            ৳ {originalTotal.toFixed(0)}
                          </span>
                          <span className='bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full'>
                            {savingsPercent}% সাশ্রয়
                          </span>
                        </>
                      )}
                    </div>
                    {savings > 0 && (
                      <p className='text-green-600 text-xs font-semibold'>
                        আপনি ৳{savings.toFixed(0)} সাশ্রয় করছেন!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-black font-bold text-xl sm:text-2xl'>
                      ৳ {product.price.toFixed(0)}
                    </span>
                    <span className='text-gray-500 font-normal text-sm line-through'>
                      ৳ {product.originalPrice.toFixed(0)}
                    </span>
                    <span className='text-xs text-gray-500 font-mont'>
                      (প্রতিটির মূল্য)
                    </span>
                  </div>
                )}

                <button
                  onClick={handleBuyNow}
                  className='w-full flex items-center bg-primary text-black justify-center gap-2 border border-primary px-6 py-3 rounded-md font-mont font-bold text-sm sm:text-base transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={!product.inStock || totalQuantity === 0}
                >
                  <span>
                    {product.inStock
                      ? totalQuantity > 0
                        ? `অর্ডার করুন (${totalQuantity}টি) — ৳${bundlePrice}`
                        : 'ফ্লেভার নির্বাচন করুন'
                      : 'স্টক নেই'}
                  </span>
                </button>
              </div>

              <div className='mt-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-sm sm:text-base text-red-600 font-semibold font-mont'>
                  এটি সম্পুর্ণ ন্যাচারাল এসেনশিয়াল অয়েল সমৃদ্ধ একটি প্রোডাক্ট।
                  ই-ভেপ বা ই-সিগারেট ভেবে ভুল করবেন না।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomSection>
        <div className='px-3 sm:px-4'>
          {/* Product images grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
            <img
              src='/assets/product/inhaler/bull.avif'
              alt='Energy Booster Nasal Inhaler - Dual Stick Design'
              className='w-full h-48 sm:h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow'
            />
            <img
              src='/assets/product/inhaler/grape.avif'
              alt='Portable Essential Oil Inhaler with Cap'
              className='w-full h-48 sm:h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow'
            />
            <img
              src='/assets/product/inhaler/rf-7.png'
              alt='Aromatherapy Nasal Inhaler - Peppermint Style'
              className='w-full h-48 sm:h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow'
            />
            <img
              src='/assets/product/inhaler/rf-9.png'
              alt='Refreshing Nasal Inhaler Pack - Natural Oils'
              className='w-full h-48 sm:h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow'
            />
          </div>

          {/* ── Bundle Offer Banner ── */}
          <div className='mt-6 rounded-2xl overflow-hidden shadow-lg border border-green-100'>
            {/* Header */}
            <div
              className='px-6 py-4 text-center'
              style={{
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
              }}
            >
              <p className='text-white text-xs font-bold uppercase tracking-widest mb-1'>
                🎉 একসাথে বেশি কিনুন — বেশি সাশ্রয় করুন!
              </p>
              <h3 className='text-white text-xl sm:text-2xl font-extrabold'>
                একাধিক ফ্লেভার কিনলে পাবেন বিশেষ ছাড়
              </h3>
            </div>

            {/* Tier table */}
            <div className='bg-white divide-y divide-gray-100'>
              {[
                {
                  qty: 1,
                  label: '1টি পণ্য',
                  price: 490,
                  original: 490,
                  badge: null,
                },
                {
                  qty: 2,
                  label: '2টি পণ্য',
                  price: 800,
                  original: 980,
                  badge: '18% ছাড়',
                },
                {
                  qty: 3,
                  label: '3টি পণ্য',
                  price: 999,
                  original: 1470,
                  badge: '32% ছাড়',
                },
                {
                  qty: 4,
                  label: '4টি পণ্য',
                  price: 1200,
                  original: 1960,
                  badge: '39% ছাড়',
                },
                {
                  qty: 5,
                  label: '5টি পণ্য',
                  price: 1400,
                  original: 2450,
                  badge: '43% ছাড়',
                },
                {
                  qty: 6,
                  label: '6টি পণ্য (সব ফ্লেভার)',
                  price: 1600,
                  original: 2940,
                  badge: '46% ছাড়',
                  highlight: true,
                },
              ].map((tier) => (
                <div
                  key={tier.qty}
                  className={`flex items-center justify-between px-5 py-3 ${
                    tier.highlight ? 'bg-green-50' : ''
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl'>
                      {tier.qty === 1 ? '🟢' : tier.qty <= 3 ? '🟡' : '🔥'}
                    </span>
                    <div>
                      <p className='font-bold text-gray-800 text-sm sm:text-base'>
                        {tier.label}
                        {tier.highlight && (
                          <span className='ml-2 text-green-600 text-xs'>
                            (সেরা ডিল!)
                          </span>
                        )}
                      </p>
                      {tier.original > tier.price && (
                        <p className='text-gray-400 text-xs line-through'>
                          আগের দাম: ৳{tier.original}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 sm:gap-3'>
                    <span className='font-extrabold text-green-700 text-base sm:text-lg'>
                      ৳{tier.price}
                    </span>
                    {tier.badge && (
                      <span className='bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full hidden sm:inline'>
                        {tier.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className='bg-green-50 px-6 py-3 text-center border-t border-green-100'>
              <p className='text-green-700 text-sm font-semibold'>
                ✅ যেকোনো ফ্লেভার মিশিয়ে নিন — ডিসকাউন্ট মোট পরিমাণের উপর
                প্রযোজ্য
              </p>
            </div>
          </div>

          {/* Product Description */}
          <div className='bg-white p-2 mt-4 sm:p-5 rounded-lg'>
            <h2 className='text-lg sm:text-xl font-semibold mb-3'>
              পণ্যের বিবরণ
            </h2>
            <p className='text-gray-600 font-mont text-sm sm:text-base'>
              এসেনশিয়াল অয়েল নেজাল ইনহেলার <br />
              পিউর ও অর্গানিক • কাস্টম ফ্লেভার • ডুয়াল নেজাল স্টিক <br />
              যেকোনো সময় সহজে শ্বাস নিন 🌿
            </p>
            <p className='py-3 text-gray-600 font-mont text-sm sm:text-base'>
              আমাদের এসেনশিয়াল অয়েল নেজাল ইনহেলার প্রাকৃতিকভাবে সাইনাসের
              অস্বস্তি, মাথার চাপ, টেনশন ও স্ট্রেস কমাতে সহায়তা করে। এতে
              ব্যবহৃত হয়েছে খাঁটি ও অর্গানিক এসেনশিয়াল অয়েল, যা নাকে
              প্রশান্তিদায়ক ও সতেজ অনুভূতি দেয়।
            </p>
            <p className='py-2 text-gray-600 font-mont text-sm sm:text-base font-semibold'>
              ✨ পণ্যের উপকারিতা
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-700 font-mont text-sm sm:text-base pl-4'>
              <li>সাইনাস ব্লক, নাকের অস্বস্তি ও চাপ কমাতে সাহায্য করে</li>
              <li>অ্যারোমাথেরাপির মাধ্যমে টেনশন ও স্ট্রেস রিলিফ</li>
              <li>সতেজ সুবাস যা এনার্জি ও ফোকাস বাড়াতে সহায়ক</li>
              <li>ডুয়াল নেজাল স্টিক – স্বাস্থ্যকর ও সহজ ব্যবহার</li>
              <li>ছোট ও বহনযোগ্য – পকেট বা ব্যাগে সহজেই রাখা যায়</li>
            </ul>
            <p className='py-3 text-gray-600 font-mont text-sm sm:text-base font-semibold'>
              🌱 পণ্যের তথ্য
            </p>
            <ul className='list-disc list-inside space-y-1 text-gray-700 font-mont text-sm sm:text-base pl-4'>
              <li>ব্যবহার উপযোগী বয়স: প্রাপ্তবয়স্ক</li>
              <li>উপাদান: প্রাকৃতিক এসেনশিয়াল অয়েল</li>
              <li>মেয়াদ: 12 মাস</li>
              <li>ফ্লেভার: কাস্টমাইজেবল (নির্বাচন অনুযায়ী)</li>
            </ul>
          </div>

          <div className='mt-4 flex flex-col items-center justify-center'>
            <img
              src='/assets/product/inhaler/model.jpg'
              alt='Aromatherapy Nasal Inhaler - Model'
              className='w-full h-full object-cover shadow-md hover:shadow-lg transition-shadow'
            />
            <img
              src='/assets/product/inhaler/driving.jpg'
              alt='Aromatherapy Nasal Inhaler - Driving'
              className='w-full h-full object-cover shadow-md hover:shadow-lg transition-shadow'
            />
            <img
              src='/assets/product/inhaler/motion.jpg'
              alt='Aromatherapy Nasal Inhaler - Motion'
              className='w-full h-full object-cover shadow-md hover:shadow-lg transition-shadow'
            />
            <img
              src='/assets/product/inhaler/refresh.jpg'
              alt='Aromatherapy Nasal Inhaler - Refresh'
              className='w-full h-full object-cover shadow-md hover:shadow-lg transition-shadow'
            />
          </div>

          {/* FAQ Section */}
          <div className='bg-white p-4 sm:p-5 rounded-lg mt-4 sm:mt-6'>
            <h2 className='text-lg sm:text-xl font-semibold flex items-center gap-2 mb-3'>
              <FaQuestionCircle className='text-red-500' /> প্রায়শই জিজ্ঞাসিত
              প্রশ্নাবলী (FAQ)
            </h2>
            <div className='mt-4 space-y-4'>
              {faqData.map((faq, index) => (
                <div key={index} className='border-b pb-4 last:border-b-0'>
                  <p className='text-gray-800 font-semibold mb-1 text-sm sm:text-base'>
                    <span className='text-blue-600'>প্রশ্ন:</span>{' '}
                    {faq.question}
                  </p>
                  <p className='text-gray-600 font-mont text-sm sm:text-base'>
                    <span className='font-semibold'>উত্তর:</span> {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CustomSection>

      <Footer />
    </>
  );
};

export async function getStaticProps() {
  if (!productData) {
    return { notFound: true };
  }
  return { props: { initialProduct: productData } };
}

export default ProductDetails;
