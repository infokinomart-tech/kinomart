import React, { useRef, useEffect, useState } from 'react';
import CustomSection from '../layout/CustomSection';
import ProductCard from '../product/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa6';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';

function Trending() {
  const swiperRef = useRef(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/public/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.params) {
      swiperRef.current.params.navigation.prevEl = prevButtonRef.current;
      swiperRef.current.params.navigation.nextEl = nextButtonRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  // Filter products with sectionType: "hot"
  const hotProducts = products.filter(
    (product) => product.sectionType === 'hot'
  );

  return (
    <CustomSection>
      <div className='md:bg-[#FFEBE2] px-6 md:px-10 md:py-6 rounded-2xl'>
        <div className='flex items-center justify-between py-3 md:py-8'>
          <div className='flex items-center justify-start gap-4'>
            <h2 className='text-md md:text-2xl font-semibold text-[#212B36]'>
              New Arrivals
            </h2>
          </div>
          <Link
            href={'/products'}
            className='flex items-center justify-center gap-3 text-xs font-semibold'
          >
            <span>More</span>
            <span>
              <FaArrowRight />
            </span>
          </Link>
        </div>

        <div className='relative'>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            loop={hotProducts.length >= 5} // Enable loop only if enough products
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            grabCursor={true}
            className='w-full'
            breakpoints={{
              320: { slidesPerView: 2 }, // Mobile
              480: { slidesPerView: 2 }, // Small devices
              768: { slidesPerView: 3 }, // Tablets
              1024: { slidesPerView: 4 }, // Small desktops
              1280: { slidesPerView: 5 }, // Large screens
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {hotProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </CustomSection>
  );
}

export default Trending;
