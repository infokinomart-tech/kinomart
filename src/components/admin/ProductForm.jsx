import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import HtmlEditor from './HtmlEditor';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ImageUploader({ label, value, onChange, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  async function uploadFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const r = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, data: e.target.result }),
          });
          const data = await r.json();
          if (!r.ok) throw new Error(data.message);
          resolve(data.url);
        } catch (err) { reject(err); }
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(files) {
    setUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadFile));
      if (multiple) onChange([...(value || []), ...urls]);
      else onChange(urls[0]);
    } catch { alert('Upload failed'); }
    finally { setUploading(false); }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <div className="flex items-start gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <FiUpload className="w-3.5 h-3.5" />
          {uploading ? 'Uploading…' : 'Upload Image'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files)} />

        {!multiple && (
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or paste image URL"
              className="form-input w-full"
            />
            {value && (
              <div className="mt-2 relative inline-block">
                <img src={value} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                <button type="button" onClick={() => onChange('')} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
              </div>
            )}
          </div>
        )}

        {multiple && (
          <div className="flex-1">
            {value && value.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {value.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt={`img-${i}`} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                    <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="text"
              placeholder="Or paste URL and press Enter"
              className="form-input w-full text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const v = e.target.value.trim();
                  if (v) { onChange([...(value || []), v]); e.target.value = ''; }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function VariantRow({ variant, onChange, onRemove }) {
  return (
    <div className="border border-slate-200 rounded-xl p-3 mb-3 bg-slate-50">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Variant Name</label>
          <input
            type="text"
            value={variant.name || ''}
            onChange={(e) => onChange({ ...variant, name: e.target.value })}
            placeholder="e.g. Color, Size, Flavor"
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Value</label>
          <input
            type="text"
            value={variant.value || ''}
            onChange={(e) => onChange({ ...variant, value: e.target.value })}
            placeholder="e.g. Black, XL, Mint"
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Price Modifier (৳)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={variant.priceModifier || 0}
              onChange={(e) => onChange({ ...variant, priceModifier: Number(e.target.value) })}
              placeholder="0"
              className="form-input flex-1"
              title="Adjust price for this variant (e.g. +50 or -100)"
            />
            <button type="button" onClick={onRemove} className="flex-shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors">
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PairEditor({ items, onChange, keyPlaceholder, valuePlaceholder, keyField, valueField }) {
  function add() { onChange([...items, { [keyField]: '', [valueField]: '' }]); }
  function remove(i) { onChange(items.filter((_, j) => j !== i)); }
  function update(i, field, val) { onChange(items.map((x, j) => j === i ? { ...x, [field]: val } : x)); }

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <input type="text" value={item[keyField] || ''} onChange={(e) => update(i, keyField, e.target.value)} placeholder={keyPlaceholder} className="form-input flex-1" />
          <input type="text" value={item[valueField] || ''} onChange={(e) => update(i, valueField, e.target.value)} placeholder={valuePlaceholder} className="form-input flex-1" />
          <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-1 flex-shrink-0"><FiTrash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1 text-blue-700 text-xs font-semibold hover:text-blue-800 mt-1">
        <FiPlus className="w-3.5 h-3.5" /> Add Row
      </button>
    </div>
  );
}

function ReviewEditor({ reviews, onChange }) {
  function add() { onChange([...reviews, { reviewerName: '', rating: 5, comment: '', images: [] }]); }
  function remove(i) { onChange(reviews.filter((_, j) => j !== i)); }
  function update(i, field, val) { onChange(reviews.map((r, j) => j === i ? { ...r, [field]: val } : r)); }

  return (
    <div className="space-y-3">
      {reviews.map((r, i) => (
        <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Review #{i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium hover:bg-red-50 px-2 py-1 rounded-lg transition-colors">
              <FiTrash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Reviewer Name</label>
              <input
                type="text"
                value={r.reviewerName}
                onChange={(e) => update(i, 'reviewerName', e.target.value)}
                placeholder="e.g. Rahim Ahmed"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Rating</label>
              <select value={r.rating} onChange={(e) => update(i, 'rating', Number(e.target.value))} className="form-input">
                <option value={5}>⭐⭐⭐⭐⭐ — 5 Stars</option>
                <option value={4}>⭐⭐⭐⭐ — 4 Stars</option>
                <option value={3}>⭐⭐⭐ — 3 Stars</option>
                <option value={2}>⭐⭐ — 2 Stars</option>
                <option value={1}>⭐ — 1 Star</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Comment</label>
            <textarea
              value={r.comment}
              onChange={(e) => update(i, 'comment', e.target.value)}
              placeholder="Write the review comment here…"
              rows={3}
              className="form-input resize-none w-full"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold hover:text-blue-800 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors">
        <FiPlus className="w-3.5 h-3.5" /> Add Review
      </button>
    </div>
  );
}

const EMPTY = {
  title: '', slug: '', shortDescription: '', descriptionHTML: '',
  category: '', thumbnail: '', images: [],
  price: '', originalPrice: '',
  inStock: true, sectionType: 'hot', discountTimer: false,
  variants: [], faqs: [], specifications: [], reviews: [], gallery: [],
};

export default function ProductForm({ title, initialData, onSubmit, saving, error, backHref }) {
  const [form, setForm] = useState(EMPTY);
  const [slugManual, setSlugManual] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!initialData) return;
    setForm({
      title: initialData.title || '',
      slug: initialData.slug || '',
      shortDescription: initialData.shortDescription || '',
      descriptionHTML: initialData.descriptionHTML || '',
      category: initialData.category || '',
      thumbnail: initialData.thumbnail || '',
      images: initialData.images || [],
      price: initialData.price || '',
      originalPrice: initialData.originalPrice || '',
      inStock: initialData.inStock !== false,
      sectionType: initialData.sectionType || 'hot',
      discountTimer: !!initialData.discountTimer,
      variants: initialData.variants || [],
      faqs: initialData.faqs || [],
      specifications: initialData.specifications || [],
      reviews: initialData.reviews || [],
      gallery: initialData.gallery || [],
    });
    setSlugManual(true);
  }, [initialData]);

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })); }

  function handleTitleChange(val) {
    setForm((p) => ({ ...p, title: val, slug: slugManual ? p.slug : slugify(val) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) });
  }

  return (
    <form id="product-form" onSubmit={handleSubmit}>
      {/* Sticky toolbar */}
      <div className="flex items-center justify-between bg-white border-b border-slate-100 px-0 py-3 mb-6 sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 shadow-sm">
        <Link href={backHref} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <div className="flex items-center gap-3">
          {error && <p className="text-xs text-red-600 font-medium max-w-xs truncate">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            style={{ background: saving ? '#9ca3af' : '#2563EB' }}
          >
            <FiSave className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="space-y-5 max-w-4xl">
        {/* Basic Info */}
        <Section title="Basic Information" subtitle="Core product details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Product Title *">
              <input required type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="form-input" placeholder="e.g. Adjustable Polarized Sunglass" />
            </Field>
            <Field label="URL Slug *" hint="Auto-generated from title">
              <input required type="text" value={form.slug} onChange={(e) => { setSlugManual(true); set('slug', e.target.value); }} className="form-input font-mono text-xs" placeholder="adjustable-polarized-sunglass" />
            </Field>

            <Field label="Category">
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="form-input">
                <option value="">— No Category —</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-[10px] text-slate-400 mt-1">No categories yet. <a href="/admin/categories" className="text-blue-700 hover:underline">Create one first</a>.</p>
              )}
            </Field>

            <Field label="Section Type">
              <select value={form.sectionType} onChange={(e) => set('sectionType', e.target.value)} className="form-input">
                <option value="hot">🔥 Hot / New Arrivals</option>
                <option value="normal">📦 Normal</option>
              </select>
            </Field>

            <Field label="Sale Price (৳) *">
              <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} className="form-input" placeholder="999" />
            </Field>
            <Field label="Original Price (৳) *" hint="For strikethrough display">
              <input required type="number" min="0" step="0.01" value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} className="form-input" placeholder="1299" />
            </Field>

            <div className="md:col-span-2">
              <Field label="Short Description" hint="Shown on listing pages and product page header">
                <textarea value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} rows={3} className="form-input resize-none" placeholder="Brief one or two sentence description of the product" />
              </Field>
            </div>

            <div className="flex flex-col gap-4">
              <Toggle label="In Stock" checked={form.inStock} onChange={(v) => set('inStock', v)} color="emerald" />
              <Toggle label="Show Countdown Timer" checked={form.discountTimer} onChange={(v) => set('discountTimer', v)} color="blue" hint="Displays a daily countdown to midnight on the product page" />
            </div>
          </div>
        </Section>

        {/* Images */}
        <Section title="Images" subtitle="Thumbnail and product image gallery">
          <div className="space-y-5">
            <ImageUploader label="Thumbnail (Main listing image)" value={form.thumbnail} onChange={(v) => set('thumbnail', v)} />
            <ImageUploader label="Product Gallery Images" value={form.images} onChange={(v) => set('images', v)} multiple />
          </div>
        </Section>

        {/* Variants */}
        <Section title="Variants" subtitle="Colors, sizes, flavors, or any product options">
          <p className="text-xs text-slate-500 mb-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            <strong>Name</strong> = variant label (Color, Size, Flavor) · <strong>Value</strong> = option (Black, XL, Mint) · <strong>+/-৳</strong> = price adjustment
          </p>
          {form.variants.map((v, i) => (
            <VariantRow key={i} variant={v}
              onChange={(u) => set('variants', form.variants.map((x, j) => j === i ? u : x))}
              onRemove={() => set('variants', form.variants.filter((_, j) => j !== i))}
            />
          ))}
          <button type="button" onClick={() => set('variants', [...form.variants, { name: '', value: '', priceModifier: 0 }])}
            className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold hover:text-blue-800 mt-1">
            <FiPlus className="w-3.5 h-3.5" /> Add Variant
          </button>
        </Section>

        {/* HTML Description */}
        <Section title="Full Description" subtitle="Rich HTML content shown on the product page">
          <HtmlEditor value={form.descriptionHTML} onChange={(v) => set('descriptionHTML', v)} />
        </Section>

        {/* Specifications */}
        <Section title="Specifications Table" subtitle="Optional — displayed as a specs table on the product page" optional>
          <PairEditor items={form.specifications} onChange={(v) => set('specifications', v)}
            keyField="label" valueField="value"
            keyPlaceholder="Label (e.g. Material)" valuePlaceholder="Value (e.g. Aluminium)" />
        </Section>

        {/* FAQs */}
        <Section title="FAQs" subtitle="Optional — displayed as expandable Q&A on the product page" optional>
          <PairEditor items={form.faqs} onChange={(v) => set('faqs', v)}
            keyField="question" valueField="answer"
            keyPlaceholder="Question" valuePlaceholder="Answer" />
        </Section>

        {/* Reviews */}
        <Section title="Customer Reviews" subtitle="Optional — displayed in a review grid on the product page" optional>
          <ReviewEditor reviews={form.reviews} onChange={(v) => set('reviews', v)} />
        </Section>

        {/* Extra Gallery */}
        <Section title="Extra Gallery Grid" subtitle="Optional — full-width image grid shown below description" optional>
          <ImageUploader label="Gallery Images" value={form.gallery} onChange={(v) => set('gallery', v)} multiple />
        </Section>
      </div>

      <style jsx global>{`
        .form-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.8125rem;
          outline: none;
          background: white;
          transition: box-shadow 0.15s, border-color 0.15s;
          color: #1e293b;
        }
        .form-input:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.18);
        }
      `}</style>
    </form>
  );
}

function Section({ title, subtitle, children, optional }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {optional && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mt-0.5">Optional</span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label}
        {hint && <span className="font-normal text-slate-400 ml-1">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange, color = 'blue', hint }) {
  const colors = {
    emerald: 'peer-checked:bg-emerald-500',
    amber: 'peer-checked:bg-amber-500',
    blue: 'peer-checked:bg-blue-500',
  };
  return (
    <div>
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
          <div className={`w-9 h-5 bg-slate-200 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full ${colors[color]}`}></div>
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </label>
      {hint && <p className="text-[10px] text-slate-400 mt-0.5 pl-12">{hint}</p>}
    </div>
  );
}
