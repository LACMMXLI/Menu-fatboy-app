import type { Branch, CartItem, CustomerDetails } from "@/lib/types";

export function buildWhatsAppLink(
  branch: Branch,
  items: CartItem[],
  details: CustomerDetails,
  subtotal: number
): string {
  const phone = branch.phone;
  const DELIVERY_FEE = 50;
  
  const isDelivery = details.deliveryMethod === 'delivery';
  const modality = isDelivery ? "🛵 Modalidad: Domicilio" : `🏠 Modalidad: Para recoger en ${branch.name}`;
  
  const header = `*${isDelivery ? 'Nuevo Pedido a Domicilio' : 'Nuevo Pedido para Recoger'}*`;
  const paymentText = details.paymentMethod === 'card' ? '💳 Tarjeta' : '💵 Efectivo';

  const customerInfo = [
    `👤 Nombre: ${details.customerName}`,
    `📞 Teléfono: ${details.customerPhone}`,
    `💰 Pago: ${paymentText}`
  ];

  if (isDelivery) {
    customerInfo.push(`📍 Dirección: ${details.address}`);
    if (details.reference) {
      customerInfo.push(`🗺️ Referencia: ${details.reference}`);
    }
  }

  const orderItems = items.map(item => `- ${item.quantity} x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`).join('\n');
  
  const totalAmount = isDelivery ? subtotal + DELIVERY_FEE : subtotal;
  const deliveryFeeLine = isDelivery ? `\nCuota de envío: $${DELIVERY_FEE.toFixed(2)}` : '';
  
  const total = `*Total final: $${totalAmount.toFixed(2)}*`;

  const message = [
    header,
    ...customerInfo,
    "",
    "*Pedido:*",
    orderItems,
    deliveryFeeLine,
    "",
    total,
    modality
  ].join('\n');
  
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}