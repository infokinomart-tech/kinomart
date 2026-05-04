import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from '@/components/common/Navbar';
import CustomSection from '@/components/layout/CustomSection';
import { products } from '@/utils/products';
import { addToCart } from '@/store/cartSlice';
import { useCartDialog } from '@/context/CartDialogContext';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaQuestionCircle } from 'react-icons/fa';

// Find the specific product for this page
const productData = products.find(
  (p) => p.slug === '3d-human-body-torso-model-for-kids',
);

const ProductDetails = ({ initialProduct }) => {
  const dispatch = useDispatch();
  const { openDialog } = useCartDialog();
  const viewItemFired = useRef(false);
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (viewItemFired.current) return;
    viewItemFired.current = true;
    if (initialProduct) {
      setProduct(initialProduct);
      setActiveImage(initialProduct.images[0] || '');

      // GTM Data Layer Push (updated category)
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
                item_category: 'Educational Toys',
                item_variant: 'Anatomy Model',
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
                item_category: 'Educational Toys',
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
          quantity,
          image: activeImage,
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

  const faqData = [
    {
      question: 'এই মডেলে কয়টি অঙ্গপ্রত্যঙ্গ আছে এবং সেগুলো কি কি?',
      answer:
        'সাধারণত 10-15 টি রিমুভেবল অঙ্গ থাকে (যেমন: হার্ট, লাংস, লিভার, স্টমাক, ইনটেস্টাইন, ব্রেন, কিডনি ইত্যাদি)। সঠিক সংখ্যা মডেলের ভার্সনের উপর নির্ভর করে – প্যাকেজিং-এ বিস্তারিত দেখুন।',
    },
    {
      question: 'এটি কোন বয়সের শিশুদের জন্য উপযুক্ত?',
      answer:
        'সাধারণত 5–12 বছর বয়সী শিশুদের জন্য আদর্শ। ছোট বাচ্চাদের ক্ষেত্রে অভিভাবকের তত্ত্বাবধানে ব্যবহার করা উচিত যাতে ছোট অংশ গিলে না ফেলে।',
    },
    {
      question: 'মডেলটি কি খুব সহজে ভেঙে যায় বা ক্ষতিগ্রস্ত হয়?',
      answer:
        'না, উন্নতমানের টেকসই প্লাস্টিক দিয়ে তৈরি। ডিজাইন করা হয়েছে শিশুদের হাতে-কলমে খেলার জন্য – তবে অযথা ফেলে দেওয়া বা জোর করে টানলে ক্ষতি হতে পারে।',
    },
    {
      question: 'অঙ্গগুলো কি সঠিকভাবে লেগে থাকে নাকি খুব সহজে খুলে যায়?',
      answer:
        'DIY অ্যাসেম্বলি সিস্টেমে ম্যাগনেট বা স্ন্যাপ-ফিট ডিজাইন ব্যবহার করা হয় যাতে শিশুরা সহজে জোড়া-খোলা করতে পারে, কিন্তু খেলার সময় স্থিতিশীল থাকে।',
    },
    {
      question: 'এতে কি কোনো লেবেল বা নাম লেখা থাকে অঙ্গগুলোতে?',
      answer:
        'হ্যাঁ, বেশিরভাগ মডেলে ইংরেজি/চাইনিজ/বাংলা লেবেল থাকে (বা আলাদা চার্ট দেওয়া থাকে) যাতে শিশুরা অঙ্গের নাম শিখতে পারে।',
    },
  ];

  return (
    <>
      <Head>
        <title>
          3ডি হিউম্যান বডি টর্সো মডেল – কিডস অ্যানাটমি লার্নিং টয় | Kino Mart
        </title>
        <meta
          name='description'
          content='শিশুদের জন্য 3ডি হিউম্যান টর্সো মডেল – DIY অর্গান অ্যাসেম্বলি, এডুকেশনাল অ্যানাটমি টিচিং টুল। খেলতে খেলতেই মানবদেহ সম্পর্কে শিখুন!'
        />
        <meta
          property='og:title'
          content='3ডি হিউম্যান বডি টর্সো মডেল – কিডস অ্যানাটমি লার্নিং টয় | Kino Mart'
        />
        <meta
          property='og:description'
          content='DIY অর্গান অ্যাসেম্বলি দিয়ে শিশুরা মজা করে মানবদেহের গঠন শিখবে। শিক্ষামূলক, টেকসই ও আকর্ষণীয় লার্নিং টয়।'
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

        {/* Main Product Section */}
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

            {/* Product Info & Buy */}
            <div className='w-full lg:w-2/5 px-4 sm:px-6 py-4'>
              <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold font-mont text-gray-800 mb-2 sm:mb-4'>
                {product.title}
              </h2>
              <p className='text-gray-600 text-sm sm:text-base font-mont mb-4'>
                {product.description}
              </p>
              <div className='flex items-center justify-start gap-2 text-md mb-6'>
                <span className='text-black font-bold text-lg sm:text-xl'>
                  ৳ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className='text-gray-500 font-normal text-base sm:text-lg line-through'>
                    ৳ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className='flex items-center justify-start gap-4 mb-6'>
                <div className='flex items-center border border-gray-400 rounded-lg bg-white'>
                  <button
                    onClick={() => handleQuantityChange('decrement')}
                    className='hover:bg-gray-200 rounded-l-lg py-2 px-3 sm:px-4 h-10 sm:h-11'
                  >
                    <svg
                      className='w-2 h-2 text-gray-900'
                      fill='none'
                      viewBox='0 0 18 2'
                    >
                      <path stroke='currentColor' strokeWidth='2' d='M1 1h16' />
                    </svg>
                  </button>
                  <input
                    type='text'
                    value={quantity}
                    readOnly
                    className='h-10 sm:h-11 w-12 sm:w-16 text-center text-gray-900 text-sm'
                  />
                  <button
                    onClick={() => handleQuantityChange('increment')}
                    className='hover:bg-gray-200 rounded-r-lg py-2 px-3 sm:px-4 h-10 sm:h-11'
                  >
                    <svg
                      className='w-2 h-2 text-gray-900'
                      fill='none'
                      viewBox='0 0 18 18'
                    >
                      <path
                        stroke='currentColor'
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
          {/* Gallery of product images */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6'>
            <img
              src='/assets/product/anatomy/sk-3.jpeg'
              alt='DIY Organ Assembly Anatomy Puzzle for Children'
              className='w-full h-40 sm:h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow'
            />
            <img
              src='/assets/product/anatomy/sk-6.jpg'
              alt='DIY Organ Assembly Anatomy Puzzle for Children'
              className='w-full h-40 sm:h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow'
            />
            <img
              src='https://m.media-amazon.com/images/I/618ZYBmhdlL.jpg'
              alt='Kids Anatomy Torso Model - Disassembled View'
              className='w-full h-40 sm:h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow'
            />

            <img
              src='https://m.media-amazon.com/images/I/51juIlMqGNL._AC_UF894,1000_QL80_.jpg'
              alt='Educational 3D Human Body Torso Learning Toy'
              className='w-full h-40 sm:h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow'
            />
          </div>

          {/* Product Description */}
          <div className='bg-white p-4 sm:p-5 rounded-lg'>
            <h2 className='text-lg sm:text-xl font-semibold mb-3'>
              পণ্যের বিবরণ
            </h2>
            <p className='text-gray-600 font-mont text-sm sm:text-base'>
              3ডি হিউম্যান বডি টর্সো মডেল <br />
              কিডস অ্যানাটমি লার্নিং টয় • DIY অর্গান অ্যাসেম্বলি • এডুকেশনাল
              টিচিং টুল <br />
              খেলতে খেলতেই মানবদেহ সম্পর্কে শেখা! 🧠✨
            </p>
            <p className='py-3 text-gray-600 font-mont text-sm sm:text-base'>
              এই 3ডি হিউম্যান বডি টর্সো মডেল শিশুদের জন্য বিশেষভাবে তৈরি একটি
              শিক্ষামূলক খেলনা, যা মানবদেহের অঙ্গপ্রত্যঙ্গ ও গঠন সহজ ও
              আনন্দদায়কভাবে বোঝাতে সাহায্য করে। DIY অর্গান অ্যাসেম্বলি
              সিস্টেমের মাধ্যমে বাচ্চারা নিজেরাই অঙ্গগুলো জোড়া লাগাতে পারে, ফলে
              শেখা হয় আরও বাস্তব ও ইন্টারঅ্যাকটিভ।
            </p>
            <p className='py-2 text-gray-600 font-mont text-sm sm:text-base font-semibold'>
              ✨ পণ্যের বিশেষ বৈশিষ্ট্য
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-700 font-mont text-sm sm:text-base pl-4'>
              <li>মানবদেহের বিভিন্ন অঙ্গপ্রত্যঙ্গের ডিটেইলড 3ডি ডিজাইন</li>
              <li>DIY অ্যাসেম্বলি সিস্টেম – হাতে-কলমে শেখার সুযোগ</li>
              <li>মজবুত ও টেকসই প্লাস্টিক ম্যাটেরিয়াল</li>
              <li>শিশুদের বুদ্ধি, কৌতূহল ও শেখার আগ্রহ বাড়াতে সহায়ক</li>
              <li>শেখার সাথে সাথে আনন্দ – পড়াশোনাকে করে তোলে মজাদার</li>
            </ul>
            <p className='py-3 text-gray-600 font-mont text-sm sm:text-base font-semibold'>
              📏 পণ্যের বিবরণ
            </p>
            <ul className='list-disc list-inside space-y-1 text-gray-700 font-mont text-sm sm:text-base pl-4'>
              <li>সাইজ: 28.5 × 10 সেমি</li>
              <li>উপাদান: উন্নতমানের টেকসই প্লাস্টিক</li>
              <li>ডিজাইন: হিউম্যান টর্সো ও অর্গান পার্টস</li>
              <li>ব্যবহার উপযোগী: শিশুদের জন্য</li>
            </ul>
            <p className='py-3 text-gray-600 font-mont text-sm sm:text-base font-semibold'>
              🎓 ব্যবহার ও উপযোগিতা
            </p>
            <ul className='list-disc list-inside space-y-1 text-gray-700 font-mont text-sm sm:text-base pl-4'>
              <li>স্কুল ও ক্লাসরুম টিচিং এইড হিসেবে</li>
              <li>ঘরে পারিবারিক শিক্ষার জন্য</li>
              <li>শেলফ বা স্টাডি টেবিল ডিসপ্লের জন্য</li>
              <li>শিশুদের জন্য শিক্ষামূলক উপহার হিসেবে আদর্শ</li>
              <li>আউটডোর ও গ্রুপ প্লেতেও ব্যবহারযোগ্য</li>
            </ul>
            <p className='py-3 text-gray-600 font-mont text-sm sm:text-base font-semibold'>
              💡 কেন এই প্রোডাক্টটি বেছে নেবেন?
            </p>
            <ul className='list-disc list-inside space-y-1 text-gray-700 font-mont text-sm sm:text-base pl-4'>
              <li>অ্যানাটমি শেখার সহজ ও কার্যকর উপায়</li>
              <li>শিশুদের হাতে-কলমে শেখার অভিজ্ঞতা দেয়</li>
              <li>পড়াশোনার পাশাপাশি সৃজনশীলতা ও লজিক ডেভেলপ করে</li>
              <li>আনন্দদায়ক ও অর্থবহ লার্নিং টয়</li>
            </ul>
            <p className='py-4 text-gray-700 font-mont text-sm sm:text-base italic'>
              শিশুর শেখাকে করুন আরও প্রাণবন্ত ও বাস্তব —
            </p>
          </div>

          {/* FAQ Section */}
          <div className='bg-white p-4 sm:p-5 rounded-lg mt-6'>
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
