import React, { useState } from 'react';
import { TbShoppingCartPlus } from 'react-icons/tb';
import { RiPokerHeartsLine } from 'react-icons/ri';
import { GoShareAndroid } from 'react-icons/go';

// Array of image paths for the product
const productImages = [
  '/assets/product/product1.png',
  '/assets/product/product2.png',
  '/assets/product/product1.png',
  // '/assets/product/product2.png',
];

function ProductDetailsCard() {
  // State to track the active image
  const [activeImage, setActiveImage] = useState(productImages[0]);

  // Handle image click to update the active image
  const handleImageClick = (image) => {
    setActiveImage(image);
  };

  return (
    <div>
      <style>
        {`
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
            border-color: #3b82f6; /* Blue border for active image */
            opacity: 1;
          }
          .small-image-inactive {
            opacity: 0.7;
            border-color: transparent;
          }
          .price-gradient {
            background: linear-gradient(to right, #ef4444, #9f1239);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>
      <div className='py-8 container mx-auto px-4 lg:px-8'>
        <div className='bg-white md:py-6 rounded-2xl md:rounded-xl shadow-lg'>
          <div className='flex flex-col md:flex-row gap-4 md:gap-6 -mx-4'>
            {/* Image Section */}
            <div className='w-full md:w-3/4 px-4'>
              <div className='p-2 md:p-0 md:grid md:grid-cols-4 gap-4'>
                {/* Main Image */}
                <div className='col-span-3 md:pl-6'>
                  <img
                    className='w-full h-[267px] md:h-[533px] object-cover rounded-lg image-transition'
                    src={activeImage}
                    alt='Active Product'
                  />
                  {/* Small Images for Mobile */}
                  <div className='flex justify-center gap-2 mt-4 md:hidden'>
                    {productImages.map((image, index) => (
                      <img
                        key={index}
                        className={`w-[80px] h-[80px] object-cover rounded-lg cursor-pointer small-image ${
                          activeImage === image
                            ? 'small-image-active'
                            : 'small-image-inactive'
                        }`}
                        src={image}
                        alt={`Product Thumbnail ${index + 1}`}
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
                  </div>
                </div>
                {/* Small Images for Desktop */}
                <div className='col-span-1 hidden md:flex flex-col items-center gap-4'>
                  {productImages.map((image, index) => (
                    <img
                      key={index}
                      className={`w-full h-[167px] object-cover rounded-lg cursor-pointer small-image ${
                        activeImage === image
                          ? 'small-image-active'
                          : 'small-image-inactive'
                      }`}
                      src={image}
                      alt={`Product Thumbnail ${index + 1}`}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Product Details */}
            <div className='md:w-1/2 px-7 md:px-0 py-4'>
              <h2 className='text-lg md:text-2xl font-semibold font-mont text-gray-800 md:mb-4'>
                Men’s Artificial Leather Jacket
              </h2>
              <p className='text-gray-600 text-sm mb-4 font-mont'>
                Feel every moment of your workflow with precision,
                visualization, and performance
              </p>

              {/* <div className='mb-6'>
                <span className='font-semibold text-gray-700'>Size</span>
                <div className='flex items-center mt-4'>
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      className='text-gray-400 text-sm border-2 py-2 px-5 rounded-full mr-2 hover:bg-gray-100'
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div> */}

              <div className='mb-6'>
                <span className='font-semibold text-gray-700'>Color</span>
                <div className='flex items-center gap-3 mt-4'>
                  <div className='border-2 flex items-center justify-center rounded-full p-1'>
                    <button className='w-[30px] h-[30px] rounded-full bg-gray-800'></button>
                  </div>
                  <div className='border-2 flex items-center justify-center rounded-full p-1'>
                    <button className='w-[30px] h-[30px] rounded-full bg-orange-500'></button>
                  </div>
                  <div className='border-2 flex items-center justify-center rounded-full p-1'>
                    <button className='w-[30px] h-[30px] rounded-full bg-gray-300'></button>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className='flex items-center justify-start gap-2 text-md mb-6'>
                <span className='price-gradient font-bold text-xl'>$385.00</span>
                <span className='text-gray-500 font-normal text-lg line-through'>
                  $485.00
                </span>
              </div>

              {/* Quantity */}
              <div className='flex items-center justify-start gap-4 mb-6'>
                <form>
                  <div className='relative flex items-center max-w-[8rem] border border-gray-400 rounded-lg bg-white'>
                    <button
                      type='button'
                      id='decrement-button'
                      data-input-counter-decrement='quantity-input'
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
                      id='quantity-input'
                      data-input-counter
                      aria-describedby='helper-text-explanation'
                      className='h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5'
                      placeholder='999'
                      required
                      value={1}
                    />
                    <button
                      type='button'
                      id='increment-button'
                      data-input-counter-increment='quantity-input'
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
                </form>
                {/* <div className='flex items-center justify-center gap-2 border border-gray-600 px-6 py-[12px] rounded-md font-mont font-semibold text-sm'>
                  <span>
                    <TbShoppingCartPlus />
                  </span>
                  <span>Add to Cart</span>
                </div> */}
                <div className='flex items-center bg-blue-600 text-white justify-center gap-2 border border-blue-600 px-6 py-[12px] rounded-md font-mont font-semibold text-sm'>
                  <span>Buy Now</span>
                </div>
              </div>

              {/* Share */}
              <div className='flex items-center justify-start gap-4'>
                <div className='border border-gray-300 p-1 rounded-lg'>
                  <GoShareAndroid className='text-2xl' />
                </div>
                <span className='font-mont text-xs font-medium '>
                  (There are 24 products left)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsCard;
