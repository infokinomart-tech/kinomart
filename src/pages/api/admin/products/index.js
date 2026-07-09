import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyAdmin } from '@/lib/auth';

export default async function handler(req, res) {
  const admin = verifyAdmin(req);
  if (!admin) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await connectDB();

    if (req.method === 'GET') {
      const products = await Product.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ products });
    }

    if (req.method === 'POST') {
      const product = await Product.create(req.body);
      return res.status(201).json({ product });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
}
