import { ChevronDown, RotateCcw, Tags } from 'lucide-react';
import React from 'react';
import { CATEGORIES } from '../data/products';
import { CategoryType, ConditionFilter, FilterState, SortOption } from '../types';

interface FilterBarProps {
  filterState: FilterState;
  allBrands: { name: string; count: number }[];
  scopedBrands: { name: string; count: number }[];
  filteredCount: number;
  totalCount: number;
  onCategoryChange: (cat: CategoryType) => void;
  onBrandChange: (brand: string) => void;
  onConditionChange: (cond: ConditionFilter) => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  onResetDemoData: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  allBrands,
  scopedBrands,
  filteredCount,
  totalCount,
  onCategoryChange,
  onBrandChange,
  onConditionChange,
  onSortChange,
  onResetFilters,
  onResetDemoData,
}) => {
  const hasActiveFilter =
    Boolean(filterState.search) ||
    filterState.category !== 'Semua' ||
    filterState.brand !== 'Semua' ||
    filterState.condition !== 'Semua' ||
    filterState.wishlistOnly;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {CATEGORIES.map((cat) => {
            const isActive = filterState.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onCategoryChange(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[40px] ${
                  isActive
                    ? 'bg-dark-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Brand, Condition & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Dynamic Brand Select */}
          <div className="relative">
            <select
              value={filterState.brand}
              onChange={(e) => onBrandChange(e.target.value)}
              aria-label="Filter berdasarkan brand"
              className="appearance-none bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl pl-3.5 pr-8 py-2 outline-none focus:border-emerald-500 cursor-pointer max-w-[200px] sm:max-w-[230px] min-h-[40px]"
            >
              <option value="Semua">Semua Brand ({allBrands.length})</option>
              {allBrands.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} ({b.count})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Condition Segmented Control */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(
              [
                { value: 'Semua', label: 'Semua' },
                { value: 'Baru', label: 'Baru' },
                { value: 'Pre-loved', label: 'Titip Jual' },
              ] as { value: ConditionFilter; label: string }[]
            ).map((cond) => {
              const isActive = filterState.condition === cond.value;
              return (
                <button
                  key={cond.value}
                  type="button"
                  onClick={() => onConditionChange(cond.value)}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cond.label}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filterState.sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Urutkan katalog"
              className="w-full sm:w-auto appearance-none bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl pl-3.5 pr-9 py-2 outline-none focus:border-emerald-500 cursor-pointer min-h-[40px]"
            >
              <option value="featured">Urutkan: Rekomendasi</option>
              <option value="discount_desc">Hemat Terbesar (%)</option>
              <option value="price_asc">Harga: Termurah</option>
              <option value="price_desc">Harga: Termahal</option>
              <option value="rating_desc">Rating Tertinggi</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Interactive Brand Explorer Strip */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <Tags className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {filterState.category === 'Semua'
                ? `Jelajahi ${scopedBrands.length} Brand Resmi`
                : `Brand di Kategori ${filterState.category}`}
            </span>
          </span>
          <span className="text-xs font-semibold text-emerald-700 tabular-nums">
            {scopedBrands.length} Brand Tersedia
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => onBrandChange('Semua')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
              filterState.brand === 'Semua'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Semua
          </button>
          {scopedBrands.map((brand) => {
            const isSelected = filterState.brand === brand.name;
            return (
              <button
                key={brand.name}
                type="button"
                onClick={() => onBrandChange(brand.name)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-dark-900 text-white border-dark-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                }`}
              >
                {brand.name} <span className="text-[10px] opacity-70 tabular-nums">({brand.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Results Summary & Demo Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700 tabular-nums">
            Menampilkan {filteredCount} dari {totalCount} sepatu
          </span>
          {hasActiveFilter && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">Filter Aktif</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="text-slate-600 hover:text-slate-900 underline cursor-pointer py-1"
          >
            Reset Filter
          </button>
          <span className="text-slate-300" aria-hidden="true">
            |
          </span>
          <button
            type="button"
            onClick={onResetDemoData}
            title="Kembalikan data katalog lengkap terbaru"
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Katalog Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};
