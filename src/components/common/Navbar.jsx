import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useCartDialog } from '@/context/CartDialogContext';

function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const { openDialog } = useCartDialog();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLink = (href, label) => (
    <Link
      href={href}
      className={`transition-colors ${
        router.pathname === href
          ? 'text-primary font-semibold'
          : 'text-gray-300 hover:text-primary'
      }`}
    >
      {label}
    </Link>
  );

  const mobileNavLink = (href, label) => (
    <Link
      href={href}
      onClick={() => setIsMenuOpen(false)}
      className={`py-2 border-b border-gray-700 transition-colors ${
        router.pathname === href
          ? 'text-primary font-semibold'
          : 'text-gray-300 hover:text-primary'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className='hidden md:flex items-center bg-black shadow-lg px-8 py-3'>
        {/* Logo — left */}
        <Link href='/' className='flex-shrink-0'>
          <img
            src='/assets/logo.jpeg'
            alt='Kino Mart'
            className='h-12 w-auto object-contain'
          />
        </Link>

        {/* Nav links — center */}
        <div className='flex-1 flex justify-center gap-10 text-sm font-medium'>
          {navLink('/products', 'Products')}
          {navLink('/about-us', 'About Us')}
          {navLink('/contact-us', 'Contact Us')}
        </div>

        {/* Cart — right */}
        <button
          onClick={openDialog}
          className='relative flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:brightness-110 transition shadow flex-shrink-0'
          aria-label='Open cart'
        >
          <FiShoppingCart className='text-lg' />
          <span>Cart</span>
          {totalItems > 0 && (
            <span className='absolute -top-1.5 -right-1.5 bg-white text-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-primary'>
              {totalItems}
            </span>
          )}
        </button>
      </nav>

      {/* Mobile Navbar */}
      <nav className='block md:hidden bg-black shadow-lg'>
        <div className='px-4 py-3 flex items-center justify-between'>
          {/* Logo — left */}
          <Link href='/'>
            <img
              src='/assets/logo.jpeg'
              alt='Kino Mart'
              className='h-9 w-auto object-contain'
            />
          </Link>

          <div className='flex items-center gap-3'>
            {/* Cart icon */}
            <button
              onClick={openDialog}
              className='relative p-2 text-gray-300 hover:text-primary transition-colors'
              aria-label='Open cart'
            >
              <FiShoppingCart className='text-2xl' />
              {totalItems > 0 && (
                <span className='absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center'>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className='text-2xl text-gray-300 hover:text-primary transition-colors focus:outline-none'
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Collapsible menu */}
        <div
          className={`${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden transition-all duration-300 ease-in-out bg-gray-900`}
        >
          <div className='flex flex-col px-6 py-4 text-base font-medium'>
            {mobileNavLink('/products', 'Products')}
            {mobileNavLink('/about-us', 'About Us')}
            {mobileNavLink('/contact-us', 'Contact Us')}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
