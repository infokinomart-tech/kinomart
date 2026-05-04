import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { GoShareAndroid } from 'react-icons/go';
import Navbar from '@/components/common/Navbar';
import Related from '@/components/checkout/Related';
import CustomSection from '@/components/layout/CustomSection';
import { products } from '@/utils/products';
import { addToCart } from '@/store/cartSlice';
import { useCartDialog } from '@/context/CartDialogContext';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Find the specific product for this page
const productData = products.find((p) => p.slug === 'gt4-pro-smart-watch');

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

      // Push product view event to data layer
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
              item_category: 'Wearables',
              item_variant: initialProduct.variants?.[0]?.color || 'unknown',
            },
          ],
        },
      });
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
    return <div>Product not found</div>;
  }

  // Rest of the JSX remains unchanged
  return (
    <>
      <Head>
        <title>{product.title} | Buy Online in Bangladesh | Kino Mart</title>
        <meta
          name='description'
          content={`Buy ${
            product.title
          } at the best price in Bangladesh. Features include ${product.variants
            .map((v) => v.color)
            .join(', ')}, Bluetooth calling, heart rate monitoring, and more.`}
        />
        <meta
          name='keywords'
          content={`GT4 PRO Smart Watch, smart watch Bangladesh, smartwatch price BD, Bluetooth calling watch, fitness tracker, men's smartwatch`}
        />
        <meta name='robots' content='index, follow' />
        <meta name='author' content='Kino Mart' />
        <link
          rel='canonical'
          href={`https://www.kinomart.store/product/${product.slug}`}
        />
        <meta property='og:type' content='product' />
        <meta property='og:title' content={`${product.title} | Kino Mart`} />
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
        <meta property='og:site_name' content='Kino Mart' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={`${product.title} | Kino Mart`} />
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
              brand: {
                '@type': 'Brand',
                name: 'Kino Mart',
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
      <div>
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
        <div className='py-8 container mx-auto px-4 lg:px-8'>
          <div className='bg-white md:py-6 rounded-2xl md:rounded-xl shadow-lg'>
            <div className='flex flex-col md:flex-row gap-4 md:gap-6 -mx-4'>
              <div className='w-full md:w-3/4 px-4'>
                <div className='p-2 md:p-0 md:grid md:grid-cols-4 gap-4'>
                  <div className='col-span-3 md:pl-6'>
                    <img
                      className='w-full h-[267px] md:h-[533px] object-cover rounded-lg image-transition'
                      src={activeImage}
                      alt={product.title}
                    />
                    <div className='flex justify-center gap-2 mt-4 md:hidden'>
                      {product.images.slice(1).map((image, index) => (
                        <img
                          key={index}
                          className={`w-[80px] h-[80px] object-cover rounded-lg cursor-pointer small-image ${
                            activeImage === image
                              ? 'small-image-active'
                              : 'small-image-inactive'
                          }`}
                          src={image}
                          alt={`${product.title} Thumbnail ${index + 1}`}
                          onClick={() => handleImageClick(image)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className='col-span-1 hidden md:flex flex-col items-center gap-4'>
                    {product.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        className={`w-full h-[167px] object-cover rounded-lg cursor-pointer small-image ${
                          activeImage === image
                            ? 'small-image-active'
                            : 'small-image-inactive'
                        }`}
                        src={image}
                        alt={`${product.title} Thumbnail ${index + 1}`}
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className='md:w-1/2 px-7 md:px-0 py-4'>
                <h2 className='text-lg md:text-2xl font-semibold font-mont text-gray-800 md:mb-4'>
                  {product.title}
                </h2>
                <p className='text-gray-600 text-sm mb-4 font-mont'>
                  {product.description}
                </p>
                <div className='mb-6'>
                  <span className='font-semibold text-gray-700'>
                    Choose a Color
                  </span>
                  <div className='flex items-center gap-3 mt-4'>
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
                            backgroundColor: variant.color.toLowerCase(),
                          }}
                        ></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='flex items-center justify-start gap-2 text-md mb-6'>
                  <span className='text-blue-600 font-bold text-xl'>
                    ৳ {product.price.toFixed(2)}
                  </span>
                  <span className='text-gray-500 font-normal text-lg line-through'>
                    ৳ {product.originalPrice.toFixed(2)}
                  </span>
                </div>
                <div className='flex items-center justify-start gap-4 mb-6'>
                  <div className='relative flex items-center max-w-[8rem] border border-gray-400 rounded-lg bg-white'>
                    <button
                      type='button'
                      onClick={() => handleQuantityChange('decrement')}
                      className='hover:bg-gray-200 rounded-s-lg py-3 px-4 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none'
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
                      className='h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5'
                    />
                    <button
                      type='button'
                      onClick={() => handleQuantityChange('increment')}
                      className='hover:bg-gray-200 rounded-e-lg py-3 px-4 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none'
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
                    className='flex items-center bg-blue-600 text-white justify-center gap-2 border border-blue-600 px-6 py-[12px] rounded-md font-mont font-semibold text-sm'
                    disabled={!product.inStock}
                  >
                    <span>{product.inStock ? 'Buy Now' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomSection>
        <div className='px-3'>
          <div className='bg-white p-5 rounded-lg'>
            <div className='flex justify-between items-center mb-3'>
              <h2 className='text-lg font-semibold'>Description</h2>
            </div>
            <div className='mt-10'>
              <p className='text-gray-600 font-mont text-sm'>
                Elevate your fitness and connectivity with the GT4 PRO Smart
                Watch, a premium men's smartwatch designed for an active
                lifestyle. Featuring a vibrant 1.6-inch HD screen with a 360x360
                resolution, this smartwatch delivers clear visuals and a smooth
                touch experience. Its IP68 waterproof rating ensures durability
                during intense workouts, outdoor adventures, or even swimming.
              </p>
              <p className='text-gray-600 font-mont text-sm mt-4'>
                Stay connected with Bluetooth calling and music control,
                allowing you to make and receive calls or manage your playlist
                directly from your wrist. The GT4 PRO is packed with advanced
                health monitoring features, including heart rate tracking, blood
                oxygen monitoring, blood pressure, sleep tracking, and stress
                monitoring, keeping you informed about your well-being in
                real-time. With 156 sports modes and a precise GPS tracker, it
                accurately records steps, distance, calories, and motion tracks
                for activities like running, cycling, and more. Additional
                features include NFC for contactless payments, a compass for
                navigation, and an AI voice assistant for hands-free control.
                Customize your experience with downloadable watch faces, a QR
                code for app connectivity, and smart features like message
                notifications, remote camera control, and weather updates. The
                360mAh battery offers up to 30 days of standby time or 3-5 days
                of active use, ensuring long-lasting performance.
              </p>
              <p className='text-gray-600 font-mont text-sm mt-4'>
                {' '}
                Compatible with Android 5.0+ and iOS 9.0+, the GT4 PRO supports
                multiple languages, including English, Spanish, German, and
                more. The durable zinc alloy case and silicone strap provide
                comfort and style, making it the perfect companion for fitness
                enthusiasts and tech-savvy individuals alike.
              </p>
              <p className='py-5 text-gray-600 font-mont text-sm mt-4'>
                Key Features:
              </p>
              <ul className='list-disc list-inside text-gray-600 font-mont text-sm'>
                <li>🏃 Pedometer/Distance/Calorie Burn Tracking</li>
                <li>🎥 Video Remote Control</li>
                <li>💓 Heart Rate Measurement</li>
                <li>🩺 Blood Pressure, Blood Sugar Measurement</li>
                <li>🧘 Breathing Exercise Trainer</li>
                <li>🩸 Blood Oxygenation</li>
                <li>😴 Sleep Monitoring</li>
                <li>🌤 Weather Update</li>
                <li>⚽ Sports</li>
                <li>🧮 Calculator</li>
                <li>📞 Bluetooth Calling</li>
                <li>🎶 Bluetooth Music</li>
                <li>🗣 Voice Assistant</li>
                <li>⏱ Stopwatch</li>
                <li>🧭 Compass</li>
                <li>📩 Real-time Message Alert</li>
              </ul>
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
