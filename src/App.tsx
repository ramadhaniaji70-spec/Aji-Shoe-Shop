import { AlertCircle, CheckCircle2, Footprints, Info } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutSuccessModal } from './components/CheckoutSuccessModal';
import { FilterBar } from './components/FilterBar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellShoeModal } from './components/SellShoeModal';
import { calculateMarketDiscount, INITIAL_PRODUCTS, STORAGE_KEYS } from './data/products';
import {
  CartItem,
  CategoryType,
  ConditionFilter,
  FilterState,
  OrderSummary,
  Product,
  ProductReview,
  SortOption,
  ToastState,
  ToastType,
} from './types';

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
  );
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>(STORAGE_KEYS.CART, []));
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.WISHLIST, [])
  );

  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    category: 'Semua',
    brand: 'Semua',
    condition: 'Semua',
    sort: 'featured',
    wishlistOnly: false,
  });

  const [modalProductId, setModalProductId] = useState<string | null>(null);
  const [focusReviews, setFocusReviews] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Body scroll lock when any overlay is open
  useEffect(() => {
    const anyOverlayOpen = Boolean(modalProductId) || isSellModalOpen || isCartOpen || Boolean(orderSummary);
    document.body.classList.toggle('overflow-hidden', anyOverlayOpen);
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [modalProductId, isSellModalOpen, isCartOpen, orderSummary]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ id: Date.now(), message, type });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  // Compute all brands & category-scoped brands
  const allBrands = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.keys(counts)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name, count: counts[name] }));
  }, [products]);

  const scopedBrands = useMemo(() => {
    const scoped =
      filterState.category === 'Semua'
        ? products
        : products.filter((p) => p.category === filterState.category);
    const counts: Record<string, number> = {};
    scoped.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.keys(counts)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name, count: counts[name] }));
  }, [products, filterState.category]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const q = filterState.search.trim().toLowerCase();
    const filtered = products.filter((item) => {
      if (q) {
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.seller.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filterState.category !== 'Semua' && item.category !== filterState.category) return false;
      if (filterState.brand !== 'Semua' && item.brand !== filterState.brand) return false;
      if (filterState.condition !== 'Semua' && item.condition !== filterState.condition) return false;
      if (filterState.wishlistOnly && !wishlist.includes(item.id)) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (filterState.sort) {
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'discount_desc':
        sorted.sort(
          (a, b) =>
            calculateMarketDiscount(b.price, b.marketPrice) -
            calculateMarketDiscount(a.price, a.marketPrice)
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [products, filterState, wishlist]);

  const activeModalProduct = useMemo(
    () => products.find((p) => p.id === modalProductId) ?? null,
    [products, modalProductId]
  );

  const totalCartItems = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  // Handlers
  const handleCategoryChange = (category: CategoryType) => {
    setFilterState((prev) => {
      let nextBrand = prev.brand;
      if (category !== 'Semua' && prev.brand !== 'Semua') {
        const existsInCat = products.some((p) => p.category === category && p.brand === prev.brand);
        if (!existsInCat) nextBrand = 'Semua';
      }
      return { ...prev, category, brand: nextBrand };
    });
  };

  const handleBrandChange = (brand: string) => {
    setFilterState((prev) => ({ ...prev, brand }));
  };

  const handleConditionChange = (condition: ConditionFilter) => {
    setFilterState((prev) => ({ ...prev, condition }));
  };

  const handleSortChange = (sort: SortOption) => {
    setFilterState((prev) => ({ ...prev, sort }));
  };

  const handleSearchChange = (search: string) => {
    setFilterState((prev) => ({ ...prev, search }));
  };

  const handleToggleWishlistFilter = () => {
    setFilterState((prev) => {
      const next = !prev.wishlistOnly;
      if (next) showToast('Menampilkan sepatu favorit Anda', 'info');
      return { ...prev, wishlistOnly: next };
    });
  };

  const handleResetFilters = () => {
    setFilterState({
      search: '',
      category: 'Semua',
      brand: 'Semua',
      condition: 'Semua',
      sort: 'featured',
      wishlistOnly: false,
    });
  };

  const handleResetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setWishlist([]);
    setPromoApplied(false);
    handleResetFilters();
    showToast('Data katalog demo berhasil dikembalikan ke awal!', 'success');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Dihapus dari daftar favorit', 'info');
        return prev.filter((id) => id !== productId);
      }
      showToast('Ditambahkan ke daftar favorit!', 'success');
      return [...prev, productId];
    });
  };

  const handleOpenDetail = (productId: string, scrollReviews = false) => {
    setFocusReviews(scrollReviews);
    setModalProductId(productId);
  };

  const handleAddToCart = (productId: string, size: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.productId === productId && item.size === size);
      if (idx > -1) {
        return prev.map((item, i) => (i === idx ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { productId, size, qty: 1 }];
    });
    setModalProductId(null);
    setIsCartOpen(true);
    showToast(`Sepatu (EU ${size}) ditambahkan ke keranjang!`, 'success');
  };

  const handleUpdateCartQty = (index: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, i) => (i === index ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item dihapus dari keranjang', 'info');
  };

  const handleApplyPromo = (code: string): boolean => {
    const isValid = code.trim().toUpperCase() === 'SNEAKER10';
    setPromoApplied(isValid);
    return isValid;
  };

  const handleCheckout = (paidAmount: number, savedAmount: number) => {
    const invoiceId = '#KV-' + Math.floor(100000 + Math.random() * 900000);
    setCart([]);
    setPromoApplied(false);
    setIsCartOpen(false);
    setOrderSummary({ invoiceId, paidAmount, savedAmount });
  };

  const handleAddReview = (productId: string, review: Omit<ProductReview, 'date'>) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) return product;
        const totalScore = product.rating * product.reviewCount + review.rating;
        const nextCount = product.reviewCount + 1;
        const nextRating = Number((totalScore / nextCount).toFixed(1));
        return {
          ...product,
          reviewCount: nextCount,
          rating: nextRating,
          reviews: [{ ...review, date: 'Baru saja' }, ...product.reviews],
        };
      })
    );
    showToast('Ulasan Anda berhasil ditambahkan!', 'success');
  };

  const handleCreateProduct = (newShoe: Product) => {
    setProducts((prev) => [newShoe, ...prev]);
    handleResetFilters();
    setIsSellModalOpen(false);
    showToast(`"${newShoe.name}" berhasil ditayangkan ke katalog!`, 'success');
    document.getElementById('katalogSection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyPromoCode = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText('SNEAKER10').catch(() => {});
    }
    showToast('Kode promo SNEAKER10 disalin ke clipboard!', 'success');
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        searchQuery={filterState.search}
        onSearchChange={handleSearchChange}
        onResetFilters={handleResetFilters}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        wishlistCount={wishlist.length}
        wishlistOnly={filterState.wishlistOnly}
        onToggleWishlistFilter={handleToggleWishlistFilter}
        cartCount={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onCopyPromoCode={handleCopyPromoCode}
      />

      <HeroSection brandCount={allBrands.length} onOpenSellModal={() => setIsSellModalOpen(true)} />

      <main id="katalogSection" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          filterState={filterState}
          allBrands={allBrands}
          scopedBrands={scopedBrands}
          filteredCount={filteredProducts.length}
          totalCount={products.length}
          onCategoryChange={handleCategoryChange}
          onBrandChange={handleBrandChange}
          onConditionChange={handleConditionChange}
          onSortChange={handleSortChange}
          onResetFilters={handleResetFilters}
          onResetDemoData={handleResetDemoData}
        />

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Footprints className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Sepatu tidak ditemukan</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
              Coba ubah kata kunci pencarian, pilih kategori lain, atau tampilkan semua kondisi sepatu.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-dark-900 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Tampilkan Semua Sepatu
            </button>
          </div>
        )}
      </main>

      <Footer onSelectCategory={handleCategoryChange} onOpenSellModal={() => setIsSellModalOpen(true)} />

      {/* Product Detail & Reviews Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        focusReviewsOnOpen={focusReviews}
        isWishlisted={activeModalProduct ? wishlist.includes(activeModalProduct.id) : false}
        onClose={() => setModalProductId(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onAddReview={handleAddReview}
      />

      {/* Sell / Consign Modal */}
      <SellShoeModal
        isOpen={isSellModalOpen}
        availableBrands={allBrands.map((b) => b.name)}
        onClose={() => setIsSellModalOpen(false)}
        onCreateProduct={handleCreateProduct}
        onShowToast={showToast}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        products={products}
        promoApplied={promoApplied}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onApplyPromo={handleApplyPromo}
        onCheckout={handleCheckout}
      />

      {/* Checkout Success Confirmation */}
      <CheckoutSuccessModal order={orderSummary} onClose={() => setOrderSummary(null)} />

      {/* Toast Notification */}
      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-dark-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-medium animate-pop"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
