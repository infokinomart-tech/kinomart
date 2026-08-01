-- KinoMart Supabase Database Schema
-- Run this SQL script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- --------------------------------------------------------
-- 1. Backup / Store Data Table (Fail-safe JSON store)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_data (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 2. Relational Table: categories
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon_name TEXT,
    icon_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 3. Relational Table: products
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price NUMERIC NOT NULL,
    discount_price NUMERIC,
    category_id TEXT,
    category_name TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    variants JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '[]'::jsonb,
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    status TEXT DEFAULT 'active',
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    timer_enabled BOOLEAN DEFAULT FALSE,
    timer_title TEXT,
    timer_end_time TEXT,
    timer_hours NUMERIC,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 4. Relational Table: orders
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT,
    customer_id TEXT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    area TEXT DEFAULT 'inside_dhaka',
    shipping_cost NUMERIC DEFAULT 60,
    items JSONB DEFAULT '[]'::jsonb,
    total_revenue NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'cod',
    bkash_number TEXT,
    transaction_id TEXT,
    coupon_code TEXT,
    discount_amount NUMERIC,
    order_status TEXT DEFAULT 'pending',
    call_status TEXT DEFAULT 'not_called',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 5. Relational Table: customers
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 6. Relational Table: coupons
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    discount_type TEXT NOT NULL DEFAULT 'fixed',
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    max_discount_amount NUMERIC,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 7. Relational Table: reviews
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT,
    rating NUMERIC DEFAULT 5.0,
    comment TEXT NOT NULL,
    is_verified_buyer BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 8. Relational Table: settings
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'store_settings',
    store_name TEXT DEFAULT 'KinoMart',
    logo_title TEXT DEFAULT 'KinoMart',
    logo_url TEXT,
    phone TEXT DEFAULT '01700000000',
    whatsapp TEXT DEFAULT '01700000000',
    address TEXT DEFAULT 'ঢাকা, বাংলাদেশ',
    bkash_number TEXT DEFAULT '01700123456',
    nagad_number TEXT DEFAULT '01700123456',
    hero_title TEXT DEFAULT 'প্রিমিয়াম গ্যাজেটের নির্ভরযোগ্য ঠিকানা',
    hero_subtitle TEXT DEFAULT 'সেরা অফারে অরিজিনাল গ্যাজেট কিনুন কীনোমার্ট থেকে',
    hero_image TEXT,
    banner_images JSONB DEFAULT '[]'::jsonb,
    inside_dhaka_charge NUMERIC DEFAULT 70,
    outside_dhaka_charge NUMERIC DEFAULT 130,
    free_shipping_min NUMERIC DEFAULT 3000,
    header_notice TEXT DEFAULT '⚡ কীনোমার্ট এ পাচ্ছেন দেশজুড়ে দ্রুত ক্যাশ অন ডেলিভারি এবং ১০০% অরিজিনাল গ্যাজেটের নিশ্চয়তা!',
    footer_about TEXT DEFAULT 'কীনোমার্ট বাংলাদেশের একটি বিশ্বস্ত প্রিমিয়াম গ্যাজেট অনলাইন শপ। আমরা সরবরাহ করি ১০০% অরিজিনাল ও মানসম্মত ইলেকট্রনিক্স গ্যাজেট।',
    pixel_id TEXT DEFAULT '123456789012345',
    capi_token TEXT DEFAULT 'EAA123456789ABCDEF...',
    admin_id TEXT DEFAULT 'kinomart',
    admin_password TEXT DEFAULT '@kinomart12@',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- Enable RLS and Create Open Policies for Public API access
-- --------------------------------------------------------
ALTER TABLE public.store_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public store_data" ON public.store_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
