const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  model: string;
  description: string | null;
  characteristics: Record<string, string> | null;
  price: string;
  stock: number;
  minStock: number;
  maxStock: number;
  active: boolean;
  images: ProductImage[];
}

export interface StoreSettings {
  bankCbu: string;
  bankAlias: string | null;
  bankHolder: string;
  ticketHours: number;
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNote?: string;
  items: OrderItemPayload[];
}

export interface Order {
  id: string;
  ticketNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerNote: string | null;
  subtotal: string;
  total: string;
  bankCbu: string;
  bankAlias: string | null;
  bankHolder: string;
  expiresAt: string;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: string;
    subtotal: string;
  }[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Error ${res.status}`);
  }
  return res.json();
}

export function getProducts(params?: { search?: string; brand?: string }) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.brand) qs.set('brand', params.brand);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return request<Product[]>(`/public/products${suffix}`);
}

export function getProduct(id: string) {
  return request<Product>(`/public/products/${id}`);
}

export function getSettings() {
  return request<StoreSettings>('/public/settings');
}

export function createOrder(payload: CreateOrderPayload) {
  return request<Order>('/public/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getOrder(idOrTicket: string) {
  return request<Order>(`/public/orders/${idOrTicket}`);
}

export function imageUrl(url: string) {
  if (url.startsWith('http')) return url;
  const base = process.env.NEXT_PUBLIC_UPLOADS_URL ?? 'http://localhost:3000';
  return `${base}${url}`;
}
