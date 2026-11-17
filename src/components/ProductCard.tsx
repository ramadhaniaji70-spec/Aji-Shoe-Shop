import { Heart, ShoppingBag, Star } from 'lucide-react';
import React, { useState } from 'react';
import { calculateMarketDiscount, FALLBACK_SHOE_SVG, formatRupiah } from '../data/products';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenDetail: (productId: string, focusReviews?: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenDetail,
}) => {
  const [imgSrc, setImgSrc] = useState(product.image);
  const discountPct = calculateMarketDiscount(product.price, product.marketPrice);
  const isNew = product.condition === 'Baru';

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div
          onClick={() => onOpenDetail(product.id)}
          className="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer"
        >
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgSrc(FALLBACK_SHOE_SVG)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Top Condition & Savings Indicator */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs backdrop-blur-md ${
                isNew ? 'bg-dark-900/90 text-white' : 'bg-amber-600/95 text-white'
              }`}
            >
              {isNew ? 'Baru (BNIB)' : 'Titip Jual'}
            </span>
            {discountPct > 0 && (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-600 text-white shadow-xs tabular-nums">
                Hemat {discountPct}%
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label={isWishlisted ? `Hapus ${product.name} dari favorit` : `Tambah ${product.name} ke favorit`}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
              isWishlisted ? 'text-rose-500' : 'text-slate-600 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Quick Sizes Overlay on Hover */}
          <div className="absolute bottom-2.5 inset-x-2.5 bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Size EU:</span>
            <span className="text-[11px] font-bold text-slate-800 truncate ml-2 tabular-nums">
              {product.sizes.join(', ')}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2.5">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="font-bold uppercase tracking-wider text-slate-500 truncate">{product.brand}</span>
            <button
              type="button"
              onClick={() => onOpenDetail(product.id, true)}
              className="flex items-center gap-1 text-amber-500 font-bold hover:underline shrink-0 cursor-pointer"
              title="Lihat Ulasan Pembeli"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="text-slate-800 tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal tabular-nums">({product.reviewCount})</span>
            </button>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetail(product.id)}
            className="font-display font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug cursor-pointer group-hover:text-emerald-600 transition-colors min-h-[2.6em]"
          >
            {product.name}
          </h3>

          {/* Market Price Comparison Block */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Harga Pasaran:</span>
              <span className="line-through font-medium tabular-nums">{formatRupiah(product.marketPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Retail (MSRP):</span>
              <span className="tabular-nums">{formatRupiah(product.retailPrice)}</span>
            </div>
            <div className="pt-1 border-t border-slate-200/70 flex items-baseline justify-between gap-2">
              <span className="font-display font-extrabold text-base sm:text-lg text-slate-900 tabular-nums">
                {formatRupiah(product.price)}
              </span>
              {discountPct > 0 && (
                <span className="text-[11px] font-bold text-emerald-700 tabular-nums">-{discountPct}% Pasar</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="px-4 pb-4 pt-1">
        <button
          type="button"
          onClick={() => onOpenDetail(product.id)}
          className="w-full bg-dark-900 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Pilih Ukuran</span>
        </button>
      </div>
    </article>
  );
};
