import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FolderTree, Eye, EyeOff, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isVisible, setIsVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setName('');
    setIconUrl('');
    setDisplayOrder(String(categories.length + 1));
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setIconUrl(cat.icon_url || '');
    setDisplayOrder(String(cat.display_order));
    setIsVisible(cat.is_visible);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        icon_url: iconUrl.trim(),
        display_order: Number(displayOrder) || 1,
        is_visible: isVisible
      };

      if (editingCat) {
        await api.updateCategory(editingCat.id, payload);
      } else {
        await api.createCategory(payload);
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      console.error('Failed to save category', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই ক্যাটাগরিটি ডিলিট করতে চান?')) {
      await api.deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#181F30] border border-[#27324A] p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">ক্যাটাগরি ম্যানেজমেন্ট</h2>
          <p className="text-xs text-gray-400">হোম পেইজে প্রদর্শিত গ্যাজেট ক্যাটাগরি তালিকা</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="text-gray-400 text-xs py-8">ক্যাটাগরি লোড হচ্ছে...</div>
        ) : (
          categories.map(cat => (
            <div
              key={cat.id}
              className="bg-[#181F30] border border-[#27324A] rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-[#0F1420] border border-[#27324A] overflow-hidden flex items-center justify-center p-1">
                  {cat.icon_url ? (
                    <img src={cat.icon_url} alt={cat.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <FolderTree className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{cat.name}</h4>
                  <span className="text-[10px] text-gray-400">অর্ডার পজিশন: {cat.display_order}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 bg-[#27324A] hover:bg-[#3B82F6] text-white rounded-lg transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 bg-red-950 hover:bg-red-800 text-red-300 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#181F30] border border-[#27324A] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-gray-100">
            <h3 className="font-bold text-base text-white border-b border-[#27324A] pb-3">
              {editingCat ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 mb-1">ক্যাটাগরি নাম (বাংলা) *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1420] border border-[#27324A] rounded-xl text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1.5">ক্যাটাগরি ছবি / আইকন (Custom Image Upload)</label>
                
                {/* Image Preview Box */}
                {iconUrl ? (
                  <div className="relative w-20 h-20 mb-3 rounded-xl bg-[#0F1420] border border-[#27324A] overflow-hidden group shadow-md flex items-center justify-center p-1">
                    <img src={iconUrl} alt="Category Preview" className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setIconUrl('')}
                      className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
                      title="ছবি রিমুভ করুন"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : null}

                <div className="space-y-2">
                  {/* Custom File Upload Button */}
                  <label className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#27324A] hover:bg-[#32405D] active:scale-98 text-white font-semibold rounded-xl cursor-pointer transition-all border border-dashed border-[#3B82F6]/50 text-xs shadow-sm">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span>কম্পিউটার/মোবাইল থেকে ছবি আপলোড করুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="text-center text-[11px] text-gray-400 font-medium">অথবা ছবির লিংক (URL) বসান:</div>

                  <input
                    type="text"
                    placeholder="https://example.com/category-image.png"
                    value={iconUrl}
                    onChange={e => setIconUrl(e.target.value)}
                    className="w-full p-2.5 bg-[#0F1420] border border-[#27324A] rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">ডিসপ্লে ক্রম পজিশন</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={e => setDisplayOrder(e.target.value)}
                  className="w-full p-2.5 bg-[#0F1420] border border-[#27324A] rounded-xl text-white outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={e => setIsVisible(e.target.checked)}
                  className="accent-[#3B82F6]"
                />
                <span>হোম পেইজে দেখাবে (Visible)</span>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#27324A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#0F1420] text-gray-300 font-bold rounded-xl"
                >
                  ক্যান্সেল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl"
                >
                  {isSaving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
