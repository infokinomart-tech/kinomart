import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { GoShareAndroid } from 'react-icons/go';
import {
  FaApple,
  FaAndroid,
  FaMapMarkerAlt,
  FaLock,
  FaSyncAlt,
  FaBatteryHalf,
  FaQuestionCircle,
  FaUser,
  FaRegCommentDots,
} from 'react-icons/fa';
import Navbar from '@/components/common/Navbar';
import CustomSection from '@/components/layout/CustomSection';
import { products } from '@/utils/products';
import { addToCart } from '@/store/cartSlice';
import { useCartDialog } from '@/context/CartDialogContext';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Find the specific product for this page
const productData = products.find((p) => p.slug === 'anti-lost-tracker');

// Helper functions
const getVariantKey = (variants) => {
  if (!variants || variants.length === 0) return null;
  return Object.keys(variants[0]).find((key) => key !== 'id') || null;
};

const getVariantValue = (variant) => {
  const key = getVariantKey([variant]);
  return key ? variant[key] : null;
};

const ProductDetails = ({ initialProduct }) => {
  const dispatch = useDispatch();
  const { openDialog } = useCartDialog();
  const viewItemFired = useRef(false);
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [selectedColor, setselectedColor] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [variantKey, setVariantKey] = useState(null);

  useEffect(() => {
    if (viewItemFired.current) return;
    viewItemFired.current = true;
    if (initialProduct) {
      setProduct(initialProduct);
      const key = getVariantKey(initialProduct.variants);
      setVariantKey(key);
      setselectedColor(
        initialProduct.variants[0] ? initialProduct.variants[0][key] : ''
      );
      setActiveImage(initialProduct.images[0] || '');

      // GTM Data Layer Push (only on client-side)
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
                item_category: initialProduct.title.includes('Smart Watch')
                  ? 'Wearables'
                  : key === 'type'
                  ? 'Tracker'
                  : 'Accessories',
                item_variant: initialProduct.variants
                  ? initialProduct.variants
                      .map((v) => getVariantValue(v))
                      .join(', ')
                  : 'unknown',
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

  const handleVariantChange = (value) => {
    setselectedColor(value);
  };

  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < 999) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      if (typeof window !== 'undefined') {
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
      }
      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          selectedColor,
          quantity,
          image: activeImage,
          variantKey,
        })
      );
      openDialog();
    }
  };

  if (!product) {
    return (
      <div className='text-center py-10 text-gray-600 font-mont text-lg'>
        পণ্য খুঁজে পাওয়া যায়নি
      </div>
    );
  }

  const variantTitle = variantKey
    ? `একটি ${variantKey === 'color' ? 'রং' : 'ধরণ'} নির্বাচন করুন`
    : 'ভেরিয়েন্ট';

  const renderVariantButton = (variant) => {
    const value = getVariantValue(variant);
    if (variantKey === 'color') {
      return (
        <button
          className='w-8 h-8 rounded-full focus:outline-none'
          style={{
            backgroundColor: value ? value.toLowerCase() : 'transparent',
          }}
        ></button>
      );
    } else if (variantKey === 'type') {
      return (
        <div className='flex items-center gap-2'>
          {value === 'iOS' && <FaApple className='text-xl text-gray-800' />}
          {value === 'Android' && (
            <FaAndroid className='text-xl text-gray-800' />
          )}
          <span className='text-sm font-semibold'>{value}</span>
        </div>
      );
    }
    return null;
  };

  const faqData = [
    {
      question: 'এই ট্র্যাকারটি কি Android এবং iOS-এর সাথে কাজ করে?',
      answer:
        'জ্বী, এন্ড্রোয়েড এবং আইওএস এর জন্য দুটি ভিন্ন ভেরিয়েন্টে পাওয়া যায়। কেনার সময় আপনার পছন্দের ভেরিয়েন্টটি নির্বাচন করতে পারবেন।',
    },
    {
      question: 'ট্র্যাকার হারিয়ে গেলে কি লোকেশন দেখা যাবে?',
      answer:
        'অবশ্যই! এটি Google Find Hub (Android-এর জন্য) অথবা Apple Find My (iOS-এর জন্য) নেটওয়ার্ক ব্যবহার করে। ফলে অন্য ব্যবহারকারীদের ডিভাইসের মাধ্যমে ট্র্যাকারটির লোকেশন ম্যাপে দেখা যাবে।',
    },
    {
      question: 'ব্যাটারি কতদিন চলে এবং এটি কি পরিবর্তন করা যায়?',
      answer:
        'সাধারণত একটি CR2032 বোতাম ব্যাটারি 9 থেকে 12 মাস পর্যন্ত চলতে পারে। ব্যাটারি শেষ হলে আপনি নিজেই তা খুব সহজে পরিবর্তন করতে পারবেন।',
    },
    {
      question: 'ট্র্যাকারটি কি ওয়াটারপ্রুফ?',
      answer:
        'হ্যাঁ, এটি IP65 রেটিং সহ ওয়াটার-রেজিস্ট্যান্ট। অর্থাৎ সামান্য বৃষ্টি বা জলের ছিটা লাগলে কোনো সমস্যা হবে না। তবে এটি পুরোপুরি জলে ডুবানো উচিত নয়।',
    },
  ];

  const reviewsData = [
    {
      name: 'আরিফ হোসেন',
      rating: 5,
      text: 'অ্যান্ড্রয়েড ভার্সনটি নিয়েছি, দারুণ কাজ করে! চাবির রিং-এ লাগিয়ে রেখেছি, আর ভুল করে চাবি রেখে চলে গেলে সাথে সাথে নোটিফিকেশন আসছে। খুবই কাজের একটি ডিভাইস।',
    },
    {
      name: 'সুমাইয়া রহমান',
      rating: 4,
      text: 'আইওএস-এর জন্য পারফেক্ট। ফাইন্ড মাই অ্যাপে খুব দ্রুত লোকেশন আপডেট হয়। ব্যাগের জন্য কিনেছি, এখন আর দুশ্চিন্তা করতে হয় না।',
    },
  ];

  return (
    <>
      <Head>
        <title>Hoco/Borofone Anti-Lost Tracker | Kino Mart</title>
        <meta
          name='description'
          content='Discover the Hoco/Borofone  Anti-Lost Tracker at Kino Mart. Compatible with Apple Find My and Google Find Hub, IP65 water-resistant, with up to 12 months battery life.'
        />
        <meta
          property='og:title'
          content='Hoco/Borofone  Anti-Lost Tracker | Kino Mart'
        />
        <meta
          property='og:description'
          content='Keep track of your valuables with the Hoco/Borofone Anti-Lost Tracker. Supports iOS and Android, IP65 water-resistant, and long-lasting battery.'
        />
        <meta
          property='og:url'
          content={`https://www.kinomart.store/product/${product.slug}`}
        />
        <meta property='og:type' content='product' />
        <meta property='og:image' content={product.images[0]} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='Hoco/Borofone  Anti-Lost Tracker | Kino Mart'
        />
        <meta
          name='twitter:description'
          content='Track your keys, bags, or wallet with the Hoco/Borofone Anti-Lost Tracker. IP65 water-resistant, iOS/Android compatible, long battery life.'
        />
        <meta name='twitter:image' content={product.images[0]} />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.title,
              image: product.images,
              description: 'Hoco/Borofone  Anti-Lost Tracker | Kino Mart',
              sku: product.id,
              brand: {
                '@type': 'Brand',
                name: 'Borofone',
              },
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
      <Navbar />
      <div className='py-6 sm:py-8 container mx-auto px-4 sm:px-6 lg:px-8'>
        <style jsx>{`
          .image-transition {
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
          }
          .image-transition:hover {
            transform: scale(1.02);
          }
          .small-image {
            transition: opacity 0.2s ease-in-out, border-color 0.2s ease-in-out;
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
          .variant-button {
            transition: all 0.2s ease-in-out;
            min-width: 40px;
          }
          .variant-button-active {
            border-color: #3b82f6 !important;
            transform: scale(1.05);
            background-color: #a4dd00;
          }
        `}</style>
        <div className='bg-white py-4 sm:py-6 rounded-xl shadow-lg'>
          <div className='flex flex-col lg:flex-row gap-4 sm:gap-6'>
            {/* Image Section */}
            <div className='w-full lg:w-3/5 px-4'>
              <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
                <div className='col-span-1 sm:col-span-3'>
                  <img
                    className='w-full h-64 sm:h-80 lg:h-[400px] object-cover rounded-lg image-transition'
                    src={activeImage}
                    alt={product.title}
                  />
                  <div className='flex justify-center gap-2 mt-4 sm:hidden'>
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer small-image ${
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
                <div className='hidden sm:flex flex-col items-center gap-4'>
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
              <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold font-mont text-gray-800 mb-2 sm:mb-4'>
                {product.title}
              </h2>
              <p className='text-gray-600 text-sm sm:text-base font-mont mb-4'>
                {product.description}
              </p>
              {product.variants &&
                product.variants.length > 0 &&
                variantKey && (
                  <div className='mb-6'>
                    <span className='font-semibold text-gray-700 text-sm sm:text-base'>
                      {variantTitle}
                    </span>
                    <div className='flex flex-col md:flex row items-start md:items-start gap-3 mt-4 flex-wrap'>
                      {product.variants.map((variant, index) => {
                        const value = getVariantValue(variant);
                        return (
                          <div
                            key={index}
                            className={`border-2 flex items-center justify-center rounded-lg cursor-pointer variant-button ${
                              variantKey === 'color'
                                ? 'p-1'
                                : 'px-4 py-2 text-gray-800 border-gray-300 hover:bg-gray-100'
                            } ${
                              selectedColor === value
                                ? 'variant-button-active'
                                : ''
                            }`}
                            onClick={() => handleVariantChange(value)}
                          >
                            {renderVariantButton(variant)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              <div className='flex items-center justify-start gap-2 text-md mb-6'>
                <span className='text-black font-bold text-lg sm:text-xl'>
                  ৳ {product.price.toFixed(2)}
                </span>
                <span className='text-gray-500 font-normal text-base sm:text-lg line-through'>
                  ৳ {product.originalPrice.toFixed(2)}
                </span>
              </div>
              <div className='flex items-center justify-start gap-4 mb-6'>
                <div className='flex items-center border border-gray-400 rounded-lg bg-white'>
                  <button
                    type='button'
                    onClick={() => handleQuantityChange('decrement')}
                    className='hover:bg-gray-200 rounded-l-lg py-2 px-3 sm:px-4 h-10 sm:h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none'
                  >
                    <svg
                      className='w-2 h-2 text-gray-900'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 18 2'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M1 1h16'
                      />
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
                    <svg
                      className='w-2 h-2 text-gray-900'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 18 18'
                    >
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 1v16M1 9h16'
                      />
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
            </div>
          </div>
        </div>
      </div>
      <CustomSection>
        <div className='px-3 sm:px-4'>
          <div className='bg-white p-4 sm:p-5 rounded-lg'>
            <h2 className='text-lg sm:text-xl font-semibold mb-3'>
              পণ্যের বিবরণ
            </h2>
            <p className='text-gray-600 font-mont text-sm sm:text-base'>
              আপনার মূল্যবান জিনিসপত্রের খোঁজ রাখুন{' '}
              <strong>Hoco/Borofone অ্যান্টি-লস্ট ট্র্যাকার</strong>-এর মাধ্যমে।
              এটি একটি মসৃণ ও কম্প্যাক্ট ডিভাইস যা আপনার জিনিসপত্র সুরক্ষিত
              রাখতে সাহায্য করবে। এটি <strong>Google Find Hub</strong> (Android)
              এবং <strong>Apple Find My</strong> (iOS)-এর সাথে কাজ করার জন্য
              ডিজাইন করা হয়েছে।
            </p>
            <p className='py-4 sm:py-5 text-gray-600 font-mont text-sm sm:text-base font-semibold'>
              মূল বৈশিষ্ট্যসমূহ:
            </p>
            <ul className='space-y-3 text-gray-700 font-mont text-sm sm:text-base'>
              <li className='flex flex-col md:flex row items-start md:items-start gap-3'>
                <span className='font-semibold'>
                  Works with Android Find My Device:
                </span>{' '}
                সরাসরি Google Find Hub অ্যাপে ট্র্যাক করা যাবে।
              </li>
              <li className='flex flex-col md:flex row items-start md:items-start gap-3'>
                <span className='font-semibold'>Works with Apple Find My:</span>{' '}
                Apple-এর নিজস্ব নেটওয়ার্কের মাধ্যমেও লোকেশন জানা যায় (iOS
                ভেরিয়েন্টের জন্য)।
              </li>
              <li className='flex flex-col md:flex row items-start md:items-start gap-3'>
                <span className='font-semibold'>
                  Global Positioning Support:
                </span>{' '}
                হারিয়ে গেলে সরাসরি ম্যাপে সঠিক লোকেশন দেখা যাবে।
              </li>
              <li className='flex flex-col md:flex row items-start md:items-start gap-3'>
                <span className='font-semibold'>Privacy Protection:</span>{' '}
                গুগল/অ্যাপলের সিকিউরিটি সিস্টেমে আপনার তথ্য সম্পূর্ণ সুরক্ষিত।
              </li>
              <li className='flex flex-col md:flex row items-start md:items-start gap-3'>
                <span className='font-semibold'>Replaceable Battery:</span>{' '}
                ব্যাটারি শেষ হলে সহজেই নতুন CR2032 ব্যাটারি ব্যবহার করা যাবে
                (9-12 মাস ব্যাটারি লাইফ)।
              </li>
              <li className='flex flex-col md:flex row items-start md:items-start gap-3'>
                <span className='font-semibold'>Compact & Portable:</span> ছোট,
                হালকা ও সহজে বহনযোগ্য (চাবি, ব্যাগ বা ওয়ালেটে লাগানো যাবে)।
              </li>
              <li className='flex flex-col md:flex row items-start md:items-start gap-3'>
                <span className='font-semibold'>Multi-Usage:</span> চাবি, ব্যাগ,
                লাগেজ, ওয়ালেট, এমনকি পোষা প্রাণীর জন্যও ব্যবহারযোগ্য।
              </li>
            </ul>
          </div>
          <div className='bg-white p-4 sm:p-5 rounded-lg mt-4 sm:mt-6'>
            <h2 className='text-lg sm:text-xl font-semibold flex items-center gap-2 mb-3'>
              <FaUser className='text-blue-500' /> ইউজার গাইড
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
              <div>
                <p className='text-gray-600 font-mont text-sm sm:text-base'>
                  আপনার <strong>অ্যান্টি-লস্ট ট্র্যাকার</strong> ব্যবহার শুরু
                  করতে এই সহজ ধাপগুলো অনুসরণ করুন:
                </p>
                <ol className='list-decimal list-inside text-gray-600 font-mont text-sm sm:text-base mt-4 space-y-3'>
                  <li>
                    <span className='font-semibold'>ব্যাটারি স্থাপন:</span>{' '}
                    ট্র্যাকারটির পেছনের কভার খুলে CR2032 বোতাম ব্যাটারিটি প্রবেশ
                    করান। (+) চিহ্ন উপরে রেখে কভারটি শক্তভাবে বন্ধ করুন।
                  </li>
                  <li>
                    <span className='font-semibold'>পেয়ারিং শুরু:</span>{' '}
                    ট্র্যাকারের বাটনটি চাপুন এবং ধরে রাখুন যতক্ষণ না এটি শব্দ
                    করে পেয়ারিং মোডে যায়।
                  </li>
                  <li>
                    <span className='font-semibold'>অ্যাপের সাথে সংযোগ:</span>
                    <ul className='list-disc list-inside ml-5 mt-1 space-y-1'>
                      <li>
                        <strong>Android-এর জন্য:</strong> আপনার ফোনে{' '}
                        <strong>Google Find Hub</strong> অ্যাপটি খুলুন এবং
                        কাছাকাছি ডিভাইস হিসেবে ট্র্যাকারটি যুক্ত করুন।
                      </li>
                      <li>
                        <strong>iOS-এর জন্য:</strong> <strong>Find My</strong>{' '}
                        অ্যাপে যান, 'Items' ট্যাবে (+) আইকনে ট্যাপ করে 'Other
                        Supported Item' নির্বাচন করুন এবং স্ক্রিনের নির্দেশনা
                        অনুসরণ করুন।
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span className='font-semibold'>ব্যবহার শুরু:</span>{' '}
                    ট্র্যাকারটিকে আপনার চাবি, ব্যাগ বা ওয়ালেটে সংযুক্ত করুন।
                    এখন আপনি অ্যাপের মাধ্যমে এটির রিয়েল-টাইম লোকেশন দেখতে
                    পারবেন এবং কাছাকাছি থাকলে শব্দ বাজাতে পারবেন।
                  </li>
                  <li>
                    <span className='font-semibold'>নোটিফিকেশন সেটআপ:</span>{' '}
                    অ্যাপের সেটিংসে 'Notify When Left Behind' বা 'হারিয়ে গেলে
                    জানান' অপশনটি চালু করুন, যাতে আপনি জিনিসটি ভুলে গেলে
                    অ্যালার্ট পেতে পারেন।
                  </li>
                </ol>
              </div>
              <div className='flex flex-col gap-4'>
                <div className='w-full aspect-video rounded-xl overflow-hidden'>
                  <iframe
                    className='w-full h-full'
                    src='https://www.youtube.com/embed/DXhqtG9eHuc'
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                  ></iframe>
                </div>
                <div className='w-full aspect-video rounded-xl overflow-hidden'>
                  <iframe
                    className='w-full h-full' //youtube.com/shorts/OfuMSheZQ8A?feature=share
                    src='https://www.youtube.com/embed/OfuMSheZQ8A'
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div></div>
            </div>
          </div>
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
          <div className='bg-white p-4 sm:p-5 rounded-lg mt-4 sm:mt-6'>
            <h2 className='text-lg sm:text-xl font-semibold flex items-center gap-2 mb-3'>
              <FaRegCommentDots className='text-purple-500' /> গ্রাহক রিভিউ
            </h2>
            <div className='mt-4 space-y-4'>
              {reviewsData.map((review, index) => (
                <div
                  key={index}
                  className='p-4 border border-gray-100 rounded-lg bg-gray-50'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <p className='text-sm sm:text-base font-semibold text-gray-800'>
                      {review.name}
                    </p>
                    <div className='text-yellow-500 text-sm'>
                      {Array(review.rating)
                        .fill()
                        .map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                    </div>
                  </div>
                  <p className='text-gray-600 text-sm sm:text-base italic'>
                    "{review.text}"
                  </p>
                </div>
              ))}
              <button className='mt-3 text-blue-600 font-medium text-sm sm:text-base hover:underline'>
                সকল রিভিউ দেখুন
              </button>
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
