import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { products as staticProducts } from '@/utils/products';

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Method not allowed' });

  const { slug } = req.query;

  const staticProduct = staticProducts.find((p) => p.slug === slug);
  if (staticProduct)
    return res.status(200).json({ product: staticProduct, source: 'static' });

  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({
      product: { ...product, id: product._id.toString() },
      source: 'db',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
