import { ArrowDown, ShieldCheck, Tag } from 'lucide-react';
import React from 'react';

interface HeroSectionProps {
  brandCount: number;
  onOpenSellModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ brandCount, onOpenSellModal }) => {
  return (
    <section className="bg-dark-900 text-white relative overflow-hidden">
      {/* Subtle atmospheric lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transparansi Harga Pasaran Real-Time · {brandCount}+ Brand Resmi</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-balance">
              Beli &amp; Titip Jual Sepatu Original di{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Bawah Harga Pasar.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Bandingkan langsung harga retail resmi (MSRP), estimasi harga pasar sekunder (Market Price), dan penawaran
              terbaik dari penjual terverifikasi di seluruh Indonesia.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#katalogSection"
                className="bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 whitespace-nowrap min-h-[44px]"
              >
                <span>Jelajahi Katalog</span>
                <ArrowDown className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={onOpenSellModal}
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all inline-flex items-center gap-2 whitespace-nowrap cursor-pointer min-h-[44px]"
              >
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>Mulai Jual Sepatu</span>
              </button>
            </div>
          </div>

          {/* Live Market Insights Card */}
          <div className="lg:col-span-5 flex items-center">
            <div className="w-full bg-dark-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4 gap-2">
                <div>
                  <p className="font-display font-bold text-sm tracking-wide text-white">
                    Referensi Harga Pasaran Terkini
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">7 Kategori · Legit Check 14-Titik</p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 shrink-0">Diperbarui Harian</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">Air Jordan 1 High OG Chicago</p>
                    <p className="text-xs text-slate-400 tabular-nums">Rata-rata pasar: Rp 4.950.000</p>
                  </div>
                  <span className="text-emerald-400 font-bold text-xs shrink-0 tabular-nums">Hemat 22%</span>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">ASICS Gel-Kayano 14 Cream</p>
                    <p className="text-xs text-slate-400 tabular-nums">Rata-rata pasar: Rp 2.490.000</p>
                  </div>
                  <span className="text-emerald-400 font-bold text-xs shrink-0 tabular-nums">Hemat 30%</span>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">Salomon XT-6 Gore-Tex Trail</p>
                    <p className="text-xs text-slate-400 tabular-nums">Rata-rata pasar: Rp 3.650.000</p>
                  </div>
                  <span className="text-emerald-400 font-bold text-xs shrink-0 tabular-nums">Hemat 21%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
