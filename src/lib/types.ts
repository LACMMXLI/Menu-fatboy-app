export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  status: "active" | "inactive";
  description?: string;
  shortDescription?: string;
  order: number;
  isPromotion: boolean;
  imageUrl?: string; // Nuevo campo para la URL de la imagen
}

export interface Category {
  id: string;
  name:string;
  order: number;
  status: "active" | "inactive";
}

export interface Branch {
  id: string;
  name: string;
  phone: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerDetails {
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'pickup';
  paymentMethod: 'cash' | 'card';
}

export interface Order {
  id: string;
  branch_id: string;
  customer_name: string;
  customer_phone?: string;
  payment_method: 'cash' | 'card';
  delivery_method: 'pickup';
  total: number;
  status: 'nuevo' | 'impreso' | 'finalizado' | 'cancelado';
  notes?: string;
  created_at: string;
  printed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}