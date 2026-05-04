import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Handle phone number input changes
  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value || '' });
    validateField('phone', value || '');
  };

  // Validate individual field
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'phone':
        if (!value) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+880\d{10}$/.test(value)) {
          newErrors.phone = 'Please enter a valid Bangladesh phone number';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Message is required';
        } else if (value.length < 10) {
          newErrors.message = 'Message must be at least 10 characters';
        } else {
          delete newErrors.message;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2)
      newErrors.name = 'Name must be at least 2 characters';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\+880\d{10}$/.test(formData.phone))
      newErrors.phone = 'Please enter a valid Bangladesh phone number';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10)
      newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmissionMessage(null);

    const sheetData = {
      name: formData.name,
      phone: formData.phone,
      message: formData.message,
      submissionTime: new Date().toISOString(),
    };

    console.log('Contact form data:', JSON.stringify(sheetData, null, 2));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error response:', errorData);
        setSubmissionMessage({
          type: 'error',
          text: errorData.message || 'Failed to submit your query',
        });
      } else {
        setSubmissionMessage({
          type: 'success',
          text: 'Your query has been submitted successfully!',
        });
        setFormData({ name: '', phone: '', message: '' });
        setErrors({});
      }
    } catch (error) {
      console.error('Fetch error:', error.name, error.message);
      setSubmissionMessage({
        type: 'error',
        text: 'Error submitting query. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className='text-gray-600 body-font relative'>
        <div className='container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap'>
          {/* Map Section */}
          <div className='lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative'>
            <iframe
              width='100%'
              height='100%'
              className='absolute inset-0'
              title='map'
              src='https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3648.0880396672933!2d90.38499306467548!3d23.8864966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2sbd!4v1753963064745!5m2!1sen!2sbd'
              style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.4)' }}
            ></iframe>
            <div className='bg-white relative flex flex-wrap py-6 rounded shadow-md'>
              <div className='lg:w-1/2 px-6'>
                <h2 className='title-font font-semibold text-gray-900 tracking-widest text-xs'>
                  ADDRESS
                </h2>
                <p className='mt-1'>
                  Uttara Sector 09, Road 09, House-12, Dhaka, Bangladesh
                </p>
              </div>
              <div className='lg:w-1/2 px-6 mt-4 lg:mt-0'>
                <h2 className='title-font font-semibold text-gray-900 tracking-widest text-xs'>
                  EMAIL
                </h2>
                <a
                  href='mailto:info@kinomart.com'
                  className='text-primary leading-relaxed'
                >
                  info@kinomart.com
                </a>
                <h2 className='title-font font-semibold text-gray-900 tracking-widest text-xs mt-4'>
                  PHONE
                </h2>
                <a
                  href='tel:+8801991007849'
                  className='text-primary leading-relaxed'
                >
                  {' '}
                  <p className='leading-relaxed'>+8801991007849</p>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='lg:w-1/3 md:w-1/2 p-5 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0'>
            <h2 className='text-gray-900 text-lg mb-1 font-medium title-font'>
              Get in Touch
            </h2>
            <p className='leading-relaxed mb-5 text-gray-600'>
              Have a question about a product or your order? Fill out the form
              below and our team will get back to you as soon as possible.
            </p>
            <form onSubmit={handleSubmit}>
              <div className='relative mb-4'>
                <label
                  htmlFor='name'
                  className='leading-7 text-sm text-gray-600'
                >
                  Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full bg-white rounded border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                />
                {errors.name && (
                  <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
                )}
              </div>
              <div className='relative mb-4'>
                <label
                  htmlFor='phone'
                  className='leading-7 text-sm text-gray-600'
                >
                  Phone Number
                </label>
                <PhoneInput
                  id='phone'
                  defaultCountry='BD'
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder='Enter Phone Number'
                  className='w-full bg-white rounded border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                />
                {errors.phone && (
                  <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>
                )}
              </div>
              <div className='relative mb-4'>
                <label
                  htmlFor='message'
                  className='leading-7 text-sm text-gray-600'
                >
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  className='w-full bg-white rounded border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out'
                ></textarea>
                {errors.message && (
                  <p className='text-red-500 text-xs mt-1'>{errors.message}</p>
                )}
              </div>
              {submissionMessage && (
                <p
                  className={`text-sm mb-4 ${
                    submissionMessage.type === 'success'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {submissionMessage.text}
                </p>
              )}
              <button
                type='submit'
                disabled={isLoading || Object.keys(errors).length > 0}
                className='text-white bg-primary border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded text-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
            <p className='text-xs text-gray-500 mt-3'>
              We usually respond within 24 hours on business days. For urgent
              inquiries, contact us directly via WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactUs;
