import Footer from '@/components/common/Footer';
import HeaderSm from '@/components/common/HeaderSm';
import Navbar from '@/components/common/Navbar';
import Link from 'next/link';
import React from 'react';
import { CiUser } from 'react-icons/ci';
import { FiSmartphone } from 'react-icons/fi';
import { IoMdArrowBack } from 'react-icons/io';
import { IoMailOutline } from 'react-icons/io5';
import { SlLock } from 'react-icons/sl';
function sign_up() {
  return (
    <>
      <HeaderSm>
        <Link href={'/'}>
          <IoMdArrowBack className='text-2xl' />
        </Link>
        <span className='text-xl font-semibold'>Sign Up</span>
        <span></span>
      </HeaderSm>
      <div className='hidden md:block'>
        <Navbar />
      </div>
      <div class=' bg-white pt-20 md:pt-0 px-6 md:bg-gray-100 flex flex-col justify-center py-2 md:pb-20 md:px-6 lg:px-8'>
        <div class='mt-8 sm:mx-auto sm:w-full sm:max-w-lg'>
          <div class='bg-white md:py-8  md:shadow md:rounded-lg md:px-10'>
            <div class='hidden md:block mb-4 text-left'>
              <img src='/assets/logo.jpeg' />
              <h2 class='mt-6 text-left text-2xl font-bold text-gray-900'>
                Create your account{' '}
              </h2>
            </div>
            <form class='space-y-6' action='#' method='POST'>
              <div className='relative'>
                <div className='absolute z-20 top-9 left-0 pl-3 flex items-center gap-2 pointer-events-none'>
                  <CiUser className='text-xl text-gray-500' />
                </div>
                <label
                  for='name'
                  class='block text-sm font-medium text-gray-700'
                >
                  Your name
                </label>
                <div class='mt-1'>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    required
                    class='appearance-none rounded-md relative block w-full pl-10 px-3 py-3 md:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                    placeholder='Enter your name'
                  />
                </div>
              </div>
              <div className='relative'>
                <div className='absolute z-20 top-9 left-0 pl-3 flex items-center gap-2 pointer-events-none'>
                  <IoMailOutline className='text-xl text-gray-500' />
                </div>
                <label
                  for='email'
                  class='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <div class='mt-1'>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    required
                    class='appearance-none rounded-md relative block w-full pl-10 px-3 py-3 md:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                    placeholder='Enter your email'
                  />
                </div>
              </div>
              <div className='relative'>
                <div className='absolute z-20 top-10 left-0 pl-3 flex items-center gap-2 pointer-events-none'>
                  <FiSmartphone className='text-xl text-gray-400' />
                  <span className='text-gray-400 text-sm'>+88 |</span>
                </div>
                <label
                  for='email'
                  class='block text-sm font-medium text-gray-700'
                >
                  Mobile no
                </label>
                <div class='mt-1'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autocomplete='email'
                    required
                    class='appearance-none placeholder:text-gray-400 rounded-md relative block w-full pl-20 px-3 py-3 md:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                    placeholder='0123456789'
                  />
                </div>
              </div>

              <div className='relative'>
                <div className='absolute z-20 top-9 left-0 pl-3 flex items-center gap-2 pointer-events-none'>
                  <SlLock className='text-xl text-gray-400' />
                </div>
                <label
                  for='password'
                  class='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div class='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autocomplete='current-password'
                    required
                    class='appearance-none rounded-md relative block w-full pl-10 px-3 py-3 md:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                    placeholder='Password'
                  />
                </div>
              </div>
              <div className='relative'>
                <div className='absolute z-20 top-9 left-0 pl-3 flex items-center gap-2 pointer-events-none'>
                  <SlLock className='text-xl text-gray-400' />
                </div>
                <label
                  for='password'
                  class='block text-sm font-medium text-gray-700'
                >
                  Confirm Password
                </label>
                <div class='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autocomplete='current-password'
                    required
                    class='appearance-none rounded-md relative block w-full pl-10 px-3 py-3 md:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                    placeholder='Password'
                  />
                </div>
              </div>

              <div class='flex items-center justify-start'>
                <div class='flex items-center'>
                  <input
                    id='remember_me'
                    name='remember_me'
                    type='checkbox'
                    class='h-4 w-4 text-primary  border-gray-300 rounded'
                  />
                  <label
                    for='remember_me'
                    class='ml-2 flex items-center gap-2 text-xs text-gray-900'
                  >
                    I agree to the{' '}
                    <span class='text-primary font-semibold'>
                      {' '}
                      Terms of Service
                    </span>
                    and{' '}
                    <span class='text-primary font-semibold'>
                      {' '}
                      Privacy Policy
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  class='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#3454B4] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Login
                </button>
              </div>
            </form>
            <div class='mt-6'>
              <div class='relative flex justify-center items-center gap-1 py-3 text-sm'>
                <span class='text-gray-500'>Already have an account?</span>
                <Link href='/sign-in' class='text-[#3454B4] font-semibold'>
                  Log in
                </Link>
              </div>
              <div class='relative flex justify-center items-center gap-2'>
                <div class='w-20 h-[1px] bg-slate-200'></div>
                <div class='relative flex justify-center text-sm'>
                  <span class='px-2  text-gray-500'>Or continue with</span>
                </div>
                <div class='w-20 h-[1px] bg-slate-200'></div>
              </div>

              <div class='mt-6 flex gap-14 items-center justify-center'>
                <div>
                  <a
                    href='#'
                    class=' flex items-center justify-center  w-20 h-14 border md:border-gray-300 rounded-xl md:rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
                  >
                    <img
                      class='h-7 w-7'
                      src='https://www.svgrepo.com/show/452196/facebook-1.svg'
                      alt=''
                    />
                  </a>
                </div>
                <div>
                  <a
                    href='#'
                    class=' flex items-center justify-center  w-20 h-14 border md:border-gray-300 rounded-xl md:rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
                  >
                    <img
                      class='h-7 w-7'
                      src='https://www.svgrepo.com/show/475656/google-color.svg'
                      alt=''
                    />
                  </a>
                </div>
                <div>
                  <a
                    href='#'
                    class=' flex items-center justify-center  w-20 h-14 border md:border-gray-300 rounded-xl md:rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
                  >
                    <img
                      class='h-7 w-7'
                      src='https://www.svgrepo.com/show/494336/apple.svg'
                      alt=''
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default sign_up;
