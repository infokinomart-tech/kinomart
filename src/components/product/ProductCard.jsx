import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { addToCart } from '@/store/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleBuyNow = () => {
    if (product && product.inStock) {
      // Use the first variant's color and image as defaults
      // const defaultVariant = product.images[0];
      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          selectedColor: product.variants[0].color,
          quantity: 1, // Default quantity
          image: product?.thumbnail, // Use the first image
        })
      );
      router.push('/order');
    }
  };

  return (
    <div className='bg-white border border-primary  p-2 md:p-3   flex flex-col h-[300px] md:h-[360px]'>
      {/* Product Image Section */}
      {product.inStock ? (
        <div className='relative flex-shrink-0'>
          <Link href={`/product/${product?.slug}`}>
            <img
              src={product?.thumbnail}
              alt={product?.title}
              className='w-full h-36 md:h-44 object-cover md:mt-4'
            />
          </Link>
          {/* {product?.sectionType === 'hot' && (
            <span className='absolute top-2 left-2 bg-accent text-white text-xs font-semibold px-2 py-1 rounded'>
              New
            </span>
          )} */}
        </div>
      ) : (
        <div className='relative flex-shrink-0'>
          <img
            src={product?.thumbnail}
            alt={product?.title}
            className='w-full h-36 md:h-44 object-cover '
          />
          {product?.sectionType === 'hot' && (
            <span className='absolute top-2 left-2 bg-accent text-white text-xs font-semibold px-2 py-1 rounded'>
              New
            </span>
          )}
        </div>
      )}

      {/* Product Details */}
      {product?.inStock ? (
        <Link
          href={`/product/${product?.slug}`}
          className='text-gray-900 font-normal px-2 text-xs md:text-sm mt-5 block line-clamp-2 h-[40px] md:h-[48px] overflow-hidden'
        >
          {product?.title}
        </Link>
      ) : (
        <span className='text-gray-900 px-2 font-normal text-xs md:text-sm mt-5 block line-clamp-2 h-[40px] md:h-[48px] overflow-hidden'>
          {product?.title}
        </span>
      )}

      {/* Pricing */}
      <div className='mt-2 px-2 flex items-center space-x-2'>
        <span className='text-black text-md font-bold'>
          ৳{product?.price?.toFixed(2)}
        </span>
        <span className='text-gray-500 line-through text-xs'>
          ৳{product?.originalPrice?.toFixed(2)}
        </span>
      </div>

      {/* Buy Now Button */}
      {product?.inStock ? (
        <div className='mt-auto flex items-center justify-center p-2'>
          <Link
            href={`/product/${product?.slug}`}
            // onClick={handleBuyNow}
            className='text-xs bg-primary text-center w-full py-2  font-semibold text-black hover:bg-secondary hover:text-black transition duration-300'
          >
            Order Now
          </Link>
        </div>
      ) : (
        <div className='mt-auto flex items-center justify-center p-2'>
          <button
            className='text-xs bg-gray-100 w-full py-2  font-semibold text-blue-700 hover:bg-blue-800 hover:text-white transition duration-300 cursor-not-allowed'
            disabled
          >
            Out of Stock
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
