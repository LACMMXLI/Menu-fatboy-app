import { useCartStore } from '@/hooks/useCartStore';
import { useBranchStore } from '@/hooks/useBranchStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuantityControl } from '@/components/QuantityControl';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { showError } from '@/utils/toast';

export default function CartPage() {
  const { items, customerName, setCustomerName, addItem, removeItem, subtotal } = useCartStore();
  const { selectedBranch } = useBranchStore();

  const handleConfirm = () => {
    if (!selectedBranch) {
      showError("Error: No hay sucursal seleccionada.");
      return;
    }
    if (items.length === 0) {
      showError("Tu carrito está vacío.");
      return;
    }
    const url = buildWhatsAppLink(selectedBranch, items, customerName, subtotal());
    window.open(url, '_blank');
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Tu Pedido</h1>
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground">El carrito está vacío.</p>
      ) : (
        <>
          <div className="divide-y dark:divide-gray-700">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div className="flex-1 pr-4">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <QuantityControl
                  quantity={item.quantity}
                  onAdd={() => addItem(item)}
                  onRemove={() => removeItem(item.id)}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-4 border-t pt-6 dark:border-gray-700">
            <div>
              <Label htmlFor="customerName">Nombre (opcional)</Label>
              <Input
                id="customerName"
                placeholder="Para identificar tu pedido"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Subtotal:</span>
              <span>${subtotal().toFixed(2)}</span>
            </div>
            <Button onClick={handleConfirm} className="w-full py-6 text-lg">
              Confirmar y Enviar por WhatsApp
            </Button>
          </div>
        </>
      )}
    </div>
  );
}