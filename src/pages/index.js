import Head from 'next/head';

import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';

import Hero from '@/components/home/Hero';
import Offer from '@/components/home/Offer';
import Products from '@/components/home/Products';
import Promo from '@/components/home/Promo';
import Refer from '@/components/home/Refer';
import Trending from '@/components/home/Trending';

import React from 'react';

function index() {
  return (
    <>
      <Head>
        <title>
          Kino Mart | Gadgets, Accessories & Imported Branded Products in
          Bangladesh
        </title>
        <meta
          name='description'
          content='Kino Mart is Bangladeshi trusted online shop for premium gadgets, tech accessories, smart devices, and imported branded products. Fast delivery across Bangladesh.'
        />
        <meta
          name='keywords'
          content='Kino Mart, gadgets Bangladesh, accessories online, imported branded products, smart watches, tech shop Bangladesh, online electronics Bangladesh, buy gadgets online'
        />
        <meta name='author' content='Kino Mart' />
        <meta name='robots' content='index, follow' />

        {/* Open Graph Tags */}
        <meta
          property='og:title'
          content='Kino Mart | Premium Gadgets & Accessories in Bangladesh'
        />
        <meta
          property='og:description'
          content='Shop the latest gadgets, tech accessories, and imported branded products at Kino Mart. Best prices and fast delivery across Bangladesh.'
        />
        <meta
          property='og:image'
          content='https://www.kinomart.store/assets/footer-logo.jpeg'
        />
        <meta property='og:url' content='https://www.kinomart.store' />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Kino Mart' />

        {/* Optional: Twitter Cards */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='Kino Mart | Premium Gadgets & Accessories in Bangladesh'
        />
        <meta
          name='twitter:description'
          content='Discover gadgets, smart devices, and imported branded accessories at Kino Mart. Bangladesh’s go-to tech e-commerce shop.'
        />
        <meta
          name='twitter:image'
          content='https://www.kinomart.store/assets/footer-logo.jpeg'
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: 'https://www.kinomart.store/',
              name: 'Kino Mart',
              potentialAction: {
                '@type': 'SearchAction',
                target:
                  'https://www.kinomart.store/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </Head>

      <div>
        <Navbar />
        <Hero />
        {/* <Promo /> */}
        {/* <Offer /> */}
        {/* <Trending /> */}
        <Refer />
        <Products />
        <Footer />
      </div>
    </>
  );
}

export default index;
