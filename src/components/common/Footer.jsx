import Link from 'next/link';
import React from 'react';
import { BiPhone } from 'react-icons/bi';
import { CiLocationOn, CiMail } from 'react-icons/ci';

function Footer() {
  return (
    <footer className='bg-black text-white'>
      <div className='mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Brand Section */}
          <div className='space-y-6'>
            <div>
              <img
                src='/assets/logo.jpeg'
                alt='Kino Mart Logo'
                className='w-40 transition-transform duration-300 hover:scale-105'
              />
            </div>
            <p className='max-w-xs text-sm leading-relaxed opacity-80'>
              Kino Mart is Bangladesh&apos;s trusted destination for premium
              gadgets, tech accessories, smart devices, and imported branded
              products. We bring the world's best tech right to your doorstep.
            </p>
            <div className='flex gap-4'>
              <a
                href='https://www.facebook.com/share/1Czb9Sn3cV/'
                rel='noreferrer'
                target='_blank'
                className='group rounded-full p-2 transition-all duration-300 hover:bg-teal-500/20'
                aria-label='Facebook'
              >
                <img
                  src='https://www.svgrepo.com/show/452196/facebook-1.svg'
                  alt='Facebook'
                  className='w-10 transition-transform duration-300 group-hover:scale-110'
                />
              </a>
              <a
                href='https://www.instagram.com/kinomart_?igsh=MXdzNDIzdjQ2NTZ6cA=='
                rel='noreferrer'
                target='_blank'
                className='group rounded-full p-2 transition-all duration-300 hover:bg-teal-500/20'
                aria-label='Instagram'
              >
                <img
                  src='https://www.svgrepo.com/show/452229/instagram-1.svg'
                  alt='Instagram'
                  className='w-10 transition-transform duration-300 group-hover:scale-110'
                />
              </a>
              <a
                href='http://wa.me/+8801991007849'
                rel='noreferrer'
                target='_blank'
                className='group rounded-full p-2 transition-all duration-300 hover:bg-teal-500/20'
                aria-label='WhatsApp'
              >
                <img
                  src='https://www.svgrepo.com/show/452133/whatsapp.svg'
                  alt='WhatsApp'
                  className='w-10 transition-transform duration-300 group-hover:scale-110'
                />
              </a>
            </div>
          </div>

          {/* Store Information */}
          <div className='lg:col-span-1'>
            <h3 className='text-lg font-semibold text-primary mb-6'>
              Store Information
            </h3>
            <ul className='space-y-4 text-sm'>
              <li>
                <Link
                  href='#'
                  className='flex items-start gap-3 transition-all duration-300 hover:text-primary'
                >
                  <CiLocationOn className='text-2xl flex-shrink-0' />
                  <span>Uttara Sector 09, Road 09, House-12, Dhaka, Bangladesh</span>
                </Link>
              </li>
              <li>
                <a
                  href='tel:8801991007849'
                  className='flex items-center gap-3 transition-all duration-300 hover:text-primary'
                >
                  <BiPhone className='text-xl flex-shrink-0' />
                  <span>+8801991007849</span>
                </a>
              </li>
              {/* <li>
                <Link
                  href='mailto:megashop@mega.com'
                  className='flex items-center gap-3 transition-all duration-300 hover:text-primary'
                >
                  <CiMail className='text-xl flex-shrink-0' />
                  <span>helloseiishop@gmail.com</span>
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Quick Links */}
          <div className='lg:col-span-1'>
            <h3 className='text-lg font-semibold text-primary mb-6'>
              Quick Links
            </h3>
            <ul className='space-y-4 text-sm'>
              <li>
                <Link
                  href='/about-us'
                  className='transition-all duration-300 hover:text-primary'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/products'
                  className='transition-all duration-300 hover:text-primary'
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href='/contact-us'
                  className='transition-all duration-300 hover:text-primary'
                >
                  Contact
                </Link>
              </li>
              {/* <li>
                <Link
                  href='/faq'
                  className='transition-all duration-300 hover:text-primary'
                >
                  FAQ
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Divider and Copyright */}
        <hr className='my-8 border-gray-700' />
        <div className='flex flex-col items-center justify-center gap-4 text-sm sm:flex-row'>
          <p className='opacity-80'>
            &copy; {new Date().getFullYear()} Kino Mart. All Rights Reserved.
          </p>
          {/* <div className='flex gap-4'>
            <Link
              href='/privacy'
              className='transition-all duration-300 hover:text-primary'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='transition-all duration-300 hover:text-primary'
            >
              Terms of Service
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;