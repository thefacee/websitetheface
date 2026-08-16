export type ProductCategory = 'table' | 'sculpture' | 'accessory' | 'lighting';
export type ProductStatus = 'available' | 'made_to_order' | 'sold';

export type Product = {
  id: string;
  slug: string;
  name_hy: string;
  name_ru: string | null;
  name_en: string | null;
  description_hy: string | null;
  description_ru: string | null;
  description_en: string | null;
  category: ProductCategory;
  material: string | null;
  dimensions: string | null;
  weight_kg: number | null;
  price: number | null;
  currency: string | null;
  status: ProductStatus;
  images: string[];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type Inquiry = {
  id: string;
  type: 'product' | 'custom' | 'contact';
  name: string;
  contact: string;
  message: string | null;
  product_id: string | null;
  product_title: string | null;
  locale: string | null;
  custom_stone: string | null;
  custom_size: string | null;
  custom_finish: string | null;
  custom_budget: string | null;
  status: 'new' | 'in_progress' | 'done';
  created_at: string;
};
