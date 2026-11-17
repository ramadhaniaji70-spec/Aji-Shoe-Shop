import { Heart, MessageSquarePlus, Scale, ShoppingBag, Star, Store, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { calculateMarketDiscount, FALLBACK_SHOE_SVG, formatRupiah } from '../data/products';
import { Product, ProductReview } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  focusReviewsOnOpen: boolean;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string, size: number) => void;
  onAddReview: (productId: string, review: Omit<ProductReview, 'date'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  focusReviewsOnOpen,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onAddReview,
}) => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      setSizeError(false);
      setShowReviewForm(false);
      setImgSrc(product.image);
      if (focusReviewsOnOpen) {
        const timer = setTimeout(() => {
          reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [product, focusReviewsOnOpen]);

  if (!product) return null;

  const isNew = product.condition === 'Baru';
  const discountPct = calculateMarketDiscount(product.price, product.marketPrice);
  const savedNominal = Math.max(0, product.marketPrice - product.price);
  const ratioPct = product.marketPrice > 0 ? Math.min(100, Math.round((product.price / product.marketPrice) * 100)) : 100;

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    onAddToCart(product.id, selectedSize);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    onAddReview(product.id, {
      author: reviewAuthor.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewAuthor('');
    setReviewRating(5);
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-pop my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="bg-dark-900 text-white px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail sepatu"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[82vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column: Image & Price Analytics */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/80">
                <img
                  src={imgSrc || product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgSrc(FALLBACK_SHOE_SVG)}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${
                    isNew ? 'bg-dark-900 text-white' : 'bg-amber-600 text-white'
                  }`}
                >
                  {isNew ? 'Baru (BNIB)' : 'Pre-loved / Titip Jual'}
                </span>
              </div>

              {/* Market Price Breakdown Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>Analisis Harga Pasaran</span>
                  </span>
                  <span className="text-emerald-300 text-xs font-bold tabular-nums">
                    {discountPct > 0 ? `Hemat ${discountPct}%` : 'Harga Terbaik'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Harga Retail Resmi (MSRP)</span>
                    <span className="font-medium text-slate-200 tabular-nums">{formatRupiah(product.retailPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Estimasi Harga Pasaran</span>
                    <span className="font-medium line-through text-slate-300 tabular-nums">
                      {formatRupiah(product.marketPrice)}
                    </span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                    <span className="font-semibold text-white">Harga Jual KickVault</span>
                    <span className="font-display font-extrabold text-base text-emerald-400 tabular-nums">
                      {formatRupiah(product.price)}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full transition-all duration-300"
                      style={{ width: `${ratioPct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-emerald-300 mt-1.5 font-medium tabular-nums">
                    {savedNominal > 0
                      ? `Kamu hemat ${formatRupiah(savedNominal)} dibanding rata-rata harga pasar!`
                      : 'Harga kompetitif sesuai standar pasar terkini.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Details, Size Selector, Actions, Reviews */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div>
                  <h2 id="modal-product-title" className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug">
                    {product.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                      <Store className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{product.seller}</span>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800 tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({product.reviewCount} ulasan)</span>
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

                {/* EU Size Selector */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Pilih Ukuran (EU)</span>
                    {selectedSize && (
                      <span className="text-xs font-semibold text-emerald-700">Terpilih: EU {selectedSize}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setSelectedSize(size);
                            setSizeError(false);
                          }}
                          className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer tabular-nums ${
                            isSelected
                              ? 'bg-dark-900 text-white border-dark-900 ring-2 ring-emerald-500/40'
                              : 'border-slate-200 hover:border-dark-900 text-slate-800 bg-white'
                          }`}
                        >
                          EU {size}
                        </button>
                      );
                    })}
                  </div>
                  {sizeError && (
                    <p className="text-xs font-semibold text-rose-600">
                      Silakan pilih ukuran sepatu terlebih dahulu sebelum menambahkan ke keranjang.
                    </p>
                  )}
                </div>

                {/* Primary Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCartClick}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 px-5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Tambah ke Keranjang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    aria-label={isWishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                    className={`w-12 h-[46px] rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'border-rose-300 bg-rose-50 text-rose-500'
                        : 'border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Customer Reviews Section */}
              <div ref={reviewsRef} className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    Ulasan Pembeli ({product.reviews.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>{showReviewForm ? 'Tutup Form' : 'Tulis Ulasan'}</span>
                  </button>
                </div>

                {/* Collapsible Review Form */}
                {showReviewForm && (
                  <form
                    onSubmit={handleReviewSubmit}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Anda *</label>
                        <input
                          type="text"
                          required
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="Contoh: Andi Pratama"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Rating</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                        >
                          <option value={5}>5 Bintang — Sempurna</option>
                          <option value={4}>4 Bintang — Bagus</option>
                          <option value={3}>3 Bintang — Cukup</option>
                          <option value={2}>2 Bintang — Kurang</option>
                          <option value={1}>1 Bintang — Buruk</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Komentar Ulasan *</label>
                      <textarea
                        required
                        rows={2}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Bagikan pengalaman tentang keaslian, kondisi, atau kenyamanan sepatu..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-dark-900 hover:bg-emerald-600 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Kirim Ulasan
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {product.reviews.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      Belum ada ulasan tertulis. Jadilah yang pertama mengulas!
                    </p>
                  ) : (
                    product.reviews.map((rev, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-800">{rev.author}</span>
                            <span className="text-amber-500 text-xs tracking-tighter" aria-label={`${rev.rating} bintang`}>
                              {'★'.repeat(rev.rating)}
                              {'☆'.repeat(5 - rev.rating)}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{rev.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
