import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { GoShareAndroid } from 'react-icons/go';
import {
  FaQuestionCircle,
  FaUser,
  FaRegCommentDots,
  FaGlobe,
  FaPlug,
} from 'react-icons/fa';
import Navbar from '@/components/common/Navbar';
import CustomSection from '@/components/layout/CustomSection';
import { products } from '@/utils/products';
import { addToCart } from '@/store/cartSlice';
import { useCartDialog } from '@/context/CartDialogContext';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { BsThunderbolt } from 'react-icons/bs';

// Find the specific product for this page
const productData = products.find(
  (p) => p.slug === '20w-universal-travel-adapter',
);

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
  const [remainingTime, setRemainingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Variant-specific pricing data
  const variantData = {
    '20W': { price: 1290, originalPrice: 1550 },
    '35W': { price: 1650, originalPrice: 1850 },
    '45W': { price: 1799, originalPrice: 2050 },
    '65W': { price: 2499, originalPrice: 2900 },
  };

  const variantToIndex = {
    '20W': 0,
    '35W': 1,
    '45W': 2,
    '65W': 3,
  };

  const getSelectedVariantData = () => {
    return selectedColor && variantData[selectedColor]
      ? variantData[selectedColor]
      : {
          price: product?.price || 0,
          originalPrice: product?.originalPrice || 0,
        };
  };

  const selectedVariantData = getSelectedVariantData();

  // Timer effect
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);

      const diffMs = tomorrow.getTime() - now.getTime();
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setRemainingTime({ hours, minutes, seconds });
      } else {
        setRemainingTime({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (viewItemFired.current) return;
    viewItemFired.current = true;
    if (initialProduct) {
      setProduct(initialProduct);
      const key = getVariantKey(initialProduct.variants);
      setVariantKey(key);
      const initialVariant = initialProduct.variants[0]
        ? initialProduct.variants[0][key]
        : '';
      setselectedColor(initialVariant);
      const initialIndex = variantToIndex[initialVariant];
      setActiveImage(
        initialProduct.images[initialIndex] || initialProduct.images[0] || '',
      );

      // GTM Data Layer Push (only on client-side)
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        const initialVariantData = variantData[initialVariant] || {
          price: initialProduct.price || 0,
          originalPrice: initialProduct.originalPrice || 0,
        };
        window.dataLayer.push({
          event: 'view_item',
          ecommerce: {
            items: [
              {
                item_id: initialProduct.id || 'unknown',
                item_name: initialProduct.title || 'unknown',
                price: initialVariantData.price,
                original_price: initialVariantData.originalPrice,
                item_category: 'Accessories',
                item_variant: initialVariant,
              },
            ],
            currency: 'BDT',
            value: initialVariantData.price,
          },
        });
      }
    }
  }, [initialProduct]); // Removed selectedColor to avoid re-pushing view_item

  const handleImageClick = (image) => {
    setActiveImage(image);
  };

  const handleVariantChange = (value) => {
    setselectedColor(value);
    const index = variantToIndex[value];
    if (index !== undefined && product.images[index]) {
      setActiveImage(product.images[index]);
    }
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
            value: selectedVariantData.price * quantity,
            items: [
              {
                item_id: product.id || 'unknown',
                item_name: product.title || 'unknown',
                price: selectedVariantData.price,
                original_price: selectedVariantData.originalPrice,
                item_category: 'Accessories',
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
          price: selectedVariantData.price,
          selectedColor,
          quantity,
          image: activeImage,
          variantKey,
        }),
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

  const variantTitle = 'Watt নির্বাচন করুন';

  const renderVariantButton = (variant) => {
    const value = getVariantValue(variant);
    if (variantKey === 'type') {
      const varData = variantData[value];
      return (
        <div className='flex items-center gap-2'>
          <BsThunderbolt className='text-xl text-gray-800' />
          <span className='text-sm font-semibold'>{value}</span>
          <span className='text-xs text-gray-600'>
            ৳{varData ? varData.price : 'N/A'}
          </span>
        </div>
      );
    }
    return null;
  };

  const faqData = [
    {
      question:
        'এই ইউনিভার্সাল অ্যাডাপ্টারটি কোন কোন দেশের প্লাগের সাথে কাজ করে?',
      answer:
        'এটি বিশ্বের প্রায়শই ব্যবহৃত সব ধরনের প্লাগ (Type A, B, C, G, I) সাপোর্ট করে। ইউরোপ, আমেরিকা, এশিয়া, অস্ট্রেলিয়া ইত্যাদি সব জায়গায় ব্যবহারযোগ্য।',
    },
    {
      question: 'এটি কি দ্রুত চার্জিং সাপোর্ট করে?',
      answer:
        'হ্যাঁ, PD (Power Delivery) এবং QC (Quick Charge) প্রোটোকল সাপোর্ট করে। 20W থেকে 65W পর্যন্ত আউটপুট, যা আপনার স্মার্টফোন, ট্যাবলেট বা ল্যাপটপ দ্রুত চার্জ করবে।',
    },
    {
      question: 'অ্যাডাপ্টারটি কি নিরাপদ?',
      answer:
        'অবশ্যই! এতে ওভারহিট প্রোটেকশন, শর্ট সার্কিট প্রোটেকশন এবং সার্জ প্রোটেকশন রয়েছে। UL/CE সার্টিফাইড কম্পোনেন্টস ব্যবহার করা হয়েছে।',
    },
    {
      question: 'এটি কতটা হালকা এবং বহনযোগ্য?',
      answer:
        'মাত্র 100 গ্রামের কম ওজনের এবং কম্প্যাক্ট সাইজ (5x5x3 সেমি)। ট্রাভেল ব্যাগে সহজেই রাখা যায় এবং ফোল্ডেবল পিন ডিজাইন।',
    },
  ];

  const reviewsData = [
    {
      name: 'আব্দুল্লাহ আল মামুন',
      rating: 5,
      text: '20W ভার্সন নিয়েছি, ইউরোপ ট্রিপে পারফেক্ট কাজ করেছে! সব ডিভাইস চার্জ হয়েছে দ্রুত, কোনো সমস্যা নেই। খুবই ডুরেবল।',
    },
    {
      name: 'নীলিমা আহমেদ',
      rating: 4,
      text: '20W অ্যাডাপ্টার দিয়ে ল্যাপটপও চার্জ করছি। বিভিন্ন দেশের সকেটে ফিট হয়েছে, কিন্তু একটু ভারী লাগে ব্যাগে। তবু সুপার প্রোডাক্ট!',
    },
  ];

  // Default schema price to first variant for SEO
  const defaultSchemaPrice = variantData['20W']
    ? variantData['20W'].price
    : product.price;

  return (
    <>
      <Head>
        <title>20W Universal Travel Adapter | Kino Mart</title>
        <meta
          name='description'
          content='Discover the 20W Universal Travel Adapter at Kino Mart. Compatible worldwide plugs, fast charging PD/QC, compact design for travel.'
        />
        <meta
          property='og:title'
          content='20W Universal Travel Adapter | Kino Mart'
        />
        <meta
          property='og:description'
          content='Charge anywhere with the Universal Travel Adapter. Supports multiple plug types, fast charging up to 65W, lightweight and safe.'
        />
        <meta
          property='og:url'
          content={`https://www.kinomart.com/product/${product.slug}`}
        />
        <meta property='og:type' content='product' />
        <meta property='og:image' content={product.images[0]} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='20W Universal Travel Adapter | Kino Mart'
        />
        <meta
          name='twitter:description'
          content='Universal adapter for global travel. Fast charging, multi-plug compatibility, compact and safe design.'
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
              description: '20W Universal Travel Adapter | Kino Mart',
              sku: product.id,
              brand: {
                '@type': 'Brand',
                name: 'Universal',
              },
              offers: {
                '@type': 'Offer',
                url: `https://www.kinomart.com/product/${product.slug}`,
                priceCurrency: 'BDT',
                price: defaultSchemaPrice,
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
          .variant-button {
            transition: all 0.2s ease-in-out;
            min-width: 40px;
          }
          .variant-button-active {
            border-color: #000000 !important;
            transform: scale(1.05);
            background-color: #a4dd00;
          }
          .timer-container {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 8px 12px;
            border-radius: 2px;
            font-weight: 600;
            font-size: 0.875rem;
            box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
        `}</style>
        <div className='bg-white py-4 sm:py-6 rounded-xl shadow-lg'>
          <div className='flex flex-col lg:flex-row gap-4 sm:gap-6'>
            {/* Image Section */}
            <div className='w-full lg:w-3/5 px-4'>
              <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
                <div className='col-span-1 sm:col-span-3'>
                  <img
                    className='w-full h-72  lg:h-[400px] object-cover rounded-lg image-transition'
                    src={activeImage}
                    alt={product.title}
                  />
                  {/* <div className='flex justify-center gap-2 mt-4 sm:hidden'>
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        className={`w-16 h-16  sm:h-20 object-cover rounded-lg cursor-pointer small-image ${
                          activeImage === image
                            ? 'small-image-active'
                            : 'small-image-inactive'
                        }`}
                        src={image}
                        alt={`${product.title} থাম্বনেইল ${index + 1}`}
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
                  </div> */}
                </div>
                {/* <div className='hidden sm:flex flex-col items-center gap-4'>
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
                </div> */}
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
              <div suppressHydrationWarning className='timer-container mb-4'>
                অফার শেষ হবে {remainingTime.hours} ঘন্টা {remainingTime.minutes}{' '}
                মিনিট {remainingTime.seconds} সেকেন্ড পরেই।
              </div>
              {/* {product.variants &&
                product.variants.length > 0 &&
                variantKey && (
                  <div className='mb-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
                      <span className='font-semibold text-gray-700 text-sm sm:text-base'>
                        {variantTitle}
                      </span>
                    </div>
                    <div className='flex flex-col md:flex-row items-start md:items-center gap-3 mt-4 flex-wrap'>
                      {product.variants.map((variant, index) => {
                        const value = getVariantValue(variant);
                        const isSelected = selectedColor === value;
                        return (
                          <div
                            key={index}
                            className={`border-2 flex items-center justify-center rounded-lg cursor-pointer variant-button px-4 py-2 text-gray-800 border-gray-300 hover:bg-gray-100 ${
                              isSelected ? 'variant-button-active' : ''
                            }`}
                            onClick={() => handleVariantChange(value)}
                          >
                            {renderVariantButton(variant)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )} */}
              <div className='flex items-center justify-start gap-2 text-md mb-6'>
                <span className='text-black font-bold text-lg sm:text-xl'>
                  ৳ {selectedVariantData.price.toFixed(2)}
                </span>
                <span className='text-gray-500 font-normal text-base sm:text-lg line-through'>
                  ৳ {selectedVariantData.originalPrice.toFixed(2)}
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
              <p className='text-sm text-blue-600 font-semibold mb-2'>
                #স্টকে আছে 56 টি প্রোডাক্ট
              </p>
              <p className='text-sm text-gray-600 font-semibold'>
                *প্রতিটি প্রোডাক্টের সাথে পেয়ে যাচ্ছেন 1 বছরের ওয়ারেন্টি ।
              </p>
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
              বিশ্বভ্রমণের জন্য আদর্শ{' '}
              <strong>ইউনিভার্সাল ট্রাভেল অ্যাডাপ্টার</strong> যা আপনার সকল
              ডিভাইসকে যেকোনো দেশের সকেট থেকে চার্জ করতে সাহায্য করবে। এটি
              কম্প্যাক্ট, হালকা এবং দ্রুত চার্জিং সাপোর্ট করে।
            </p>
            <p className='py-4 sm:py-5 text-gray-600 font-mont text-sm sm:text-base font-semibold'>
              মূল বৈশিষ্ট্যসমূহ:
            </p>
            <ul className='space-y-3 text-gray-700 font-mont text-sm sm:text-base'>
              <li className='flex flex-col md:flex-row items-start md:items-center gap-3'>
                <span className='font-semibold flex items-center gap-2'>
                  <FaGlobe /> Universal Compatibility:
                </span>{' '}
                Type A/B/C/G/I প্লাগ সাপোর্ট, 150+ দেশে ব্যবহারযোগ্য।
              </li>
              <li className='flex flex-col md:flex-row items-start md:items-center gap-3'>
                <span className='font-semibold flex items-center gap-2'>
                  <BsThunderbolt /> Fast Charging:
                </span>{' '}
                PD 3.0 এবং QC 3.0 সাপোর্ট, 20W আউটপুট।
              </li>
              <li className='flex flex-col md:flex-row items-start md:items-center gap-3'>
                <span className='font-semibold flex items-center gap-2'>
                  <FaPlug /> Multi-Port:
                </span>{' '}
                USB-A এবং USB-C পোর্ট সহ একসাথে একাধিক ডিভাইস চার্জ।
              </li>
              <li className='flex flex-col md:flex-row items-start md:items-center gap-3'>
                <span className='font-semibold'>Safety Features:</span> ওভারহিট,
                শর্ট সার্কিট এবং সার্জ প্রোটেকশন।
              </li>
              <li className='flex flex-col md:flex-row items-start md:items-center gap-3'>
                <span className='font-semibold'>Portable Design:</span> ফোল্ডেবল
                পিন, হালকা ওজন (80g), ট্রাভেল কেস সহ।
              </li>
              <li className='flex flex-col md:flex-row items-start md:items-center gap-3'>
                <span className='font-semibold'>LED Indicator:</span> চার্জিং
                স্ট্যাটাস দেখানোর জন্য LED লাইট।
              </li>
            </ul>

            {/* Product Gallery Grid */}
          </div>
          <div className='bg-white p-4 sm:p-5 rounded-lg mt-4 sm:mt-6'>
            <h2 className='text-lg sm:text-xl font-semibold flex items-center gap-2 mb-3'>
              <FaUser className='text-blue-500' /> ইউজার গাইড
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
              <div>
                <p className='text-gray-600 font-mont text-sm sm:text-base'>
                  আপনার <strong>ইউনিভার্সাল ট্রাভেল অ্যাডাপ্টার</strong> ব্যবহার
                  শুরু করতে এই সহজ ধাপগুলো অনুসরণ করুন:
                </p>
                <ol className='list-decimal list-inside text-gray-600 font-mont text-sm sm:text-base mt-4 space-y-3'>
                  <li>
                    <span className='font-semibold'>প্লাগ সিলেকশন:</span> আপনার
                    ট্রাভেল দেশের সকেট টাইপ অনুযায়ী অ্যাডাপ্টারের সঠিক পিন
                    নির্বাচন করুন (সুইচ করে)।
                  </li>
                  <li>
                    <span className='font-semibold'>কানেকশন:</span>{' '}
                    অ্যাডাপ্টারটি দেশের ওয়াল সকেটে প্লাগ করুন এবং লক করুন যাতে
                    খুলে না যায়।
                  </li>
                  <li>
                    <span className='font-semibold'>ডিভাইস চার্জ:</span> আপনার
                    ডিভাইসের চার্জার কেবলটি USB পোর্টে (A বা C) প্লাগ করুন। LED
                    লাইট জ্বলে উঠলে চার্জিং শুরু হয়েছে।
                  </li>
                  <li>
                    <span className='font-semibold'>মাল্টি-ডিভাইস:</span> একসাথে
                    একাধিক ডিভাইস চার্জ করতে দুটি পোর্ট ব্যবহার করুন (পাওয়ার
                    শেয়ারিং সাপোর্ট)।
                  </li>
                  <li>
                    <span className='font-semibold'>সেফটি চেক:</span> চার্জিং
                    শেষে অ্যাডাপ্টারটি খুলে রাখুন এবং ভ্রমণের সময় কেসে প্যাক
                    করুন।
                  </li>
                </ol>
              </div>
              {/* <div className='flex flex-col gap-4'>
                <div className='w-full aspect-video rounded-xl overflow-hidden'>
                  <iframe
                    className='w-full h-full'
                    src='https://www.youtube.com/embed/Cj2GBOi0umo'
                    title='Baseus Universal Travel Adapter Unboxing'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                  ></iframe>
                </div>
                <div className='w-full aspect-video rounded-xl overflow-hidden'>
                  <iframe
                    className='w-full h-full'
                    src='https://www.youtube.com/embed/KkleEPsokMw'
                    title='Epicka Pulse 45W Universal Travel Adapter Demo'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                  ></iframe>
                </div>
              </div> */}
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
              {/* <button className='mt-3 text-blue-600 font-medium text-sm sm:text-base hover:underline'>
                সকল রিভিউ দেখুন
              </button> */}
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
