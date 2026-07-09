import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { verifyAdmin } from '@/lib/auth';

export default async function handler(req, res) {
  const admin = verifyAdmin(req);
  if (!admin) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await connectDB();

    if (req.method === 'GET') {
      const categories = await Category.find({}).sort({ name: 1 }).lean();
      return res.status(200).json({ categories });
    }

    if (req.method === 'POST') {
      const { name, slug, description } = req.body;
      const category = await Category.create({ name, slug, description });
      return res.status(201).json({ category });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Category.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Deleted' });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
}
