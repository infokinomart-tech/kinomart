import React from 'react';
import { FaTruck, FaUndoAlt } from 'react-icons/fa';

function DeliveryAndReturnPolicy() {
  return (
    <div className='py-8 md:mt-20 container rounded-lg mx-auto bg-slate-50 '>
      <div className='  '>
        <h2 className='text-sm md:text-md font-semibold font-mont text-gray-800 mb-6 text-start'>
          Delivery & Return Policy
        </h2>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Delivery Information */}
          <div className=''>
            <div className='flex items-center gap-3 mb-4'>
              <FaTruck className='text-blue-600 text-sm' />
              <h3 className='text-sm md:text-md font-semibold text-gray-700'>
                Delivery Information
              </h3>
            </div>
            <div className='space-y-4 text-gray-600 text-sm md:text-base'>
              <div>
                <h4 className='font-medium text-gray-600 text-sm'>
                  Shipping Times
                </h4>
                <p className='text-xs py-1'>
                  We strive to deliver your order as quickly as possible. Orders
                  within Dhaka are delivered within 1-2 business days. For areas
                  outside Dhaka, delivery takes 2-3 business days.
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-600 text-sm'>
                  Shipping Charges
                </h4>
                <p className='text-xs py-1'>
                  A flat shipping fee of ৳60 applies for deliveries within
                  Dhaka. For all other districts, the shipping fee is ৳120. Free
                  shipping may be available on select promotions.
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-600 text-sm'>
                  Delivery Methods
                </h4>
                <p className='text-xs py-1'>
                  We partner with reliable courier services to ensure safe and
                  timely delivery. You will receive a tracking number once your
                  order is shipped.
                </p>
              </div>
            </div>
          </div>
          {/* Return Policy */}
          <div className=''>
            <div className='flex items-center gap-3 mb-4'>
              <FaUndoAlt className='text-blue-600 text-sm' />
              <h3 className='text-sm md:text-sm font-semibold text-gray-700'>
                Return Policy
              </h3>
            </div>
            <div className='space-y-4 text-gray-600 text-sm md:text-base'>
              <div>
                <h4 className='font-medium text-gray-600 text-sm'>
                  Return Conditions
                </h4>
                <p className='text-xs py-1'>
                  We accept returns for unused and undamaged products in their
                  original packaging. Items must be returned within 7 days of
                  delivery.
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-600 text-sm'>
                  Return Process
                </h4>
                <p className='text-xs py-1'>
                  To initiate a return, contact our support team via email or
                  phone. Include your order number and reason for return. We
                  will provide instructions for returning the item.
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-600 text-sm'>Refunds</h4>
                <p className='text-xs py-1'>
                  Once the returned item is received and inspected, we will
                  issue a refund to your original payment method within 5-7
                  business days. Shipping charges are non-refundable.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Contact Information */}
        <div className='mt-8 text-left'>
          <p className='text-gray-600 text-sm md:text-base'>
            Have questions? Reach out to us at{' '}
            <a
              href='mailto:info@kinomart.store'
              className='text-blue-600 hover:underline'
            >
              info@kinomart.store
            </a>{' '}
            or call{' '}
            <a
              href='tel:+8801234567890'
              className='text-blue-600 hover:underline'
            >
              +880 1814575428
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default DeliveryAndReturnPolicy;
