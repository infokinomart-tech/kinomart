import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  FaBatteryFull,
  FaTint,
  FaShower,
  FaSnowflake,
  FaThermometerHalf,
  FaShieldAlt,
  FaQuestionCircle,
  FaUser,
  FaRegCommentDots,
  FaTeeth,
  FaTeethOpen,
  FaTooth,
  FaMobileAlt,
} from 'react-icons/fa';
import { GiWaterDrop } from 'react-icons/gi';
import Navbar from '@/components/common/Navbar';
import CustomSection from '@/components/layout/CustomSection';
import { products } from '@/utils/products';
import { addToCart } from '@/store/cartSlice';
import { useCartDialog } from '@/context/CartDialogContext';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Find the specific product for this page
const productData = products.find(
  (p) => p.slug === 'portable-electric-dental-water-flosser',
);

const ProductDetails = ({ initialProduct }) => {
  const dispatch = useDispatch();
  const { openDialog } = useCartDialog();
  const viewItemFired = useRef(false);
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [selectedColor, setSelectedColor] = useState('White');
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (viewItemFired.current) return;
    viewItemFired.current = true;
    if (initialProduct) {
      setProduct(initialProduct);
      setSelectedColor(initialProduct.variants?.[0]?.color || '');
      setActiveImage(initialProduct.images?.[0] || '');

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
                item_category: 'Oral Care',
                item_variant: initialProduct.variants?.[0]?.color || 'unknown',
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

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < 999) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBuyNow = () => {
    if (!product) {
      console.error('Product data is missing');
      return;
    }

    // Push add_to_cart event to data layer
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
              item_category: 'Oral Care',
              item_variant: selectedColor || 'unknown',
              quantity: quantity || 1,
            },
          ],
        },
      });
    }

    // Dispatch to Redux store
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

    // Redirect to order page
    openDialog();
  };

  if (!product) {
    return (
      <div className='text-center py-10 text-gray-600 font-mont text-lg'>
        পণ্য খুঁজে পাওয়া যায়নি
      </div>
    );
  }

  const faqData = [
    {
      question: 'ডেন্টাল ওয়াটার ফ্লসার কি ধরনের ডেন্টাল প্রডাক্ট?',
      answer:
        'ডেন্টাল ওয়াটার ফ্লসার হলো একটি ইলেকট্রিক ডিভাইস যা উচ্চচাপে পানির ধারা ব্যবহার করে দাঁতের ফাঁকে আটকে থাকা খাদ্যকণা, প্লাক এবং ব্যাকটেরিয়া দূর করে। এটি ট্রাডিশনাল ডেন্টাল ফ্লসের চেয়ে বেশি কার্যকর এবং মাড়ির জন্য কম ক্ষতিকর।',
    },
    {
      question: 'এই ওয়াটার ফ্লসারের কতটা পানির চাপ (PSI) রয়েছে?',
      answer:
        'এই ডেন্টাল ওয়াটার ফ্লসারে 80-120 PSI (পাউন্ড প্রতি বর্গইঞ্চি) জলচাপ রয়েছে, যা দাঁতের ফাঁক পরিষ্কার করার জন্য আদর্শ। 3টি মোড (সফট, নরমাল, স্ট্রং) থাকায় আপনি আপনার মাড়ির অবস্থা অনুযায়ী চাপ নিয়ন্ত্রণ করতে পারবেন।',
    },
    {
      question: 'ব্যাটারি কতক্ষণ স্থায়ী হয় এবং কীভাবে চার্জ করতে হয়?',
      answer:
        'এই ফ্লসারে 1000mAh লিথিয়াম-আয়ন ব্যাটারি রয়েছে যা সম্পূর্ণ চার্জে 15-20 দিন পর্যন্ত ব্যবহার করা যায়। টাইপ-সি ইউএসবি পোর্টের মাধ্যমে চার্জ করা যায় এবং সম্পূর্ণ চার্জ হতে 2-3 ঘণ্টা সময় লাগে।',
    },
    {
      question: 'এটি কি পুরো পরিবারের ব্যবহারের জন্য উপযোগী?',
      answer:
        'হ্যাঁ, এই ফ্লসারটি 4টি পরিবর্তনযোগ্য নোজল (টিপ) দিয়ে আসে যাতে পরিবারের প্রতিটি সদস্য আলাদা আলাদা নোজল ব্যবহার করতে পারে। IPX7 ওয়াটারপ্রুফ রেটিং থাকায় এটি বাথরুমে নিরাপদে ব্যবহার করা যায়।',
    },
    {
      question: 'রেগুলার ডেন্টাল ফ্লসের তুলনায় এই ফ্লসারের সুবিধা কী?',
      answer:
        '1) মাড়িতে রক্তপাত কমায় 2) ব্রেস পরা ব্যক্তিদের জন্য আদর্শ 3) ডেন্টাল ব্রিজ বা ইমপ্ল্যান্ট ব্যবহারকারীদের জন্য নিরাপদ 4) অর্গোডক্সিক হ্যান্ডেল ডিজাইন সহজে ধরা যায় 5) ট্র্যাভেল ফ্রেন্ডলি - সহজে বহনযোগ্য',
    },
    {
      question: 'এটি ব্যবহারে কী কী সতর্কতা অবলম্বন করা উচিত?',
      answer:
        '1) প্রথম ব্যবহারে সর্বনিম্ন চাপে শুরু করুন 2) নোজল প্রতি 3-6 মাসে পরিবর্তন করুন 3) সম্পূর্ণ চার্জ না থাকলে ব্যবহার করবেন না 4) সরাসরি চোখে পানি পড়তে দেবেন না 5) শিশুদের তত্ত্বাবধানে ব্যবহার করান',
    },
  ];

  const reviewsData = [
    {
      name: 'ডা. রিফাত আহমেদ',
      rating: 5,
      text: 'আমি একজন ডেন্টিস্ট হিসেবে বলছি, এই ওয়াটার ফ্লসারটি রোগীদের সুপারিশ করার মতো। মাড়ির রোগীদের জন্য বিশেষভাবে উপকারী। 3টি মোড থাকায় সবাই নিজের উপযোগী চাপ পাচ্ছে।',
    },
    {
      name: 'আয়শা সিদ্দিকা',
      rating: 5,
      text: 'ব্রেস পরার পর থেকে ডেন্টাল ফ্লস করতে কষ্ট হতো। এই ফ্লসারটি পেয়ে জীবন সহজ হয়ে গেছে! ব্রেসের আড়ালে লেগে থাকা খাবার খুব সহজে বের হয়ে আসে।',
    },
    {
      name: 'রবিউল ইসলাম',
      rating: 4,
      text: 'টাইপ-সি চার্জিং এর জন্য বিশেষ ধন্যবাদ। এখন একই কেবল দিয়ে ফোন এবং ফ্লসার চার্জ করি। ব্যাটারি লাইফও দারুণ - একবার চার্জে প্রায় 3 সপ্তাহ চলে।',
    },
    {
      name: 'নুসরাত জাহান',
      rating: 5,
      text: 'পারিবারিক ব্যবহারের জন্য 4টি নোজল থাকা খুবই সুবিধাজনক। স্টোরেজ কেসটিও দারুণ - ভ্রমণের সময় নিয়ে যাওয়া যায়। ছোট শিশুদের দাঁত পরিষ্কার করতেও সাহায্য করে।',
    },
  ];

  const features = [
    {
      icon: <GiWaterDrop />,
      title: '80-120 PSI Water Pressure',
      desc: 'প্লাক এবং ব্যাকটেরিয়া দূর করে',
    },
    {
      icon: <FaBatteryFull />,
      title: '1000mAh Rechargeable Battery',
      desc: '15-20 দিনের ব্যাটারি ব্যাকআপ',
    },
    {
      icon: <FaShieldAlt />,
      title: 'IPX7 Waterproof',
      desc: 'সম্পূর্ণ ওয়াটারপ্রুফ ডিজাইন',
    },
    {
      icon: <FaTeeth />,
      title: '4 Interchangeable Nozzles',
      desc: 'পুরো পরিবারের জন্য উপযুক্ত',
    },
    {
      icon: <FaThermometerHalf />,
      title: '3 Adjustable Modes',
      desc: 'সফট, নরমাল, স্ট্রং',
    },
    {
      icon: <FaMobileAlt />,
      title: 'Type-C USB Charging',
      desc: 'দ্রুত চার্জিং সুবিধা',
    },
  ];

  return (
    <>
      <Head>
        <title>
          Portable Dental Water Flosser | 3 Modes, USB Rechargeable | Kino Mart
        </title>
        <meta
          name='description'
          content='বাংলাদেশে সেরা দামে Portable Dental Water Flosser কিনুন। 80-120 PSI জলচাপ, 3 অ্যাডজাস্টেবল মোড, 1000mAh ব্যাটারি এবং IPX7 ওয়াটারপ্রুফ।'
        />
        <meta
          name='keywords'
          content='ডেন্টাল ওয়াটার ফ্লসার, oral irrigator, water flosser price in bangladesh, portable dental cleaner, electric tooth cleaner, প্লাক রিমুভার'
        />
        <meta name='robots' content='index, follow' />
        <meta name='author' content='Kino Mart' />
        <link
          rel='canonical'
          href={`https://www.kinomart.com/product/${product.slug}`}
        />
        <meta property='og:type' content='product' />
        <meta
          property='og:title'
          content='Portable Dental Water Flosser | Kino Mart'
        />
        <meta
          property='og:description'
          content='80-120PSI জলচাপের Portable Dental Water Flosser - দাঁতের ফাঁক থেকে প্লাক, ব্যাকটেরিয়া দূর করুন। 3 মোড, USB রিচার্জেবল।'
        />
        <meta property='og:image' content={product.images[0]} />
        <meta
          property='og:url'
          content={`https://www.kinomart.com/product/${product.slug}`}
        />
        <meta property='og:site_name' content='Kino Mart' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='Portable Dental Water Flosser | Kino Mart'
        />
        <meta
          name='twitter:description'
          content='বাংলাদেশে সেরা দামে Portable Dental Water Flosser কিনুন। দাঁতের স্বাস্থ্য উন্নত করুন সহজে।'
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
              description:
                'Portable Electric Dental Water Flosser with 80-120PSI water pressure, 3 adjustable modes, USB rechargeable, and 4 interchangeable nozzles.',
              sku: product.id,
              brand: {
                '@type': 'Brand',
                name: 'Kino Mart',
              },
              offers: {
                '@type': 'Offer',
                url: `https://www.kinomart.com/product/${product.slug}`,
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
            border-color: #3b82f6;
            opacity: 1;
          }
          .small-image-inactive {
            opacity: 0.7;
            border-color: transparent;
          }
          .color-button {
            transition: all 0.2s ease-in-out;
          }
          .color-button-active {
            border-color: #3b82f6;
            transform: scale(1.1);
          }
        `}</style>
        <div className='bg-white py-4 sm:py-6 rounded-xl shadow-lg'>
          <div className='flex flex-col lg:flex-row gap-4 sm:gap-6'>
            {/* Image Section */}
            <div className='w-full lg:w-3/5 px-4'>
              <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
                <div className='col-span-1 sm:col-span-3'>
                  <img
                    className='w-full h-[400px] lg:h-[500px] object-cover rounded-lg image-transition'
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
                উন্নত 80-120 PSI জলচাপের পোর্টেবল ডেন্টাল ওয়াটার ফ্লসার। দাঁতের
                ফাঁকে আটকে থাকা খাদ্যকণা, প্লাক এবং ব্যাকটেরিয়া সহজেই দূর করুন।
                3টি অ্যাডজাস্টেবল মোড, 1000mAh রিচার্জেবল ব্যাটারি এবং IPX7
                ওয়াটারপ্রুফ ডিজাইন।
              </p>

              {/* Color Selection */}
              {/* {product.variants && product.variants.length > 0 && (
                <div className='mb-6'>
                  <span className='font-semibold text-gray-700 text-sm sm:text-base'>
                    কালার সিলেক্ট করুন
                  </span>
                  <div className='flex items-center gap-3 mt-4 flex-wrap'>
                    {product.variants.map((variant) => (
                      <div
                        key={variant.color}
                        className={`border-2 flex items-center justify-center rounded-full p-1 cursor-pointer color-button ${
                          selectedColor === variant.color
                            ? 'color-button-active'
                            : ''
                        }`}
                        onClick={() => handleColorChange(variant.color)}
                      >
                        <button
                          className='w-[30px] h-[30px] rounded-full'
                          style={{
                            backgroundColor:
                              variant.color.toLowerCase() === 'white'
                                ? '#ffffff'
                                : variant.color.toLowerCase() === 'blue'
                                ? '#3b82f6'
                                : variant.color.toLowerCase() === 'pink'
                                ? '#ec4899'
                                : variant.color.toLowerCase(),
                          }}
                        ></button>
                        <span className='px-2 text-sm font-semibold'>
                          {variant.color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              <div className='flex items-center justify-start gap-2 text-md mb-6'>
                <span className='font-bold text-lg sm:text-xl' style={{background:'linear-gradient(to right,#ef4444,#9f1239)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                  ৳ {product.price.toFixed(2)}
                </span>
                <span className='text-gray-500 font-normal text-base sm:text-lg line-through'>
                  ৳ {product.originalPrice.toFixed(2)}
                </span>
                <span className='bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded'>
                  23% ছাড়
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

              {/* Key Features Quick View */}
              <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
                <h3 className='font-semibold text-gray-800 mb-3'>
                  দ্রুত বৈশিষ্ট্যসমূহ:
                </h3>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex items-center gap-2'>
                    <GiWaterDrop className='text-blue-500' />
                    <span className='text-sm'>80-120 PSI চাপ</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaBatteryFull className='text-green-500' />
                    <span className='text-sm'>1000mAh ব্যাটারি</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaShieldAlt className='text-purple-500' />
                    <span className='text-sm'>IPX7 ওয়াটারপ্রুফ</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaTeeth className='text-pink-500' />
                    <span className='text-sm'>4টি নোজল</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomSection>
        <div className='px-3 sm:px-4'>
          {/* Product Description with Image */}
          <div className='bg-white p-4 sm:p-5 rounded-lg shadow-sm'>
            <h2 className='text-lg sm:text-xl font-semibold mb-3'>
              পণ্যের বিবরণ
            </h2>
            <p className='text-gray-600 font-mont text-sm sm:text-base mb-4'>
              <strong>পোর্টেবল ইলেকট্রিক ডেন্টাল ওয়াটার ফ্লসার</strong> আপনার
              মুখের স্বাস্থ্য রক্ষায় একটি বিপ্লবী পরিবর্তন আনবে। ট্র্যাডিশনাল
              ডেন্টাল ফ্লসের তুলনায় 50% বেশি কার্যকর এই ডিভাইসটি দাঁতের ফাঁকে
              লুকিয়ে থাকা ক্ষতিকর প্লাক এবং ব্যাকটেরিয়া সম্পূর্ণভাবে দূর করে।
              80-120 PSI (পাউন্ড প্রতি বর্গইঞ্চি) জলচাপের মাধ্যমে মাড়ি ম্যাসেজ
              করে রক্তসঞ্চালন বৃদ্ধি করে এবং মাড়ির রোগ প্রতিরোধ করে।
            </p>

            {/* Added Image in Description */}
            <div className='my-6 rounded-lg overflow-hidden border border-gray-200'>
              <img
                src='/assets/product/flosser/feature.jpg'
                alt='Dental Water Flosser Features'
                className='w-full h-auto rounded-lg'
              />
            </div>

            {/* Features Grid */}
            <div className='mt-8 mb-8'>
              <h3 className='text-lg font-semibold mb-6 text-center text-blue-600'>
                প্রধান বৈশিষ্ট্যসমূহ
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className='bg-blue-50 p-4 rounded-lg border border-blue-100 hover:border-blue-300 transition duration-300'
                  >
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='text-blue-600 text-xl'>
                        {feature.icon}
                      </div>
                      <h4 className='font-semibold text-gray-800'>
                        {feature.title}
                      </h4>
                    </div>
                    <p className='text-gray-600 text-sm'>{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className='py-4 sm:py-5 text-gray-600 font-mont text-sm sm:text-base font-semibold'>
              কার জন্য উপযোগী:
            </p>
            <ul className='space-y-3 text-gray-700 font-mont text-sm sm:text-base mb-6'>
              <li className='flex items-start gap-3'>
                <FaTooth className='text-green-500 mt-1 flex-shrink-0' />
                <span>
                  <strong>ব্রেস বা ডেন্টাল ইমপ্ল্যান্ট ব্যবহারকারী:</strong>{' '}
                  ব্রেসের ফাঁকে আটকে থাকা খাবার সহজেই বের করে আনে
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <FaTeethOpen className='text-blue-500 mt-1 flex-shrink-0' />
                <span>
                  <strong>মাড়ির সমস্যায় ভোগা ব্যক্তি:</strong> মাড়ি ম্যাসেজ
                  করে রক্তসঞ্চালন বৃদ্ধি করে
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <FaUser className='text-purple-500 mt-1 flex-shrink-0' />
                <span>
                  <strong>পুরো পরিবার:</strong> 4টি আলাদা নোজল থাকায় প্রত্যেকে
                  আলাদা আলাদা ব্যবহার করতে পারে
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <FaSnowflake className='text-teal-500 mt-1 flex-shrink-0' />
                <span>
                  <strong>ভ্রমণকারী:</strong> কম্প্যাক্ট ডিজাইন এবং ট্রাভেল কেস
                  সহ ভ্রমণের জন্য আদর্শ
                </span>
              </li>
            </ul>

            <div className='mt-8 p-4 bg-green-50 rounded-lg border border-green-100'>
              <h3 className='font-semibold text-green-800 mb-2'>
                স্বাস্থ্য উপকারিতা:
              </h3>
              <ul className='text-gray-700 text-sm space-y-2'>
                <li>✓ দাঁতের মাড়ির স্বাস্থ্য উন্নত করে</li>
                <li>✓ মাড়ি থেকে রক্ত পড়া কমায়</li>
                <li>✓ মুখের দুর্গন্ধ দূর করে</li>
                <li>✓ দাঁতের সংবেদনশীলতা কমায়</li>
                <li>✓ দাঁতের হলদে ভাব দূর করে</li>
              </ul>
            </div>
          </div>

          {/* User Guide Section */}
          <div className='bg-white p-4 sm:p-5 rounded-lg shadow-sm mt-6'>
            <h2 className='text-lg sm:text-xl font-semibold flex items-center gap-2 mb-3'>
              <FaUser className='text-blue-500' /> ব্যবহারকারী গাইড
            </h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div>
                <p className='text-gray-600 font-mont text-sm sm:text-base mb-4'>
                  আপনার <strong>ডেন্টাল ওয়াটার ফ্লসার</strong> সঠিকভাবে ব্যবহার
                  করতে এই ধাপগুলো অনুসরণ করুন:
                </p>
                <ol className='list-decimal list-inside text-gray-600 font-mont text-sm sm:text-base space-y-4'>
                  <li className='pb-3 border-b border-gray-100'>
                    <span className='font-semibold text-gray-800'>
                      প্রথম ব্যবহার:
                    </span>{' '}
                    ফ্লসারের পানির ট্যাঙ্কে বিশুদ্ধ পানি ভরুন। প্রাথমিকভাবে
                    সর্বনিম্ন মোডে (সফট) শুরু করুন।
                  </li>
                  <li className='pb-3 border-b border-gray-100'>
                    <span className='font-semibold text-gray-800'>
                      নোজল সংযুক্তকরণ:
                    </span>{' '}
                    আপনার পছন্দের নোজলটি ফ্লসারের হ্যান্ডেলে সেট করুন। প্রতিবার
                    ব্যবহারের পর নোজলটি পরিষ্কার করুন।
                  </li>
                  <li className='pb-3 border-b border-gray-100'>
                    <span className='font-semibold text-gray-800'>
                      সঠিক পদ্ধতি:
                    </span>{' '}
                    ফ্লসারটি 90 ডিগ্রি অ্যাঙ্গেলে দাঁতের গোড়ায় ধরে ধীরে ধীরে
                    দাঁতের লাইন বরাবর নাড়ান।
                  </li>
                  <li className='pb-3 border-b border-gray-100'>
                    <span className='font-semibold text-gray-800'>
                      ট্রাবলশুটিং:
                    </span>{' '}
                    যদি পানির ধারা দুর্বল হয়, নোজলটি পরিষ্কার করুন বা পানির
                    ট্যাঙ্কের ভেন্ট খুলুন।
                  </li>
                  <li>
                    <span className='font-semibold text-gray-800'>
                      রক্ষণাবেক্ষণ:
                    </span>{' '}
                    ব্যবহারের পর পানি ট্যাঙ্ক খালি করুন এবং হ্যান্ডেল শুকিয়ে
                    রাখুন। নিয়মিত নোজল পরিবর্তন করুন।
                  </li>
                </ol>
              </div>
              <div className='flex flex-col gap-4'>
                <div className='w-full aspect-video rounded-xl overflow-hidden shadow-md'>
                  <iframe
                    className='w-full h-full'
                    src='https://www.youtube.com/embed/-HgMZUzLsJg?si=Nd9wUEH22_hLBEDa'
                    title='How to Use Water Flosser'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                  ></iframe>
                </div>
                <div className='p-3 bg-gray-50 rounded-lg'>
                  <p className='text-sm text-gray-600'>
                    <strong>টিপ:</strong> প্রথম সপ্তাহে দিনে একবার ব্যবহার করুন,
                    তারপর ধীরে ধীরে ব্যবহার বৃদ্ধি করুন।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className='bg-white p-4 sm:p-5 rounded-lg shadow-sm mt-6'>
            <h2 className='text-lg sm:text-xl font-semibold flex items-center gap-2 mb-3'>
              <FaQuestionCircle className='text-red-500' /> প্রায়শই জিজ্ঞাসিত
              প্রশ্নাবলী
            </h2>
            <div className='mt-4 space-y-4'>
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className='border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition duration-200'
                >
                  <p className='text-gray-800 font-semibold mb-2 text-sm sm:text-base flex items-start gap-2'>
                    <span className='text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs'>
                      Q{index + 1}
                    </span>
                    {faq.question}
                  </p>
                  <p className='text-gray-600 font-mont text-sm sm:text-base pl-8'>
                    <span className='font-semibold text-green-600'>উত্তর:</span>{' '}
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews */}
          <div className='bg-white p-4 sm:p-5 rounded-lg shadow-sm mt-6'>
            <h2 className='text-lg sm:text-xl font-semibold flex items-center gap-2 mb-3'>
              <FaRegCommentDots className='text-purple-500' /> গ্রাহক রিভিউ
            </h2>
            <div className='mt-4 space-y-4'>
              {reviewsData.map((review, index) => (
                <div
                  key={index}
                  className='p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white transition duration-200'
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
              <div className='mt-4 pt-4 border-t border-gray-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold text-gray-800'>সর্বমোট রেটিং</p>
                    <div className='flex items-center gap-2 mt-1'>
                      <div className='text-yellow-500'>★★★★★</div>
                      <span className='text-gray-600 text-sm'>
                        4.7/5.0 (24 রিভিউ)
                      </span>
                    </div>
                  </div>
                  <button className='px-4 py-2 bg-blue-50 text-blue-600 font-medium text-sm sm:text-base rounded-lg hover:bg-blue-100 transition duration-200'>
                    সকল রিভিউ দেখুন
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className='bg-white p-4 sm:p-5 rounded-lg shadow-sm mt-6'>
            <h2 className='text-lg sm:text-xl font-semibold mb-3'>
              প্রযুক্তিগত বিবরণ
            </h2>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left text-gray-600'>
                <tbody>
                  <tr className='bg-gray-50'>
                    <td className='px-4 py-3 font-semibold'>পণ্যের নাম</td>
                    <td className='px-4 py-3'>
                      Portable Electric Dental Water Flosser
                    </td>
                  </tr>
                  <tr>
                    <td className='px-4 py-3 font-semibold'>জলচাপ</td>
                    <td className='px-4 py-3'>
                      80-120 PSI (3টি অ্যাডজাস্টেবল মোড)
                    </td>
                  </tr>
                  <tr className='bg-gray-50'>
                    <td className='px-4 py-3 font-semibold'>ব্যাটারি</td>
                    <td className='px-4 py-3'>
                      1000mAh লিথিয়াম-আয়ন, টাইপ-সি চার্জিং
                    </td>
                  </tr>
                  <tr>
                    <td className='px-4 py-3 font-semibold'>চার্জিং সময়</td>
                    <td className='px-4 py-3'>2-3 ঘণ্টা</td>
                  </tr>
                  <tr className='bg-gray-50'>
                    <td className='px-4 py-3 font-semibold'>
                      ব্যাটারি স্থায়িত্ব
                    </td>
                    <td className='px-4 py-3'>
                      15-20 দিন (দিনে 1 বার ব্যবহার)
                    </td>
                  </tr>
                  <tr>
                    <td className='px-4 py-3 font-semibold'>
                      ওয়াটারপ্রুফ রেটিং
                    </td>
                    <td className='px-4 py-3'>IPX7 (সম্পূর্ণ ওয়াটারপ্রুফ)</td>
                  </tr>
                  <tr className='bg-gray-50'>
                    <td className='px-4 py-3 font-semibold'>নোজলের সংখ্যা</td>
                    <td className='px-4 py-3'>4টি (পরিবর্তনযোগ্য)</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-3 font-semibold'>ওজন</td>
                    <td className='px-4 py-3'>250 গ্রাম</td>
                  </tr>
                  <tr className='bg-gray-50'>
                    <td className='px-4 py-3 font-semibold'>পণ্যের মাত্রা</td>
                    <td className='px-4 py-3'>18 × 5 × 5 সেমি</td>
                  </tr>
                </tbody>
              </table>
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
