import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Head from 'next/head';
import React from 'react';

function about_us() {
  return (
    <div>
      <Head>
        <title>About Us | Kino Mart - Bangladesh's Tech & Gadgets Shop</title>
        <meta
          name='description'
          content="Learn about Kino Mart — Bangladesh's trusted online shop for premium gadgets, accessories, and imported branded products. Our mission, values, and story."
        />
        <meta
          name='keywords'
          content='about Kino Mart, gadgets Bangladesh, accessories shop, imported products Bangladesh, tech store Bangladesh'
        />
        <meta name='robots' content='index, follow' />
        <meta name='author' content='Kino Mart' />
        <link rel='canonical' href='https://www.kinomart.com/about-us' />
        <meta property='og:title' content='About Us | Kino Mart' />
        <meta
          property='og:description'
          content="Kino Mart is Bangladesh's go-to destination for premium gadgets, tech accessories, and imported branded products."
        />
        <meta property='og:url' content='https://www.kinomart.com/about-us' />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Kino Mart' />
      </Head>
      <Navbar />
      <div className='sm:flex items-center max-w-screen-xl mx-auto py-10'>
        <div className='sm:w-1/2 p-10'>
          <div className='image object-center text-center'>
            <img
              src='https://i.imgur.com/WbQnbas.png'
              alt='Kino Mart - Gadgets & Accessories'
            />
          </div>
        </div>
        <div className='sm:w-1/2 p-5'>
          <div className='text'>
            <span className='text-gray-500 border-b-2 border-primary uppercase'>
              About us
            </span>
            <h2 className='my-4 font-bold text-3xl sm:text-4xl'>
              About <span className='text-primary'>Kino Mart</span>
            </h2>
            <p className='text-gray-700'>
              Founded in Bangladesh, Kino Mart is your premier destination for
              cutting-edge gadgets, tech accessories, and imported branded
              products. We source top-quality smart devices, wearables, home
              tech, and lifestyle accessories from around the world—bringing
              global innovation directly to Bangladeshi consumers.
              <br />
              <br />
              Our mission is to make premium technology accessible and
              affordable for everyone in Bangladesh. At Kino Mart, we are
              committed to authentic products, transparent pricing, and a
              seamless shopping experience—from browsing to delivery at your
              doorstep.
              <br />
              <br />
              Whether you're looking for the latest smart watches, imported
              accessories, or unique branded gadgets, Kino Mart is your trusted
              one-stop tech shop in Bangladesh.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default about_us;
