import type { Branch, CartItem } from "@/lib/types";

export function buildWhatsAppLink(
  branch: Branch,
  items: CartItem[],
  customerName: string,
  subtotal: number
): string {
  const phone = branch.phone;
  
  const header = `*Pedido para recoger en ${branch.name}*`;
  const name = `Nombre: ${customerName || "N/A"}`;
  
  const orderItems = items.map(item => `- ${item.quantity} x ${item.name}`).join('\n');
  
  const total = `Total estimado: $${subtotal.toFixed(2)}`;
  const modality = "Modalidad: Para recoger";

  const message = [header, name, "*Pedido:*", orderItems, total, modality].join('\n\n');
  
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}