import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: { type: String },
  value: { type: String },
  priceModifier: { type: Number, default: 0 },
});

const faqSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String },
});

const reviewSchema = new mongoose.Schema({
  reviewerName: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  images: [String],
});

const specSchema = new mongoose.Schema({
  label: { type: String },
  value: { type: String },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, default: '' },
    descriptionHTML: { type: String, default: '' },
    category: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    images: { type: [String], default: [] },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    sectionType: { type: String, enum: ['hot', 'normal'], default: 'hot' },
    discountTimer: { type: Boolean, default: false },
    variants: { type: [variantSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
    reviews: { type: [reviewSchema], default: [] },
    specifications: { type: [specSchema], default: [] },
    gallery: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.models.Product ||
  mongoose.model('Product', productSchema);
