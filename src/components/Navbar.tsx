import { Heart, PlusCircle, Search, ShoppingBag, X, Zap } from 'lucide-react';
import React from 'react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onResetFilters: () => void;
  onOpenSellModal: () => void;
  wishlistCount: number;
  wishlistOnly: boolean;
  onToggleWishlistFilter: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onCopyPromoCode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onResetFilters,
  onOpenSellModal,
  wishlistCount,
  wishlistOnly,
  onToggleWishlistFilter,
  cartCount,
  onOpenCart,
  onCopyPromoCode,
}) => {
  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-dark-900 text-white text-xs py-2 px-4 text-center font-medium tracking-wide border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span className="text-emerald-400 font-bold tracking-wider">100% AUTHENTIC</span>
          <span className="text-slate-500" aria-hidden="true">
            ·
          </span>
          <span className="text-slate-200">
            Garansi Uang Kembali 2x Lipat Jika Tidak Original · Gunakan kode{' '}
            <button
              type="button"
              onClick={onCopyPromoCode}
              className="text-emerald-400 font-bold underline decoration-dotted underline-offset-4 hover:text-emerald-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-400 rounded px-0.5"
            >
              SNEAKER10
            </button>{' '}
            untuk diskon ekstra 10%!
          </span>
        </div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-3 sm:gap-6">
            {/* Brand Logo */}
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onResetFilters();
              }}
              className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-dark-900 text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-600 transition-colors">
                <Zap className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 whitespace-nowrap">
                KICK<span className="text-emerald-600">VAULT</span>
              </span>
            </a>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Cari Nike Dunk, Jordan, New Balance, Running, Boots..."
                  aria-label="Cari sepatu, brand, atau kategori"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-emerald-500 rounded-xl text-sm transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="Hapus pencarian"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenSellModal}
                className="inline-flex items-center gap-2 bg-dark-900 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap cursor-pointer min-h-[42px]"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Jual <span className="hidden sm:inline">/ Titip Sepatu</span>
                </span>
              </button>

              <button
                type="button"
                onClick={onToggleWishlistFilter}
                title="Favorit Saya"
                aria-label="Filter sepatu favorit"
                className={`relative p-2.5 rounded-xl border transition-colors cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center ${
                  wishlistOnly
                    ? 'bg-rose-50 border-rose-400 text-rose-600'
                    : 'border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlistOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow tabular-nums">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenCart}
                aria-label="Buka keranjang belanja"
                className="relative p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-800 transition-colors cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow tabular-nums">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="pb-3 md:hidden">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari sepatu, brand, atau kategori..."
                aria-label="Cari sepatu di ponsel"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-xl text-sm outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
