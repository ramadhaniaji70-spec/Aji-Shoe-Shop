import { Lock, ShoppingBag, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { FALLBACK_SHOE_SVG, formatRupiah } from '../data/products';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  products: Product[];
  promoApplied: boolean;
  onClose: () => void;
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onApplyPromo: (code: string) => boolean;
  onCheckout: (paidAmount: number, savedAmount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  products,
  promoApplied,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onApplyPromo,
  onCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ text: string; valid: boolean } | null>(null);

  if (!isOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  let subtotal = 0;
  let totalMarketValue = 0;
  const resolvedItems = cart
    .map((item, index) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      subtotal += product.price * item.qty;
      totalMarketValue += product.marketPrice * item.qty;
      return { item, index, product };
    })
    .filter((entry): entry is { item: CartItem; index: number; product: Product } => entry !== null);

  const marketSavings = Math.max(0, totalMarketValue - subtotal);
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const authFee = resolvedItems.length > 0 ? 25000 : 0;
  const grandTotal = subtotal - promoDiscount + authFee;

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = onApplyPromo(promoInput);
    if (isValid) {
      setPromoFeedback({
        text: 'Kode promo SNEAKER10 aktif! Diskon ekstra 10% diterapkan.',
        valid: true,
      });
    } else {
      setPromoFeedback({
        text: 'Kode promo tidak valid. Coba gunakan SNEAKER10.',
        valid: false,
      });
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slide-in"
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang Belanja"
      >
        {/* Cart Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="font-display font-bold text-base text-slate-900 tabular-nums">
              Keranjang Belanja ({totalItems})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup keranjang"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {resolvedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="font-display font-bold text-slate-800">Keranjang Masih Kosong</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Temukan sepatu impianmu dengan harga di bawah pasaran sekarang.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 bg-dark-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            resolvedItems.map(({ item, index, product }) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-3.5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_SHOE_SVG;
                  }}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                        {product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(index)}
                        aria-label={`Hapus ${product.name} dari keranjang`}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="inline-block mt-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md tabular-nums">
                      Size: EU {item.size}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-xs text-emerald-700 tabular-nums">
                      {formatRupiah(product.price * item.qty)}
                    </span>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(index, -1)}
                        aria-label="Kurangi jumlah"
                        className="px-2.5 py-1 text-xs hover:bg-slate-100 font-bold text-slate-600 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 text-xs font-bold text-slate-900 tabular-nums">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(index, 1)}
                        aria-label="Tambah jumlah"
                        className="px-2.5 py-1 text-xs hover:bg-slate-100 font-bold text-slate-600 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer & Checkout Summary */}
        {resolvedItems.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 p-5 space-y-3.5">
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Kode promo (coba: SNEAKER10)"
                aria-label="Kode promo"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white uppercase font-semibold outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-dark-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Pakai
              </button>
            </form>

            {promoFeedback && (
              <p className={`text-[11px] font-semibold ${promoFeedback.valid ? 'text-emerald-600' : 'text-rose-500'}`}>
                {promoFeedback.text}
              </p>
            )}

            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Total Hemat dari Harga Pasar</span>
                <span className="tabular-nums">- {formatRupiah(marketSavings)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskon Promo (10%)</span>
                  <span className="tabular-nums">- {formatRupiah(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Biaya Autentikasi &amp; Asuransi</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatRupiah(authFee)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900">Total Pembayaran</span>
                <span className="font-display font-extrabold text-lg text-emerald-600 tabular-nums">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPromoInput('');
                setPromoFeedback(null);
                onCheckout(grandTotal, marketSavings);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Checkout Sekarang</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
