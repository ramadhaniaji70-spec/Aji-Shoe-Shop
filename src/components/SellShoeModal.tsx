import { Send, Tag, X } from 'lucide-react';
import React, { useState } from 'react';
import { calculateMarketDiscount, EU_SIZES, PHOTO_POOL, PRESET_IMAGES } from '../data/products';
import { Product, ProductCategory, ProductCondition } from '../types';

interface SellShoeModalProps {
  isOpen: boolean;
  availableBrands: string[];
  onClose: () => void;
  onCreateProduct: (product: Product) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const SellShoeModal: React.FC<SellShoeModalProps> = ({
  isOpen,
  availableBrands,
  onClose,
  onCreateProduct,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Sneakers');
  const [condition, setCondition] = useState<ProductCondition>('Baru');
  const [seller, setSeller] = useState('');
  const [price, setPrice] = useState('');
  const [marketPrice, setMarketPrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([40, 41, 42]);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const numericPrice = Number(price) || 0;
  const numericMarket = Number(marketPrice) || 0;
  const discountPct =
    numericPrice > 0 && numericMarket > numericPrice
      ? calculateMarketDiscount(numericPrice, numericMarket)
      : 0;

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSizes.length === 0) {
      onShowToast('Pilih minimal 1 ukuran sepatu yang tersedia!', 'error');
      return;
    }

    const newShoe: Product = {
      id: 'kv-' + Date.now(),
      name: name.trim(),
      brand: brand.trim(),
      category,
      condition,
      price: numericPrice,
      marketPrice: numericMarket,
      retailPrice: Number(retailPrice) || numericMarket,
      rating: 5.0,
      reviewCount: 1,
      sizes: [...selectedSizes].sort((a, b) => a - b),
      seller: seller.trim(),
      image: imageUrl.trim() || PHOTO_POOL.runningRed,
      description: description.trim(),
      reviews: [
        {
          author: 'Tim Verifikasi KickVault',
          rating: 5,
          date: 'Baru saja',
          comment: 'Listing terverifikasi dan siap ditransaksikan dengan perlindungan pembeli.',
        },
      ],
    };

    onCreateProduct(newShoe);
    setName('');
    setBrand('');
    setCategory('Sneakers');
    setCondition('Baru');
    setSeller('');
    setPrice('');
    setMarketPrice('');
    setRetailPrice('');
    setSelectedSizes([40, 41, 42]);
    setImageUrl('');
    setDescription('');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sell-modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-pop my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 id="sell-modal-title" className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                Jual / Titip Sepatu Anda
              </h2>
              <p className="text-xs text-slate-500">Tayangkan langsung ke katalog KickVault ID</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form jual sepatu"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 max-h-[82vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Model Sepatu *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Nike Dunk Low 'Panda' atau Hoka Clifton 9"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Brand * <span className="font-normal text-slate-400">(Pilih atau ketik baru)</span>
              </label>
              <input
                type="text"
                list="sellBrandDatalist"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Nike, Hoka, Salomon, Red Wing, dll"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
              />
              <datalist id="sellBrandDatalist">
                {availableBrands.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-none"
              >
                <option value="Sneakers">Sneakers &amp; Lifestyle</option>
                <option value="Running">Running &amp; Sport</option>
                <option value="Basketball">Basketball</option>
                <option value="Skateboarding">Skateboarding</option>
                <option value="Boots/Formal">Boots &amp; Formal</option>
                <option value="Outdoor/Trail">Outdoor &amp; Trail</option>
                <option value="Slides/Sandals">Slides &amp; Sandals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kondisi Sepatu *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-none"
              >
                <option value="Baru">Baru (BNIB - Brand New In Box)</option>
                <option value="Pre-loved">Pre-loved / Titip Jual (VNDS / Mulus)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Toko / Penjual *</label>
              <input
                type="text"
                required
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                placeholder="Contoh: JakartaKicks Official"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Price Inputs with Live Savings Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800">Pengaturan Harga &amp; Perbandingan Pasar</span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md tabular-nums ${
                  discountPct > 0 ? 'text-emerald-700 bg-emerald-100' : 'text-slate-600 bg-slate-200'
                }`}
              >
                {discountPct > 0 ? `Hemat ${discountPct}% dari Pasar` : 'Harga Standar Pasar'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Harga Jual Anda (Rp) *</label>
                <input
                  type="number"
                  required
                  min={100000}
                  step={10000}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1450000"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-none font-semibold text-emerald-700 bg-white tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Harga Pasaran (Rp) *</label>
                <input
                  type="number"
                  required
                  min={100000}
                  step={10000}
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(e.target.value)}
                  placeholder="1850000"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-none bg-white tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Harga Retail / MSRP (Rp)</label>
                <input
                  type="number"
                  min={100000}
                  step={10000}
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value)}
                  placeholder="1729000"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-none bg-white tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Size Multi-select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ukuran Tersedia (EU) * <span className="font-normal text-slate-500">(Pilih minimal 1)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EU_SIZES.map((size) => {
                const checked = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer tabular-nums ${
                      checked
                        ? 'bg-dark-900 text-white border-dark-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                    }`}
                  >
                    EU {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image URL or Preset Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Foto Sepatu (URL atau Pilih Preset Sesuai Jenis Sepatu)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-none mb-2"
            />
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">Preset Foto:</span>
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setImageUrl(preset.url);
                    onShowToast(`Preset foto "${preset.label}" dipilih!`, 'info');
                  }}
                  className={`shrink-0 text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    imageUrl === preset.url
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi &amp; Catatan Penjual *</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kelengkapan box, extra laces, kondisi tag, atau catatan khusus..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Tayangkan Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
