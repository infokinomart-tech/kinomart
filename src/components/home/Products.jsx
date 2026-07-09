import React, { useEffect, useState } from 'react';
import CustomSection from '../layout/CustomSection';
import { FaArrowRight } from 'react-icons/fa6';
import ProductCard from '../product/ProductCard';
import Link from 'next/link';

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/public/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  return (
    <CustomSection>
      <div className='md:bg-[#e2f9cf] px-6 md:px-10 md:py-6 rounded-2xl pb-32 md:pb-0'>
        <div className='flex items-center justify-between py-3 md:py-8'>
          <div className='flex items-center justify-start gap-4'>
            <h2 className='text-md md:text-2xl font-semibold md:text-[#637381]'>
              Products
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

        <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </CustomSection>
  );
}

export default Products;
