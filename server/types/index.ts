export interface UserItem {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: 'Super Admin' | 'Admin' | 'Editor' | 'News Admin' | 'PMB Admin' | 'Operator PMB' | 'Operator Store';
  email: string;
  avatar?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  author: string;
  views: number;
}

export interface WebsiteImage {
  id: string;
  section: string;
  label: string;
  url: string;
}

export interface AlumniItem {
  id: string;
  name: string;
  graduationYear: number;
  program: string;
  company: string;
  position: string;
  testimonial: string;
  image?: string;
}

export interface PageSectionConfig {
  id: string;
  name: string;
  label: string;
  isEnabled: boolean;
}

export interface BannerPromoItem {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
  isEnabled: boolean;
}

export interface PopupPromoConfig {
  id: string;
  image: string;
  title: string;
  link: string;
  isEnabled: boolean;
}

export interface RunningTextConfig {
  id: string;
  text: string;
  isEnabled: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
  isEnabled: boolean;
}

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'Uniform' | 'Attribute' | 'Book' | 'Merchandise';
  stock: number;
}

export interface StoreOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Cancelled';
  date: string;
  paymentReceipt?: string;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  logo: string;
  favicon: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}
