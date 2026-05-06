import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';

const Hero = () => {
  return (
    <>
      {/* Desktop View */}
      <div className='container py-10 hidden md:block'>
        <div className='grid grid-cols-3 md:grid-cols-3 gap-4'>
          {/* Left Side - Image Slider */}
          <div className='relative col-span-2'>
            <Swiper
              modules={[Pagination, Autoplay]}
              // pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              speed={1000}
              className='h-[500px] w-full rounded-xl overflow-hidden'
            >
              <SwiperSlide>
                <img
                  src='/assets/banner/kino-banner1.png'
                  alt='Winter Collection'
                  className='h-full w-full object-fit rounded-xl'
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src='/assets/banner/kino-banner2.png'
                  alt='Winter Collection'
                  className='h-full w-full object-fit rounded-xl'
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src='/assets/banner/kino-banner3.png'
                  alt='Winter Collection Slide 2'
                  className='h-full w-full object-fit rounded-xl'
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src='/assets/banner/kino-banner4.png'
                  alt='Winter Collection Slide 3'
                  className='h-full w-full object-fit rounded-xl'
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src='/assets/banner/kino-banner5.png'
                  alt='Winter Collection Slide 3'
                  className='h-full w-full object-fit rounded-xl'
                />
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Right Side - Two Small Images */}
          <div className='flex flex-col gap-4'>
            {/* Top Right Image */}
            <div className='relative rounded-xl overflow-hidden'>
              <img
                src='/assets/banner/watch2.webp'
                alt='Online Shopping'
                className='h-[262px] w-full object-cover'
              />
              <div className='absolute bottom-0 p-4'>
                <Link
                  href={'/products'}
                  className='mt-2 bg-white text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-blue-100'
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Bottom Right Image */}
            <div className='relative rounded-xl overflow-hidden'>
              <img
                src='/assets/banner/ring.webp'
                alt='Trade-In Offer'
                className='h-[222px] w-full object-cover'
              />
              <div className='absolute bottom-0 p-4'>
                <Link
                  href={'/products'}
                  className='mt-2 bg-white text-orange-600 font-semibold py-2 px-4 rounded-md hover:bg-orange-100'
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Image Slider */}
      <div className='px-6 pt-6  md:hidden'>
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true, el: '.hero-pagination' }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={1000}
          className='h-[200px] w-full rounded-xl overflow-hidden'
        >
          <SwiperSlide>
            <img
              src='/assets/banner/kino-banner1.png'
              alt='Winter Collection'
              className='h-full w-full object-fit rounded-xl'
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src='/assets/banner/kino-banner2.png'
              alt='Winter Collection'
              className='h-full w-full object-fit rounded-xl'
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src='/assets/banner/kino-banner3.png'
              alt='Winter Collection Slide 2'
              className='h-full w-full object-fit rounded-xl'
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src='/assets/banner/kino-banner4.png'
              alt='Winter Collection Slide 3'
              className='h-full w-full object-fit rounded-xl'
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src='/assets/banner/kino-banner5.png'
              alt='Winter Collection Slide 3'
              className='h-full w-full object-fit rounded-xl'
            />
          </SwiperSlide>
          {/* <SwiperSlide>
            <img
              src='/assets/banner/fan-banner.png'
              alt='Winter Collection Slide 2'
              className='h-full w-full object-cover rounded-xl'
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src='/assets/banner/watch2.webp'
              alt='Winter Collection Slide 3'
              className='h-full w-full object-cover rounded-xl'
            />
          </SwiperSlide> */}
        </Swiper>

        {/* Custom Pagination */}
        <div className='hero-pagination flex items-center justify-center py-3 gap-[5px]'></div>
      </div>

      {/* Custom Pagination Styling (ONLY for this section) */}
      <style jsx>{`
        .hero-pagination :global(.swiper-pagination-bullet) {
          width: 10px;
          padding: 3px;
          height: 10px;
          background: #aaa;
          opacity: 1;
          border-radius: 50%;
          transition: all 0.3s ease-in-out;
        }

        .hero-pagination :global(.swiper-pagination-bullet-active) {
          width: 30px;
          height: 10px;
          border-radius: 5px;
          background: #a4dd00;
        }
      `}</style>
    </>
  );
};

export default Hero;
