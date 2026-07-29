-- KinoMart Supabase Database Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable Row Level Security (RLS) or public access policies
-- Note: Enable public read/write access for anonymous client requests if using anon key, or use service_role key.

-- --------------------------------------------------------
-- Table: categories
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon_name TEXT,
    icon_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- Table: products
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
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
    rating NUMERIC DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    timer_enabled BOOLEAN DEFAULT FALSE,
    timer_title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- Table: orders
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    invoice_id TEXT UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT DEFAULT 'Dhaka',
    courier TEXT DEFAULT 'Steadfast',
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    delivery_fee NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'cod',
    payment_status TEXT DEFAULT 'unpaid',
    bkash_number TEXT,
    trx_id TEXT,
    order_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- Table: customers
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    address TEXT,
    orders_count INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- Table: coupons
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'fixed',
    amount NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    max_discount_amount NUMERIC,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- Table: settings
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

-- Enable RLS & set public read/write permissions for easy access
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create open RLS policies (for anon & authenticated roles)
CREATE POLICY "Allow public full access categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- Insert Default Store Settings Row if not exists
INSERT INTO public.settings (id, store_name, logo_title, phone, whatsapp, address, bkash_number, nagad_number, admin_id, admin_password)
VALUES ('store_settings', 'KinoMart', 'KinoMart', '01700000000', '01700000000', 'ঢাকা, বাংলাদেশ', '01700123456', '01700123456', 'kinomart', '@kinomart12@')
ON CONFLICT (id) DO NOTHING;
