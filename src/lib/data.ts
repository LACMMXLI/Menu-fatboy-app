import type { Branch, Category, Product } from "./types";

export const branches: Branch[] = [
  { id: "venecia", name: "Venecia", phone: "526861105191" },
  { id: "san-marcos", name: "San Marcos", phone: "526862761824" },
];

export const categories: Category[] = [
  { id: "1", name: "Cafés Calientes", order: 1, status: "active" },
  { id: "2", name: "Cafés Fríos", order: 2, status: "active" },
  { id: "3", name: "Tés y Tisanas", order: 3, status: "active" },
  { id: "4", name: "Repostería", order: 4, status: "active" },
];

export const products: Product[] = [
  // Cafés Calientes
  { id: "p1", name: "Espresso", price: 35, categoryId: "1", status: "active" },
  { id: "p2", name: "Americano", price: 40, categoryId: "1", status: "active" },
  { id: "p3", name: "Latte", price: 55, categoryId: "1", status: "active", description: "Leche vaporizada y espresso." },
  { id: "p4", name: "Capuccino", price: 55, categoryId: "1", status: "active" },
  
  // Cafés Fríos
  { id: "p5", name: "Cold Brew", price: 60, categoryId: "2", status: "active" },
  { id: "p6", name: "Iced Latte", price: 60, categoryId: "2", status: "active" },
  { id: "p7", name: "Frappé Clásico", price: 70, categoryId: "2", status: "active", description: "Café, hielo y leche." },

  // Tés y Tisanas
  { id: "p8", name: "Té Verde", price: 45, categoryId: "3", status: "active" },
  { id: "p9", name: "Tisana Frutos Rojos", price: 50, categoryId: "3", status: "active" },
  { id: "p10", name: "Chai Latte", price: 60, categoryId: "3", status: "active" },

  // Repostería
  { id: "p11", name: "Croissant", price: 40, categoryId: "4", status: "active" },
  { id: "p12", name: "Muffin de Chocolate", price: 45, categoryId: "4", status: "active" },
  { id: "p13", name: "Galleta de Avena", price: 30, categoryId: "4", status: "active" },
];