import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyAdmin } from '@/lib/auth';

export default async function handler(req, res) {
  const admin = verifyAdmin(req);
  if (!admin) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await connectDB();
    const { id } = req.query;

    if (req.method === 'GET') {
      const product = await Product.findById(id).lean();
      if (!product) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json({ product });
    }

    if (req.method === 'PUT') {
      const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!product) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json({ product });
    }

    if (req.method === 'DELETE') {
      await Product.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Deleted' });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
}
