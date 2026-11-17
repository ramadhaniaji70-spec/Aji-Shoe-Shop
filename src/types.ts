export type CategoryType =
  | 'Semua'
  | 'Sneakers'
  | 'Running'
  | 'Basketball'
  | 'Skateboarding'
  | 'Boots/Formal'
  | 'Outdoor/Trail'
  | 'Slides/Sandals';

export type ProductCategory = Exclude<CategoryType, 'Semua'>;

export type ConditionFilter = 'Semua' | 'Baru' | 'Pre-loved';
export type ProductCondition = Exclude<ConditionFilter, 'Semua'>;

export type SortOption =
  | 'featured'
  | 'discount_desc'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc';

export interface ProductReview {
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  condition: ProductCondition;
  price: number;
  retailPrice: number;
  marketPrice: number;
  rating: number;
  reviewCount: number;
  sizes: number[];
  seller: string;
  image: string;
  description: string;
  reviews: ProductReview[];
}

export interface CartItem {
  productId: string;
  size: number;
  qty: number;
}

export interface FilterState {
  search: string;
  category: CategoryType;
  brand: string;
  condition: ConditionFilter;
  sort: SortOption;
  wishlistOnly: boolean;
}

export interface OrderSummary {
  invoiceId: string;
  paidAmount: number;
  savedAmount: number;
}

export type ToastType = 'success' | 'info' | 'error';

export interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}
