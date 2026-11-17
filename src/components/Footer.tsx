import { ShieldCheck, Truck, Zap } from 'lucide-react';
import React from 'react';
import { CategoryType } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CategoryType) => void;
  onOpenSellModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenSellModal }) => {
  const handleQuickCategory = (cat: CategoryType) => {
    onSelectCategory(cat);
    document.getElementById('katalogSection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-900 text-slate-400 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-dark-900 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-xl text-white">
                KICK<span className="text-emerald-400">VAULT</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Platform jual beli dan konsinyasi sepatu terpercaya di Indonesia dengan indikator transparansi harga
              retail resmi &amp; harga pasaran real-time.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Legit Check 14-Titik</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Pengiriman Diasuransikan</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-sm mb-3">Kategori Populer</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleQuickCategory('Sneakers')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Sneakers &amp; Streetwear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleQuickCategory('Running')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Sepatu Lari &amp; Marathon
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleQuickCategory('Basketball')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Sepatu Basket Pro
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleQuickCategory('Boots/Formal')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Boots &amp; Kulit Formal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-sm mb-3">Layanan Penjual</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={onOpenSellModal}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Titip Jual / Consignment
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSellModal}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Jual Sepatu Koleksi
                </button>
              </li>
              <li>
                <span className="text-slate-500">Komisi Penjual Mulai 5%</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <p>&copy; 2026 KickVault Indonesia. Semua Hak Dilindungi.</p>
          <p className="text-slate-500">Data harga pasaran diperbarui secara berkala untuk referensi pembeli.</p>
        </div>
      </div>
    </footer>
  );
};
