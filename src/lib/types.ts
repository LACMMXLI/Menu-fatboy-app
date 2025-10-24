export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  status: "active" | "inactive";
  description?: string;
  order: number; // Nuevo campo
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
}