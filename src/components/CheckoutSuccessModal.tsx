import { CheckCircle2 } from 'lucide-react';
import React from 'react';
import { formatRupiah } from '../data/products';
import { OrderSummary } from '../types';

interface CheckoutSuccessModalProps {
  order: OrderSummary | null;
  onClose: () => void;
}

export const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm p-4 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-success-title"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 animate-pop space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
            Pesanan Berhasil Dibuat
          </span>
          <h3 id="checkout-success-title" className="font-display font-extrabold text-xl text-slate-900 mt-1">
            Terima Kasih Telah Berbelanja!
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ID Pesanan: <strong className="text-slate-800 tabular-nums">{order.invoiceId}</strong>
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-slate-200/80">
          <div className="flex justify-between">
            <span className="text-slate-500">Total Dibayar:</span>
            <span className="font-bold text-slate-900 tabular-nums">{formatRupiah(order.paidAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Hemat Pasar:</span>
            <span className="font-bold text-emerald-600 tabular-nums">{formatRupiah(order.savedAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status Verifikasi:</span>
            <span className="font-semibold text-blue-600">Menunggu Legit Check Hub</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-dark-900 hover:bg-emerald-600 text-white font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer"
        >
          Lanjut Jelajahi Sepatu
        </button>
      </div>
    </div>
  );
};
