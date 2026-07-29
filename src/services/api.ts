import { Product, Category, Order, SiteSettings, ContactMessage, ProductReview, Coupon } from '../types';

const productsCacheMap = new Map<string, Product>();
let allProductsCache: Product[] | null = null;
let allProductsCacheTime = 0;

export const api = {
  getCachedProduct(identifier: string): Product | undefined {
    return productsCacheMap.get(identifier);
  },

  setProductCache(products: Product[]) {
    allProductsCache = products;
    allProductsCacheTime = Date.now();
    products.forEach(p => {
      if (p.id) productsCacheMap.set(p.id, p);
      if (p.slug) productsCacheMap.set(p.slug, p);
    });
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    const res = await fetch('/api/coupons');
    if (!res.ok) throw new Error('Failed to fetch coupons');
    return res.json();
  },

  async createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'কুপন তৈরি করতে ব্যর্থ হয়েছে');
    return data.coupon;
  },

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    const res = await fetch(`/api/coupons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'কুপন আপডেট করতে ব্যর্থ হয়েছে');
    return data.coupon;
  },

  async deleteCoupon(id: string): Promise<void> {
    await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
  },

  async validateCoupon(code: string, cart_total: number): Promise<{
    valid: boolean;
    coupon_code?: string;
    discount_type?: 'fixed' | 'percentage';
    discount_value?: number;
    discount_amount?: number;
    message: string;
  }> {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cart_total })
    });
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<void> {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
  },

  // Admin Auth
  async adminLogin(admin_id: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_id, password })
    });
    return res.json();
  },

  async adminChangePassword(old_password: string, new_password: string, new_admin_id?: string): Promise<{ success: boolean; admin_id?: string; error?: string }> {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_password, new_password, new_admin_id })
    });
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    const data = await res.json();
    return data.category;
  },

  async updateCategory(id: string, cat: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    const data = await res.json();
    return data.category;
  },

  async deleteCategory(id: string): Promise<void> {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; sort?: string; status?: string }): Promise<Product[]> {
    const hasParams = params && Object.keys(params).some(k => Boolean((params as any)[k]));
    if (!hasParams && allProductsCache && (Date.now() - allProductsCacheTime < 60000)) {
      return allProductsCache;
    }

    const url = new URL('/api/products', window.location.origin);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.sort) url.searchParams.set('sort', params.sort);
    if (params?.status) url.searchParams.set('status', params.status);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch products');
    const products: Product[] = await res.json();
    if (!hasParams) {
      this.setProductCache(products);
    } else {
      products.forEach(p => {
        if (p.id) productsCacheMap.set(p.id, p);
        if (p.slug) productsCacheMap.set(p.slug, p);
      });
    }
    return products;
  },

  async getProduct(identifier: string): Promise<Product> {
    const cached = productsCacheMap.get(identifier);
    if (cached) {
      // Revalidate in background without blocking caller
      fetch(`/api/products/${identifier}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            productsCacheMap.set(data.id, data);
            if (data.slug) productsCacheMap.set(data.slug, data);
          }
        })
        .catch(() => {});
      return cached;
    }

    const res = await fetch(`/api/products/${identifier}`);
    if (!res.ok) throw new Error('Product not found');
    const data: Product = await res.json();
    productsCacheMap.set(data.id, data);
    if (data.slug) productsCacheMap.set(data.slug, data);
    return data;
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    return data.product;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    return data.product;
  },

  async deleteProduct(id: string): Promise<void> {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
  },

  // Reviews
  async getProductReviews(identifier: string): Promise<ProductReview[]> {
    const res = await fetch(`/api/products/${identifier}/reviews`);
    if (!res.ok) return [];
    return res.json();
  },

  async addProductReview(identifier: string, review: { customer_name: string; rating: number; comment: string; phone?: string }): Promise<{ success: boolean; review: ProductReview; new_rating: number; reviews_count: number }> {
    const res = await fetch(`/api/products/${identifier}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'রিভিউ জমা দেওয়া সম্ভব হয়নি');
    return data;
  },

  // Orders
  async getOrders(params?: { status?: string; call_status?: string; search?: string; from?: string; to?: string }): Promise<Order[]> {
    const url = new URL('/api/orders', window.location.origin);
    if (params?.status) url.searchParams.set('status', params.status);
    if (params?.call_status) url.searchParams.set('call_status', params.call_status);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.from) url.searchParams.set('from', params.from);
    if (params?.to) url.searchParams.set('to', params.to);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async createOrder(orderData: any): Promise<{ success: boolean; order: Order; customer: any; token: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'অর্ডার করতে সমস্যা হয়েছে');
    }
    return res.json();
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data.order;
  },

  async deleteOrder(id: string): Promise<void> {
    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
  },

  async getCustomerOrders(phone: string): Promise<Order[]> {
    const res = await fetch(`/api/customer/orders?phone=${encodeURIComponent(phone)}`);
    if (!res.ok) return [];
    return res.json();
  },

  // Contact
  async sendContactMessage(msg: { name: string; phone: string; message: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    return res.json();
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    const res = await fetch('/api/contact');
    if (!res.ok) return [];
    return res.json();
  }
};
