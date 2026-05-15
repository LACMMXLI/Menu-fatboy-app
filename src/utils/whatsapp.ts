import type { Branch, CartItem, CustomerDetails } from "@/lib/types";

export function buildWhatsAppLink(
  branch: Branch,
  items: CartItem[],
  details: CustomerDetails,
  subtotal: number
): string {
  const phone = branch.phone;
  const DELIVERY_FEE = 50;
  
  const modality = `🏠 Modalidad: Para recoger en ${branch.name}`;
  
  const header = `*Nuevo Pedido para Recoger*`;
  const paymentText = details.paymentMethod === 'card' ? '💳 Tarjeta' : '💵 Efectivo';

  const customerInfo = [
    `👤 Nombre: ${details.customerName}`,
    `📞 Teléfono: ${details.customerPhone}`,
    `💰 Pago: ${paymentText}`
  ];

  const orderItems = items.map(item => `- ${item.quantity} x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`).join('\n');
  
  const total = `*Total final: $${subtotal.toFixed(2)}*`;

  const message = [
    header,
    ...customerInfo,
    "",
    "*Pedido:*",
    orderItems,
    "",
    total,
    modality
  ].join('\n');
  
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}