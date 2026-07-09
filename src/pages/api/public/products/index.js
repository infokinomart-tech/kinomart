import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { products as staticProducts } from '@/utils/products';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const dbProducts = await Product.find({}).sort({ createdAt: -1 }).lean();

    const staticSlugSet = new Set(staticProducts.map((p) => p.slug));

    const normalizedDB = dbProducts
      .filter((p) => !staticSlugSet.has(p.slug))
      .map((p) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        inStock: p.inStock,
        sectionType: p.sectionType,
        thumbnail: p.thumbnail,
        description: p.shortDescription || '',
        images: p.images || [],
        variants: p.variants || [],
        category: p.category || '',
        source: 'db',
      }));

    // DB products (newest first) appear before static products
    const combined = [
      ...normalizedDB,
      ...staticProducts.map((p) => ({ ...p, source: 'static' })),
    ];

    res.status(200).json({ products: combined });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
